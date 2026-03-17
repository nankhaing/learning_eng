import { account } from './appwrite.js';

let currentUser = null;
const listeners = [];

export async function getCurrentUser() {
    try {
        const user = await account.get();
        return user;
    } catch {
        return null;
    }
}

export function onAuthStateChange(callback) {
    listeners.push(callback);
    getCurrentUser().then(user => {
        currentUser = user;
        callback(user);
    });
}

// Listen for session changes (Appwrite stores sessions in localStorage)
window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('a_session_')) {
        getCurrentUser().then(user => {
            if (JSON.stringify(user) !== JSON.stringify(currentUser)) {
                currentUser = user;
                listeners.forEach(cb => cb(user));
            }
        });
    }
});

// Also check on focus
window.addEventListener('focus', () => {
    getCurrentUser().then(user => {
        if (JSON.stringify(user) !== JSON.stringify(currentUser)) {
            currentUser = user;
            listeners.forEach(cb => cb(user));
        }
    });
});