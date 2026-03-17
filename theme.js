// 📁 theme.js
import { getCurrentUser, getUserData, updateUserData } from './appwrite-config.js';

export async function initTheme() {
    let theme = localStorage.getItem('theme') || 'light';
    
    const user = await getCurrentUser();
    if (user.success) {
        const userData = await getUserData(user.user.$id);
        if (userData.success) {
            theme = userData.data.theme || theme;
        }
    }
    
    applyTheme(theme);
}

export function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

export async function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    
    applyTheme(next);
    
    const user = await getCurrentUser();
    if (user.success) {
        const userData = await getUserData(user.user.$id);
        if (userData.success) {
            await updateUserData(userData.docId, { theme: next });
        }
    }
}

window.toggleTheme = toggleTheme;
export { initTheme, applyTheme };