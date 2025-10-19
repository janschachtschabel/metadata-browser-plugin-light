// VERSION: 2.0.0 - Content Script
console.log('🔧 WLO Metadata Agent Light - Content Script loaded');

let isSidebarOpen = false;
let canvasIframe = null;

// Listen for messages from popup and background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📥 Content script received message:', request.action);
    
    if (request.action === 'extractPageData') {
        handleExtractPageData(sendResponse);
        return true; // Async response
    }
    
    if (request.action === 'openCanvas') {
        handleOpenCanvas(request.pageData);
        sendResponse({ success: true });
        return true;
    }
    
    if (request.action === 'closeCanvas') {
        closeCanvas();
        sendResponse({ success: true });
        return true;
    }
});

// Extract page data
function handleExtractPageData(sendResponse) {
    console.log('📄 Extracting page data from:', window.location.href);
    
    try {
        const pageData = {
            url: window.location.href,
            title: document.title || '',
            description: getMetaContent('description') || getMetaContent('og:description') || '',
            keywords: getMetaContent('keywords') || '',
            author: getMetaContent('author') || '',
            language: document.documentElement.lang || 'de',
            
            // Open Graph
            ogImage: getMetaContent('og:image') || '',
            ogType: getMetaContent('og:type') || '',
            
            // Structured Data
            structuredData: extractStructuredData(),
            
            // Main Content
            mainContent: extractMainContent(),
            
            // Timestamps
            extractedAt: new Date().toISOString()
        };
        
        console.log('✅ Page data extracted:', pageData);
        sendResponse({ success: true, data: pageData });
        
    } catch (error) {
        console.error('❌ Extraction failed:', error);
        sendResponse({ success: false, error: error.message });
    }
}

// Get meta tag content
function getMetaContent(name) {
    const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    return meta ? meta.getAttribute('content') : null;
}

// Extract structured data (JSON-LD, Microdata, etc.)
function extractStructuredData() {
    const structuredData = [];
    
    // JSON-LD
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    jsonLdScripts.forEach(script => {
        try {
            const data = JSON.parse(script.textContent);
            structuredData.push(data);
        } catch (e) {
            console.warn('Failed to parse JSON-LD:', e);
        }
    });
    
    return structuredData;
}

// Extract main content (simplified)
function extractMainContent() {
    const selectors = [
        'main',
        'article',
        '[role="main"]',
        '.main-content',
        '#main-content',
        '.content',
        '#content'
    ];
    
    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
            const text = element.innerText || element.textContent;
            return {
                text: text.substring(0, 5000), // Limit to 5000 chars
                html: element.innerHTML.substring(0, 10000) // Limit to 10000 chars
            };
        }
    }
    
    // Fallback: body text
    return {
        text: document.body.innerText.substring(0, 5000),
        html: ''
    };
}

// Open Canvas in sidebar
function handleOpenCanvas(pageData) {
    console.log('🎨 Opening Canvas with page data');
    
    // Close existing sidebar if open
    if (isSidebarOpen) {
        closeCanvas();
    }
    
    // Build data package like the old plugin
    const dataPackage = {
        url: pageData.url,
        title: pageData.title,
        content: {
            main: pageData.mainContent?.text || '',
            cleaned: pageData.mainContent?.html || ''
        },
        meta: {
            description: pageData.description,
            keywords: pageData.keywords,
            author: pageData.author,
            language: pageData.language
        },
        structuredData: pageData.structuredData,
        userInfo: {
            isLoggedIn: false,
            username: 'Gast',
            systemName: 'WLO Staging'
        }
    };
    
    // Format text with URL at the top (important for Canvas!)
    const formattedText = `URL: ${pageData.url}\nTitel: ${pageData.title}\n\n${pageData.mainContent?.text || ''}`;
    
    // Create Canvas URL with encoded data (like old plugin)
    const canvasUrl = new URL('https://metadata-agent-canvas.vercel.app/');
    canvasUrl.searchParams.set('mode', 'browser-extension');
    canvasUrl.searchParams.set('theme', 'edu-sharing');
    
    // Try to encode data into URL parameter (might be too long)
    try {
        const encodedData = btoa(encodeURIComponent(JSON.stringify(dataPackage)));
        // Only add if not too long (URL limit ~2000 chars)
        if (encodedData.length < 1500) {
            canvasUrl.searchParams.set('data', encodedData);
            console.log('📦 Data added to URL (length:', encodedData.length, ')');
        } else {
            console.log('⚠️ Data too long for URL, will use postMessage only');
        }
    } catch (e) {
        console.warn('⚠️ Failed to encode data for URL:', e);
    }
    
    console.log('📦 Data package:', dataPackage);
    console.log('🔗 Canvas URL:', canvasUrl.toString());
    
    // Create iframe
    canvasIframe = document.createElement('iframe');
    canvasIframe.id = 'wlo-canvas-sidebar';
    canvasIframe.src = canvasUrl.toString();
    
    // Styling
    Object.assign(canvasIframe.style, {
        position: 'fixed',
        top: '0',
        right: '0',
        width: '600px',
        height: '100vh',
        border: 'none',
        zIndex: '2147483647',
        backgroundColor: 'white',
        boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.3s ease'
    });
    
    // Add to page
    document.body.appendChild(canvasIframe);
    document.body.style.marginRight = '600px';
    document.body.style.transition = 'margin-right 0.3s ease';
    isSidebarOpen = true;
    
    console.log('✅ Canvas iframe created');
    
    // Wait for iframe to load, then send page data
    canvasIframe.addEventListener('load', () => {
        console.log('✅ Canvas iframe loaded');
        
        setTimeout(() => {
            console.log('📤 Sending page data to Canvas via postMessage');
            
            try {
                // Format exactly like the old plugin - with formatted text containing URL
                const messageData = {
                    type: 'PLUGIN_PAGE_DATA',
                    url: dataPackage.url,
                    title: dataPackage.title,
                    html: dataPackage.content?.cleaned || '',
                    text: formattedText,  // Use formatted text with URL at top!
                    metadata: {
                        meta: dataPackage.meta,
                        structuredData: dataPackage.structuredData
                    },
                    mode: 'browser-extension'
                };
                
                console.log('📦 Sending postMessage:', {
                    type: messageData.type,
                    url: messageData.url,
                    title: messageData.title,
                    htmlLength: messageData.html.length,
                    textLength: messageData.text.length,
                    textPreview: messageData.text.substring(0, 100) + '...'
                });
                
                canvasIframe.contentWindow.postMessage(messageData, '*');
                
                console.log('✅ postMessage sent successfully with type: PLUGIN_PAGE_DATA');
            } catch (error) {
                console.error('❌ Failed to send postMessage:', error);
            }
        }, 1000);
    });
    
    // Listen for messages from Canvas
    window.addEventListener('message', handleCanvasMessage);
}

// Handle messages from Canvas
function handleCanvasMessage(event) {
    console.log('📥 Message from Canvas:', event.data?.type);
    
    // Canvas closed by user
    if (event.data?.type === 'CANVAS_CLOSE') {
        closeCanvas();
    }
    
    // Canvas has metadata ready for submission
    if (event.data?.type === 'CANVAS_METADATA_READY') {
        console.log('📦 Metadata received from Canvas');
        console.log('📋 Metadata fields:', Object.keys(event.data.metadata));
        
        // Send to background script for repository submission (use saveMetadata like old plugin)
        chrome.runtime.sendMessage({
            action: 'saveMetadata',
            metadata: event.data.metadata
        }, (response) => {
            console.log('✅ Submission response:', response);
            
            if (response?.success) {
                // Close Canvas after successful submission
                closeCanvas();
                
                // Show success notification
                showNotification('success', 'Erfolgreich geteilt!', 'Dein Beitrag wurde zur Prüfung eingereicht.');
            } else {
                showNotification('error', 'Fehler', response?.error || 'Submission failed');
            }
        });
    }
}

// Close Canvas sidebar
function closeCanvas() {
    if (canvasIframe && canvasIframe.parentNode) {
        canvasIframe.remove();
        document.body.style.marginRight = '0';
        isSidebarOpen = false;
        console.log('✅ Canvas closed');
    }
}

// Show notification overlay
function showNotification(type, title, message) {
    const notification = document.createElement('div');
    notification.id = 'wlo-notification';
    
    const icon = type === 'success' ? '✅' : '❌';
    const bgColor = type === 'success' ? '#48bb78' : '#f56565';
    
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 2147483647;
            max-width: 350px;
            animation: slideIn 0.3s ease;
        ">
            <div style="font-size: 24px; margin-bottom: 8px;">${icon}</div>
            <div style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">${title}</div>
            <div style="font-size: 14px; opacity: 0.9;">${message}</div>
        </div>
        <style>
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        </style>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

console.log('✅ Content script initialized');
