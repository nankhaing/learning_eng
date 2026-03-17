// 📁 audio-service.js
import { getCurrentUser, getUserData, updateUserData } from './appwrite-config.js';

let bgMusic = null;
let musicEnabled = true;
let sfxEnabled = true;
let currentTrack = 'calm';

export async function initAudio() {
    const user = await getCurrentUser();
    
    if (user.success) {
        const userData = await getUserData(user.user.$id);
        if (userData.success) {
            const s = userData.data.audioSettings || {};
            musicEnabled = s.musicEnabled ?? true;
            sfxEnabled = s.sfxEnabled ?? true;
        }
    }
    
    try {
        bgMusic = new Audio('assets/audio/music/calm.mp3');
        bgMusic.loop = true;
        bgMusic.volume = 0.3;
        
        document.addEventListener('click', () => {
            if (musicEnabled && bgMusic) {
                bgMusic.play().catch(() => {});
            }
        }, { once: true });
        
        console.log('✅ Audio initialized');
    } catch (error) {
        console.warn('⚠️ Audio files missing');
    }
}

export function playSFX(name) {
    if (!sfxEnabled) return;
    
    try {
        const sfx = new Audio(`assets/audio/sfx/${name}.mp3`);
        sfx.volume = 0.5;
        sfx.play().catch(() => {});
    } catch (error) {}
}

export function loadMusicTrack(trackName) {
    if (!bgMusic) return;
        const tracks = {
        calm: 'assets/audio/music/calm.mp3',
        upbeat: 'assets/audio/music/upbeat.mp3',
        classical: 'assets/audio/music/classical.mp3',
        nature: 'assets/audio/music/nature.mp3',
        lofi: 'assets/audio/music/lofi.mp3'
    };
    
    if (tracks[trackName]) {
        bgMusic.src = tracks[trackName];
        currentTrack = trackName;
        if (musicEnabled) {
            bgMusic.play().catch(() => {});
        }
    }
}

export function toggleMusic() {
    musicEnabled = !musicEnabled;
    if (bgMusic) {
        musicEnabled ? bgMusic.play().catch(() => {}) : bgMusic.pause();
    }
}

export function toggleSFX() {
    sfxEnabled = !sfxEnabled;
}

export async function saveAudioSettings() {
    const user = await getCurrentUser();
    if (user.success) {
        const userData = await getUserData(user.user.$id);
        if (userData.success) {
            await updateUserData(userData.docId, {
                audioSettings: {
                    musicEnabled,
                    sfxEnabled,
                    currentTrack
                }
            });
        }
    }
}

export function getCurrentTrack() {
    return currentTrack;
}

export function getAudioConfig() {
    return { musicEnabled, sfxEnabled, currentTrack };}

window.playSFX = playSFX;
window.toggleMusic = toggleMusic;
window.toggleSFX = toggleSFX;
window.loadMusicTrack = loadMusicTrack;
window.getCurrentTrack = getCurrentTrack;
window.getAudioConfig = getAudioConfig;
export { initAudio };