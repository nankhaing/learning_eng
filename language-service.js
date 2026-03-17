// 📁 language-service.js
import { getCurrentUser, getUserData, updateUserData } from './appwrite-config.js';

export const languages = {
    en: { name: 'English', flag: '🇺🇸' },
    my: { name: 'မြန်မာ', flag: '🇲🇲' },
    zh: { name: '中文', flag: '🇨🇳' },
    es: { name: 'Español', flag: '🇪🇸' },
    fr: { name: 'Français', flag: '🇫🇷' }
};

export const translations = {
    en: {
        'login.title': 'English Learning',
        'login.button': 'Login',
        'dashboard.welcome': 'Hello',
        'common.save': 'Save',
        'common.cancel': 'Cancel'
    },
    my: {
        'login.title': 'အင်္ဂလိပ်စာ သင်ယူခြင်း',
        'login.button': 'ဝင်ရောက်ရန်',
        'dashboard.welcome': 'မင်္ဂလာပါ',
        'common.save': 'သိမ်းဆည်းရန်',
        'common.cancel': 'ပယ်ဖျက်ရန်'
    }
};

let currentLang = 'en';

export async function initLanguage() {
    let lang = localStorage.getItem('language') || 'en';
    
    const user = await getCurrentUser();
    if (user.success) {
        const userData = await getUserData(user.user.$id);
        if (userData.success) {
            lang = userData.data.language || lang;
        }
    }
    
    setLanguage(lang);
}

export function setLanguage(lang) {
    if (!languages[lang]) lang = 'en';
    
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('lang', lang);
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang]?.[key]) {
            el.innerText = translations[lang][key];
        }
    });
    
    const user = getCurrentUser();
    if (user.success) {
        getUserData(user.user.$id).then(userData => {
            if (userData.success) {
                updateUserData(userData.docId, { language: lang });
            }
        });
    }
}

export function getTranslation(key) {
    return translations[currentLang]?.[key] || key;
}

window.setLanguage = setLanguage;
window.getTranslation = getTranslation;
export { initLanguage };