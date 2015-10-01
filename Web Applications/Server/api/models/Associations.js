module.exports = {
    associations: function() {
    	UserAccount.hasOne(Patient,{foreignKey:'UserAccountID'});
    }
};
