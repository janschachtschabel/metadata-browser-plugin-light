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
