// 📁 analytics-service.js
import { getCurrentUser, getUserData, updateUserData, trackAnalytics } from './appwrite-config.js';

export async function trackLessonCompletion(userId, lessonId, score, timeSpent) {
    const user = await getCurrentUser();
    if (!user.success) return false;
    
    const userData = await getUserData(userId);
    if (!userData.success) return false;
    
    try {
        // Update user stats
        await updateUserData(userData.docId, {
            xp: (userData.data.xp || 0) + (score * 10),
            lessonsCompleted: (userData.data.lessonsCompleted || 0) + 1,
            lastActive: new Date().toISOString()
        });
        
        // Track analytics
        await trackAnalytics('lesson_completion', userId, {
            lessonId,
            score,
            timeSpent
        });
        
        return true;
    } catch (error) {
        console.error('Error tracking completion:', error);
        return false;
    }
}

export async function trackUserActivity(userId, activity) {
    return trackAnalytics('user_activity', userId, { activity });
}

export async function trackLogin(userId) {
    await trackUserActivity(userId, 'login');
    
    const userData = await getUserData(userId);
    if (userData.success) {
        const lastActive = new Date(userData.data.lastActive);
        const now = new Date();
        const daysDiff = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
            await updateUserData(userData.docId, {
                streak: (userData.data.streak || 0) + 1
            });
        } else if (daysDiff > 1) {
            await updateUserData(userData.docId, { streak: 1 });
        }
        
        await updateUserData(userData.docId, { lastActive: now.toISOString() });
    }
}

export async function getUserInsights(userId) {
    const userData = await getUserData(userId);
    if (!userData.success) return [];
    
    const insights = [];
    const data = userData.data;
    
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

window.trackLessonCompletion = trackLessonCompletion;
window.trackUserActivity = trackUserActivity;
window.trackLogin = trackLogin;
window.getUserInsights = getUserInsights;
export { trackLessonCompletion, trackUserActivity, trackLogin, getUserInsights };