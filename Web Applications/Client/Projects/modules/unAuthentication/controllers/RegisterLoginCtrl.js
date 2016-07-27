var app = angular.module('app.unAuthentication.registerlogin.controller', []);
app.controller('RegisterLoginCtrl', function($scope, $state) {
    // console.log("haahahahahahahahahahahahaha")
    $('.content').removeClass('sign-in');
    $('.content').addClass('sign-up');
});
