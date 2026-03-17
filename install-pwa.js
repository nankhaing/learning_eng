// 📁 public/install-pwa.js

let deferredPrompt;
let installButton = null;

// Listen for install prompt
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('📲 Install prompt available');
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
});

// Show install button
function showInstallButton() {
    // Create install button if not exists
    if (!document.getElementById('installButton')) {
        installButton = document.createElement('button');
        installButton.id = 'installButton';
        installButton.innerHTML = '📲 Install App';
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            animation: slideUp 0.5s ease;
        `;
        
        installButton.addEventListener('click', installApp);
        document.body.appendChild(installButton);
    }
}

// Install app
async function installApp() {
    if (!deferredPrompt) {
        alert('📱 Install prompt not available. Try adding to home screen manually.');
        return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`📲 User response: ${outcome}`);
    
    if (outcome === 'accepted') {
        console.log('✅ App installed!');
        // Track installation in Firebase
        trackInstallation();
    }
    
    // Hide button
    if (installButton) {
        installButton.remove();
        installButton = null;
    }
    
    deferredPrompt = null;
}

// Track installation
async function trackInstallation() {
    const user = auth.currentUser;
    if (user) {
        try {
            await updateDoc(doc(db, "users", user.uid), {
                installed: true,
                installedAt: new Date().toISOString(),
                platform: 'PWA'
            });
        } catch (error) {
            console.error("Error tracking installation:", error);
        }
    }
}

// Check if already installed
window.addEventListener('appinstalled', () => {
    console.log('✅ App was installed');
    if (installButton) {
        installButton.remove();
        installButton = null;
    }
});

// Export for global access
window.installApp = installApp;

