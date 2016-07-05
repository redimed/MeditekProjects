module.exports = {
    UserAccount: require('./UserAccount/UserAccount'),
    UserActivation: require('./UserAccount/UserActivation'),
    UserToken: require('./UserAccount/UserToken'),
    RefreshToken: require('./UserAccount/RefreshToken'),
    ExternalToken: require('./UserAccount/ExternalToken'),
    //begin Appointment
    Module: require('./Authorization/v0_1/Module'),
    Role: require('./Authorization/v0_1/Role'),
    UserRole: require('./Authorization/v0_1/UserRole'),
    Register: require('./Register/Register'),
};
