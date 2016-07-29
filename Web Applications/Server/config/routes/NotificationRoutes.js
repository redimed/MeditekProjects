module.exports = {
    'post /api/private/createprivatenotify': {
        controller: 'Notification/NotificationController',
        action: 'CreateGlobalNotify'
    },

    'post /api/global/createglobalnotify': {
        controller: 'Notification/NotificationController',
        action: 'CreatePrivateNotify'
    }
};