module.exports = {
    associations: function() {
        //association QueueJob - UserAccount(Receiver)
        UserAccount.hasMany(QueueJob, {
            foreignKey: 'ReceiverUID',
            targetKey: 'UID'
        });
        QueueJob.belongsTo(UserAccount, {
            foreignKey: 'ReceiverUID',
            targetKey: 'UID',
            as: 'ReceiverAccount'
        });

        //association QueueJob - UserAccount(Sender)
        UserAccount.hasMany(QueueJob, {
            foreignKey: 'SenderUID',
            targetKey: 'UID'
        });
        QueueJob.belongsTo(UserAccount, {
            foreignKey: 'SenderUID',
            targetKey: 'UID',
            as: 'SenderAccount'
        });

        //association QueueJob - UserAccount(ModifiedBy)
        UserAccount.hasMany(QueueJob, {
            foreignKey: 'ModifiedBy',
            targetKey: 'ID'
        });
        QueueJob.belongsTo(UserAccount, {
            foreignKey: 'ModifiedBy',
            targetKey: 'ID',
            as: 'ModifiedAccount'
        });

         //association QueueJobg - UserAccount(Receiver)
        UserAccount.hasMany(QueueJobg, {
            foreignKey: 'ReceiverUID',
            targetKey: 'UID'
        });
        QueueJobg.belongsTo(UserAccount, {
            foreignKey: 'ReceiverUID',
            targetKey: 'UID',
            as: 'ReceiverAccount'
        });

        //association QueueJobg - UserAccount(Sender)
        UserAccount.hasMany(QueueJobg, {
            foreignKey: 'SenderUID',
            targetKey: 'UID'
        });
        QueueJobg.belongsTo(UserAccount, {
            foreignKey: 'SenderUID',
            targetKey: 'UID',
            as: 'SenderAccount'
        });

        // UserAccount - RelUserRole - Role
        UserAccount.hasMany(RelUserRole, {
            foreignKey: 'UserAccountId'
        });
        RelUserRole.belongsTo(UserAccount, {
            foreignKey: 'UserAccountId'
        });
        Role.hasMany(RelUserRole, {
            foreignKey: 'RoleId'
        });
        RelUserRole.belongsTo(Role, {
            foreignKey: 'RoleId'
        });
        Role.belongsToMany(UserAccount, {
            through: 'RelUserRole',
            foreignKey: 'RoleId'
        });
        UserAccount.belongsToMany(Role, {
            through: 'RelUserRole',
            foreignKey: 'UserAccountId'
        });
    }
};
