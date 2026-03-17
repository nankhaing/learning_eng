// 📁 appwrite-config.js - SIMPLE WORKING VERSION
import { Client, Account, Databases, ID, Query } from 'https://cdn.jsdelivr.net/npm/appwrite@11.0.0/+esm';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('699b17ad002aca41b3aa');

const account = new Account(client);
const databases = new Databases(client);
const DATABASE_ID = '699d2855000a34e5a8c6';

// ✅ REGISTER
export async function createAccount(email, password, username) {
    try {
        const user = await account.create(ID.unique(), email, password, username);
        await account.createEmailPasswordSession(email, password);
        
        await databases.createDocument(DATABASE_ID, 'users', ID.unique(), {
            userId: user.$id,
            username: username,
            email: email,
            role: 'student',
            xp: 0,
            lessonsCompleted: 0,
            streak: 0,
            createdAt: new Date().toISOString()
        });
        
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ✅ LOGIN
export async function login(email, password) {
    try {
        await account.createEmailPasswordSession(email, password);
        const user = await account.get();
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ✅ LOGOUT
export async function logout() {
    try {
        await account.deleteSession('current');
        return { success: true };    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ✅ GET CURRENT USER
export async function getCurrentUser() {
    try {
        const user = await account.get();
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ✅ GET USER DATA
export async function getUserData(userId) {
    try {
        const result = await databases.listDocuments(DATABASE_ID, 'users', [
            Query.equal('userId', userId)
        ]);
        if (result.documents.length > 0) {
            return { success: true, data: result.documents[0], docId: result.documents[0].$id };
        }
        return { success: false, error: 'User not found' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ✅ UPDATE USER DATA
export async function updateUserData(docId, data) {
    try {
        const result = await databases.updateDocument(DATABASE_ID, 'users', docId, data);
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ✅ CREATE USER DOCUMENT
export async function createUserDocument(userId, username, email) {
    try {
        const result = await databases.createDocument(DATABASE_ID, 'users', ID.unique(), {
            userId: userId,
            username: username,
            email: email,
            role: 'student',
            xp: 0,
            lessonsCompleted: 0,            streak: 0,
            createdAt: new Date().toISOString()
        });
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ✅ GET LEADERBOARD
export async function getLeaderboard(category = 'xp', limit = 100) {
    try {
        const result = await databases.listDocuments(DATABASE_ID, 'users', [
            Query.orderDesc(category),
            Query.limit(limit)
        ]);
        return { success: true, users: result.documents };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ✅ SEND NOTIFICATION
export async function sendNotification(userId, title, message, type = 'general') {
    try {
        const result = await databases.createDocument(DATABASE_ID, 'notifications', ID.unique(), {
            userId: userId,
            title: title,
            message: message,
            type: type,
            read: false,
            timestamp: new Date().toISOString()
        });
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ✅ GET NOTIFICATIONS
export async function getUserNotifications(userId, limit = 50) {
    try {
        const result = await databases.listDocuments(DATABASE_ID, 'notifications', [
            Query.equal('userId', userId),
            Query.orderDesc('timestamp'),
            Query.limit(limit)
        ]);
        return { success: true, notifications: result.documents };
    } catch (error) {
        return { success: false, error: error.message };    }
}

// ✅ SAVE PROGRESS
export async function saveProgress(userId, lessonId, score) {
    try {
        const result = await databases.createDocument(DATABASE_ID, 'progress', ID.unique(), {
            userId: userId,
            lessonId: lessonId,
            score: score,
            timestamp: new Date().toISOString()
        });
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ✅ GLOBAL EXPORTS (ONLY ONCE!)
window.createAccount = createAccount;
window.login = login;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.getUserData = getUserData;
window.updateUserData = updateUserData;
window.createUserDocument = createUserDocument;
window.getLeaderboard = getLeaderboard;
window.sendNotification = sendNotification;
window.getUserNotifications = getUserNotifications;
window.saveProgress = saveProgress;