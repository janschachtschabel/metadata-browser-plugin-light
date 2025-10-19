// VERSION: 2.0.0 - Background Script
console.log('🚀 WLO Metadata Agent Light - Background Script loaded');

// Configuration
const CONFIG = {
    repository: {
        baseUrl: 'https://repository.staging.openeduhub.net/edu-sharing/',
        guestUser: {
            username: 'WLO-Upload',
            password: 'wlo#upload!20'
        }
    },
    canvas: {
        url: 'https://metadata-agent-canvas.vercel.app/'
    },
    api: {
        createNode: 'rest/node/v1/nodes/-home-/21144164-30c0-4c01-ae16-264452197063/children?type=ccm%3Aio&renameIfExists=true&versionComment=MAIN_FILE_UPLOAD',
        setMetadata: 'rest/node/v1/nodes/-home-/',
        startWorkflow: 'rest/node/v1/nodes/-home-/',
        addCollection: 'rest/collection/v1/collections/-home-/'
    }
};

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📥 Background received message:', request.action);
    
    if (request.action === 'submitMetadata' || request.action === 'saveMetadata') {
        handleSubmitMetadata(request.metadata, sender.tab?.id)
            .then(result => sendResponse(result))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Async response
    }
});

// Handle metadata submission to repository
async function handleSubmitMetadata(metadata, tabId) {
    console.log('📦 Submitting metadata to repository...');
    console.log('📋 Metadata:', Object.keys(metadata).join(', '));
    
    try {
        // 1. Create Basic Auth header
        const authHeader = 'Basic ' + btoa(
            `${CONFIG.repository.guestUser.username}:${CONFIG.repository.guestUser.password}`
        );
        
        // 2. Filter essential fields for createNode (5 fields)
        const essentialFields = [
            'cclom:title',
            'cclom:general_description',
            'cclom:general_keyword',
            'ccm:wwwurl',
            'cclom:general_language'
        ];
        
        // Filter and clean metadata (like Webkomponente does)
        const cleanMetadata = {};
        essentialFields.forEach(field => {
            const value = metadata[field];
            // Skip null, undefined, empty strings, and empty arrays
            if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
                return;
            }
            cleanMetadata[field] = value;
        });
        
        // Normalize to arrays (WICHTIG! Wie in Webkomponente Zeile 162-170)
        const createNodeData = {};
        for (const [key, value] of Object.entries(cleanMetadata)) {
            if (Array.isArray(value)) {
                createNodeData[key] = value;
            } else if (value !== null && value !== undefined && value !== '') {
                createNodeData[key] = [value];  // Mache Array!
            }
        }
        
        console.log('🔍 All metadata fields received:', Object.keys(metadata));
        console.log('🔍 createNodeData (normalized to arrays):', JSON.stringify(createNodeData, null, 2));
        
        // Validate required fields
        if (!createNodeData['cclom:title'] || createNodeData['cclom:title'].length === 0) {
            console.error('❌ Missing field: cclom:title');
            console.error('❌ Available fields:', Object.keys(metadata));
            throw new Error('Titel ist erforderlich (cclom:title fehlt)');
        }
        if (!createNodeData['ccm:wwwurl'] || createNodeData['ccm:wwwurl'].length === 0) {
            console.error('❌ Missing field: ccm:wwwurl');
            console.error('❌ Available fields:', Object.keys(metadata));
            throw new Error('URL ist erforderlich (ccm:wwwurl fehlt)');
        }
        
        // 3. Create Node
        console.log('📍 Creating node...');
        const createUrl = CONFIG.repository.baseUrl + CONFIG.api.createNode;
        
        const createResponse = await fetch(createUrl, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(createNodeData)
        });
        
        if (!createResponse.ok) {
            let errorText = '';
            try {
                errorText = await createResponse.text();
                console.error('❌ Create node failed:', createResponse.status);
                console.error('❌ Error response (full):', errorText);
                
                // Try to parse as JSON for better error details
                try {
                    const errorJson = JSON.parse(errorText);
                    console.error('❌ Error JSON:', JSON.stringify(errorJson, null, 2));
                } catch (e) {
                    console.error('❌ Error is not JSON (HTML)');
                }
            } catch (e) {
                console.error('❌ Could not read error response');
            }
            
            // Show detailed notification
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/128.png',
                title: 'WLO Metadata Agent - Error',
                message: `❌ Create node failed (${createResponse.status})\n\nBitte prüfe die Background Console für Details.`,
                priority: 2
            });
            
            throw new Error(`Create node failed: ${createResponse.status} - ${errorText.substring(0, 200)}`);
        }
        
        let nodeData;
        try {
            nodeData = await createResponse.json();
        } catch (e) {
            throw new Error('Invalid JSON response from server');
        }
        
        if (!nodeData?.node?.ref?.id) {
            throw new Error('Invalid node data structure');
        }
        
        const nodeId = nodeData.node.ref.id;
        console.log('✅ Node created:', nodeId);
        
        // 4. Set remaining metadata
        const metadataUrl = `${CONFIG.repository.baseUrl}${CONFIG.api.setMetadata}${nodeId}/metadata?versionComment=Canvas_Metadata`;
        
        const remainingMetadata = {};
        Object.keys(metadata).forEach(key => {
            if (!essentialFields.includes(key) && !key.startsWith('virtual:')) {
                remainingMetadata[key] = metadata[key];
            }
        });
        
        if (Object.keys(remainingMetadata).length > 0) {
            console.log('📝 Setting remaining metadata...');
            
            const metadataResponse = await fetch(metadataUrl, {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(remainingMetadata)
            });
            
            if (metadataResponse.ok) {
                console.log('✅ Metadata set:', Object.keys(remainingMetadata).join(', '));
            } else {
                console.warn('⚠️ Metadata set failed (non-critical)');
            }
        }
        
        // 5. Start Workflow (optional)
        const workflowUrl = `${CONFIG.repository.baseUrl}${CONFIG.api.startWorkflow}${nodeId}/workflow`;
        
        try {
            const workflowResponse = await fetch(workflowUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    receiver: [{ authorityName: 'GROUP_ORG_WLO-Uploadmanager' }],
                    comment: 'Upload via Canvas + Browser Extension Light (Gast)',
                    status: '200_tocheck',
                    logLevel: 'info'
                })
            });
            
            if (workflowResponse.ok) {
                console.log('✅ Workflow started');
            } else {
                console.warn('⚠️ Workflow failed (non-critical)');
            }
        } catch (e) {
            console.warn('⚠️ Workflow error (non-critical):', e.message);
        }
        
        // 6. Show success notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/128.png',
            title: 'WLO Metadata Agent',
            message: '✅ Inhalt erfolgreich geteilt!',
            priority: 2
        });
        
        console.log('✅ Submission complete!');
        
        return {
            success: true,
            nodeId: nodeId,
            repositoryUrl: CONFIG.repository.baseUrl
        };
        
    } catch (error) {
        console.error('❌ Submission failed:', error);
        
        // Show error notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/128.png',
            title: 'WLO Metadata Agent',
            message: '❌ Fehler: ' + error.message,
            priority: 2
        });
        
        return {
            success: false,
            error: error.message
        };
    }
}

// Initialize
console.log('✅ Background script initialized');
console.log('🔧 Config:', {
    repository: CONFIG.repository.baseUrl,
    canvas: CONFIG.canvas.url
});
