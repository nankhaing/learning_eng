// 📁 appwrite-config.js
import { Client, Account, Databases, ID, Query } from 'https://cdn.jsdelivr.net/npm/appwrite@11.0.0/+esm';

// Initialize Appwrite Client
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('699b17ad002aca41b3aa');

// Initialize Services
const account = new Account(client);
const databases = new Databases(client);

// Database & Collection IDs
const DATABASE_ID = '699d2855000a34e5a8c6';
const COLLECTIONS = {
    USERS: 'users',
    LESSONS: 'lessons',
    PROGRESS: 'progress',
    ANALYTICS: 'analytics',
    NOTIFICATIONS: 'notifications',
    CERTIFICATES: 'certificates'
};

// ============ AUTHENTICATION ============

export async function createAccount(email, password, username) {
    try {
        const user = await account.create(ID.unique(), email, password, username);
        await account.createEmailPasswordSession(email, password);
        
        await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            ID.unique(),
            {
                userId: user.$id,
                username: username,
                email: email,
                role: 'student',
                xp: 0,
                lessonsCompleted: 0,
                streak: 0,
                theme: 'light',
                language: 'en',
                createdAt: new Date().toISOString()
            }
        );
        
        return { success: true, user };
    } catch (error) {        return { success: false, error: error.message };
    }
}

export async function login(email, password) {
    try {
        await account.createEmailPasswordSession(email, password);
        const user = await account.get();
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function logout() {
    try {
        await account.deleteSession('current');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getCurrentUser() {
    try {
        const user = await account.get();
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============ USER DATA ============

export async function getUserData(userId) {
    try {
        const result = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.USERS,
            [Query.equal('userId', userId)]
        );
        
        if (result.documents.length > 0) {
            return { success: true, data: result.documents[0], docId: result.documents[0].$id };
        }
        return { success: false, error: 'User not found' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
export async function updateUserData(docId, data) {
    try {
        const result = await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            docId,
            data
        );
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function createUserDocument(userId, username, email) {
    try {
        const result = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            ID.unique(),
            {
                userId: userId,
                username: username,
                email: email,
                role: 'student',
                xp: 0,
                lessonsCompleted: 0,
                streak: 0,
                theme: 'light',
                language: 'en',
                createdAt: new Date().toISOString()
            }
        );
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============ NOTIFICATIONS ============

export async function sendNotification(userId, title, message, type = 'general', action = null) {
    try {
        const result = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.NOTIFICATIONS,
            ID.unique(),
            {
                userId: userId,                title: title,
                message: message,
                type: type,
                read: false,
                action: action,
                timestamp: new Date().toISOString()
            }
        );
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getUserNotifications(userId, limit = 50) {
    try {
        const result = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.NOTIFICATIONS,
            [
                Query.equal('userId', userId),
                Query.orderDesc('timestamp'),
                Query.limit(limit)
            ]
        );
        
        return { success: true, notifications: result.documents };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function markNotificationAsRead(docId) {
    try {
        const result = await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.NOTIFICATIONS,
            docId,
            { read: true }
        );
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============ PROGRESS ============

export async function saveProgress(userId, lessonId, score, completed = true) {
    try {        const result = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.PROGRESS,
            ID.unique(),
            {
                userId: userId,
                lessonId: lessonId,
                score: score,
                completed: completed,
                timestamp: new Date().toISOString()
            }
        );
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============ LEADERBOARD ============

export async function getLeaderboard(category = 'xp', limit = 100) {
    try {
        const result = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.USERS,
            [
                Query.orderDesc(category),
                Query.limit(limit)
            ]
        );
        
        return { success: true, users: result.documents };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============ CERTIFICATES ============

export async function createCertificate(userId, username, courseName, score) {
    try {
        const result = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.CERTIFICATES,
            ID.unique(),
            {
                userId: userId,
                username: username,
                courseName: courseName,
                score: score,                certificateId: `CERT-${Date.now()}`,
                issuedAt: new Date().toISOString()
            }
        );
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getUserCertificates(userId) {
    try {
        const result = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.CERTIFICATES,
            [Query.equal('userId', userId)]
        );
        
        return { success: true, certificates: result.documents };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============ ANALYTICS ============

export async function trackAnalytics(type, userId, data) {
    try {
        const result = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.ANALYTICS,
            ID.unique(),
            {
                type: type,
                userId: userId,
                data: data,
                timestamp: new Date().toISOString()
            }
        );
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getUserInsights(userId) {
    const userData = await getUserData(userId);
    if (!userData.success) return [];
    
    const insights = [];    const data = userData.data;
    
    if (data.streak >= 7) {
        insights.push({
            type: 'positive',
            message: `🔥 Great! You're on a ${data.streak}-day streak!`
        });
    }
    
    if (data.xp >= 1000) {
        insights.push({
            type: 'positive',
            message: `⭐ Excellent! You've earned ${data.xp} XP!`
        });
    }
    
    if (data.lessonsCompleted >= 10) {
        insights.push({
            type: 'positive',
            message: `📚 Awesome! You've completed ${data.lessonsCompleted} lessons!`
        });
    }
    
    return insights;
}

// ============ GLOBAL EXPORTS (ONLY ONCE!) ============

// ✅ Each function exported ONLY ONCE at the end
window.createAccount = createAccount;
window.login = login;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.getUserData = getUserData;
window.updateUserData = updateUserData;
window.createUserDocument = createUserDocument;
window.sendNotification = sendNotification;
window.getUserNotifications = getUserNotifications;
window.markNotificationAsRead = markNotificationAsRead;
window.saveProgress = saveProgress;
window.getLeaderboard = getLeaderboard;
window.createCertificate = createCertificate;
window.getUserCertificates = getUserCertificates;
window.trackAnalytics = trackAnalytics;
window.getUserInsights = getUserInsights;