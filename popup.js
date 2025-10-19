// VERSION: 2.0.0 - WLO Metadata Agent Light
console.log('🎨 WLO Metadata Agent Light - Popup loaded');

// State management
let currentState = 'ready'; // ready, loading, success, error

// DOM Elements
const states = {
    loading: document.getElementById('loading-state'),
    ready: document.getElementById('ready-state'),
    success: document.getElementById('success-state'),
    error: document.getElementById('error-state')
};

const submitBtn = document.getElementById('submit-btn');
const retryBtn = document.getElementById('retry-btn');
const shareAnotherBtn = document.getElementById('share-another-btn');
const errorMessage = document.getElementById('error-message');
const previewLink = document.getElementById('preview-link');
const previewUrl = document.getElementById('preview-url');

// Event Listeners
submitBtn.addEventListener('click', handleSubmit);
retryBtn.addEventListener('click', handleSubmit);
shareAnotherBtn.addEventListener('click', resetToReady);

async function handleSubmit() {
    console.log('📤 Submit button clicked');
    
    try {
        setState('loading');
        
        // Get current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab || !tab.id) {
            throw new Error('Kein aktiver Tab gefunden');
        }
        
        console.log('🔍 Current tab:', tab.url);
        
        // CHECK FOR DUPLICATES FIRST!
        console.log('🔎 Checking for duplicates...');
        const duplicateCheck = await checkForDuplicate(tab.url);
        
        if (duplicateCheck.exists) {
            console.log('⚠️ Duplicate found!', duplicateCheck);
            showDuplicateFound(duplicateCheck);
            return; // Stop here - don't open Canvas
        }
        
        console.log('✅ No duplicate, proceeding...');
        
        // Ensure content script is injected
        console.log('💉 Injecting content script...');
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
            });
            console.log('✅ Content script injected');
        } catch (injectError) {
            console.log('⚠️ Content script might already be loaded:', injectError.message);
        }
        
        // Wait a moment for script to initialize
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Extract page data via content script
        console.log('📄 Extracting page data...');
        const pageData = await chrome.tabs.sendMessage(tab.id, {
            action: 'extractPageData'
        });
        
        if (!pageData || !pageData.success) {
            throw new Error('Konnte Seiteninformationen nicht extrahieren');
        }
        
        console.log('✅ Page data extracted:', pageData.data);
        
        // Open Canvas in sidebar
        console.log('🎨 Opening Canvas...');
        await chrome.tabs.sendMessage(tab.id, {
            action: 'openCanvas',
            pageData: pageData.data
        });
        
        console.log('✅ Canvas opened');
        
        // Close popup (Canvas is now open in sidebar)
        window.close();
        
    } catch (error) {
        console.error('❌ Submit failed:', error);
        
        // Better error message for connection issues
        let errorMsg = error.message;
        if (error.message.includes('connection') || error.message.includes('Receiving end')) {
            errorMsg = 'Bitte lade die Seite neu (F5) und versuche es erneut.';
        }
        
        showError(errorMsg);
    }
}

// Check for duplicate URL in repository
async function checkForDuplicate(url) {
    const apiUrl = 'https://repository.staging.openeduhub.net/edu-sharing/rest/search/v1/queries/-home-/mds_oeh/ngsearch?contentType=FILES&maxItems=1&skipCount=0&propertyFilter=-all-';
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                criteria: [{ property: 'ccm:wwwurl', values: [url] }]
            })
        });
        
        if (!response.ok) {
            console.warn('⚠️ Duplicate check failed, continuing anyway');
            return { exists: false };
        }
        
        const data = await response.json();
        const nodes = Array.isArray(data?.nodes) ? data.nodes : [];
        
        // Find exact match
        const exactNode = nodes.find(node => {
            const urls = Array.isArray(node?.properties?.['ccm:wwwurl']) 
                ? node.properties['ccm:wwwurl'] 
                : [];
            return urls.some(u => typeof u === 'string' && u === url);
        });
        
        if (exactNode) {
            return {
                exists: true,
                title: exactNode?.properties?.['cclom:title']?.[0] || exactNode.title || 'Unbekannter Titel',
                description: exactNode?.properties?.['cclom:general_description']?.[0] || '',
                nodeUrl: exactNode.content?.url || ''
            };
        }
        
        return { exists: false };
        
    } catch (error) {
        console.error('❌ Duplicate check error:', error);
        // Don't block on error - continue
        return { exists: false };
    }
}

// Show duplicate found UI
function showDuplicateFound(duplicate) {
    // Hide all states
    Object.values(states).forEach(el => el.classList.add('hidden'));
    
    // Create duplicate state dynamically
    const duplicateState = document.createElement('div');
    duplicateState.className = 'state';
    duplicateState.innerHTML = `
        <div style="text-align: center; padding: 20px 0;">
            <div style="font-size: 48px; margin-bottom: 16px;">ℹ️</div>
            <h2 style="font-size: 18px; color: #2d3748; margin-bottom: 8px;">Bereits vorhanden!</h2>
            <p style="color: #718096; font-size: 14px; margin-bottom: 20px;">
                Dieser Inhalt existiert bereits im Repository.
            </p>
            
            <div style="background: #f7fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: left;">
                <div style="font-weight: 600; color: #2d3748; margin-bottom: 8px; font-size: 14px;">
                    ${duplicate.title}
                </div>
                ${duplicate.description ? `
                    <div style="color: #718096; font-size: 13px; margin-bottom: 12px; line-height: 1.5;">
                        ${duplicate.description.substring(0, 150)}${duplicate.description.length > 150 ? '...' : ''}
                    </div>
                ` : ''}
                ${duplicate.nodeUrl ? `
                    <a href="${duplicate.nodeUrl}" target="_blank" 
                       style="display: inline-block; color: #667eea; text-decoration: none; font-weight: 600; font-size: 13px;">
                        Im Repository öffnen →
                    </a>
                ` : ''}
            </div>
            
            <button id="close-duplicate-btn" class="btn btn-secondary" style="margin-top: 12px;">
                Schließen
            </button>
        </div>
    `;
    
    document.querySelector('.content').appendChild(duplicateState);
    
    // Close button handler
    document.getElementById('close-duplicate-btn').addEventListener('click', () => {
        window.close();
    });
}

function setState(newState) {
    console.log('🔄 State change:', currentState, '→', newState);
    currentState = newState;
    
    // Hide all states
    Object.values(states).forEach(el => el.classList.add('hidden'));
    
    // Show current state
    if (states[newState]) {
        states[newState].classList.remove('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message || 'Ein unbekannter Fehler ist aufgetreten.';
    setState('error');
}

function showSuccess(nodeId, repositoryUrl) {
    // Show preview link if we have nodeId
    if (nodeId && repositoryUrl) {
        const url = `${repositoryUrl}/components/render/${nodeId}`;
        previewUrl.href = url;
        previewLink.classList.remove('hidden');
    } else {
        previewLink.classList.add('hidden');
    }
    
    setState('success');
}

function resetToReady() {
    setState('ready');
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📥 Message received in popup:', request);
    
    if (request.action === 'submissionSuccess') {
        showSuccess(request.nodeId, request.repositoryUrl);
        sendResponse({ success: true });
    }
    
    if (request.action === 'submissionError') {
        showError(request.error);
        sendResponse({ success: true });
    }
    
    return true;
});

// Initialize
console.log('✅ Popup initialized');
