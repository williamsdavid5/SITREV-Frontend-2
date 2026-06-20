
const SESSION_DURATION = 5 * 60 * 1000;

export const sessionUtils = {
    updateActivity() {
        localStorage.setItem('lastActivity', Date.now().toString());
    },

    isSessionExpired() {
        const lastActivity = localStorage.getItem('lastActivity');
        if (!lastActivity) return true;

        const elapsed = Date.now() - parseInt(lastActivity);
        return elapsed >= SESSION_DURATION;
    },

    getRemainingTime() {
        const lastActivity = localStorage.getItem('lastActivity');
        if (!lastActivity) return 0;

        const elapsed = Date.now() - parseInt(lastActivity);
        const remaining = SESSION_DURATION - elapsed;
        return Math.max(0, Math.floor(remaining / 60000));
    },

    startSession() {
        this.updateActivity();
    },
    isSessionValid() {
        const token = localStorage.getItem('access_token');
        if (!token) return false;
        return !this.isSessionExpired();
    },

    clearSession() {
        localStorage.removeItem('lastActivity');
        localStorage.removeItem('access_token');
        localStorage.removeItem('userData');
    }
};