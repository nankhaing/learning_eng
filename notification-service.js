// 📁 notification-service.js
import { getCurrentUser, getUserData, sendNotification, getUserNotifications, markNotificationAsRead } from './appwrite-config.js';

export const notificationTypes = {
    ACHIEVEMENT: 'achievement',
    REMINDER: 'reminder',
    STREAK: 'streak',
    LESSON: 'lesson',
    WELCOME: 'welcome',
    LEVEL_UP: 'level_up',
    CERTIFICATE: 'certificate'
};

export const notificationIcons = {
    [notificationTypes.ACHIEVEMENT]: '🏆',
    [notificationTypes.REMINDER]: '⏰',
    [notificationTypes.STREAK]: '🔥',
    [notificationTypes.LESSON]: '📚',
    [notificationTypes.WELCOME]: '👋',
    [notificationTypes.LEVEL_UP]: '⬆️',
    [notificationTypes.CERTIFICATE]: '📜'
};

export async function sendWelcomeNotification(userId, username) {
    return sendNotification(
        userId,
        '👋 Welcome to English Learning!',
        `Hi ${username}! Start your learning journey today.`,
        notificationTypes.WELCOME,
        '/lesson.html'
    );
}

export async function sendAchievementNotification(userId, username, achievement) {
    return sendNotification(
        userId,
        '🏆 Achievement Unlocked!',
        `Congratulations ${username}! You earned "${achievement.name}" badge!`,
        notificationTypes.ACHIEVEMENT,
        '/profile.html'
    );
}

export async function sendDailyReminder(userId, username) {
    return sendNotification(
        userId,
        '⏰ Time to Learn!',
        `Hi ${username}! Keep your streak going by completing a lesson today.`,
        notificationTypes.REMINDER,
        '/dashboard.html'    );
}

export async function sendStreakWarning(userId, username, streak, hoursLeft) {
    return sendNotification(
        userId,
        '🔥 Streak Alert!',
        `Your ${streak}-day streak will expire in ${hoursLeft} hours!`,
        notificationTypes.STREAK,
        '/dashboard.html'
    );
}

export async function sendLessonCompleteNotification(userId, username, lessonName, score) {
    return sendNotification(
        userId,
        '📚 Lesson Complete!',
        `Great job ${username}! You scored ${score}% in ${lessonName}.`,
        notificationTypes.LESSON,
        '/certificate.html'
    );
}

export async function sendLevelUpNotification(userId, username, newLevel) {
    return sendNotification(
        userId,
        '⬆️ Level Up!',
        `Congratulations ${username}! You've reached Level ${newLevel}!`,
        notificationTypes.LEVEL_UP,
        '/profile.html'
    );
}

export async function sendCertificateNotification(userId, username, certificateName) {
    return sendNotification(
        userId,
        '📜 Certificate Earned!',
        `Amazing ${username}! You've earned a certificate for "${certificateName}".`,
        notificationTypes.CERTIFICATE,
        '/certificate.html'
    );
}

export async function getUnreadCount(userId) {
    const result = await getUserNotifications(userId);
    if (result.success) {
        return result.notifications.filter(n => !n.read).length;
    }
    return 0;
}
export async function markAllAsRead(userId) {
    const result = await getUserNotifications(userId);
    if (result.success) {
        for (const notif of result.notifications) {
            if (!notif.read) {
                await markNotificationAsRead(notif.$id);
            }
        }
    }
}

export async function initNotificationService() {
    const user = await getCurrentUser();
    if (user.success) {
        await requestNotificationPermission();
        const unreadCount = await getUnreadCount(user.user.$id);
        console.log(`🔔 You have ${unreadCount} unread notifications`);
    }
}

export async function requestNotificationPermission() {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    return false;
}

window.sendNotification = sendNotification;
window.getUserNotifications = getUserNotifications;
window.markNotificationAsRead = markNotificationAsRead;
window.sendWelcomeNotification = sendWelcomeNotification;
window.sendAchievementNotification = sendAchievementNotification;
window.sendLessonCompleteNotification = sendLessonCompleteNotification;
window.initNotificationService = initNotificationService;
export { sendNotification, getUserNotifications, markNotificationAsRead };