module.exports = {
    associations: function() {
        //association QueueJob - UserAccount
        UserAccount.hasMany(QueueJob, {
            foreignKey: 'ReceiverUID',
            targetKey: 'UID'
        });
        QueueJob.belongsTo(UserAccount, {
            foreignKey: 'ReceiverUID',
            targetKey: 'UID',
            as: 'ReceiverAccount'
        });

        //association QueueJob - UserAccount
        UserAccount.hasMany(QueueJob, {
            foreignKey: 'SenderUID',
            targetKey: 'UID'
        });
        QueueJob.belongsTo(UserAccount, {
            foreignKey: 'SenderUID',
            targetKey: 'UID',
            as: 'SenderAccount'
        });
    }
};
