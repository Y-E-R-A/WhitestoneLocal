(function() {

    var app = angular.module('Whitestone',['ngRoute']);

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider, $location) {
        $routeProvider.when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'LoginController',
            controllerAs : 'loginCtrl'
        }).when('/activityLog/:role/:uid', {
            templateUrl: 'pages/activityLog.html',
            controller: 'activityLogController',
            controllerAs : 'activityLogCtrl'
        }).when('/meeting/:role/:uid', {
            templateUrl: 'pages/createMeeting.html',
            controller: 'createMeetingController',
            controllerAs : 'createMeetingCtrl'
        }).when('/createUser/:role/:uid', {
            templateUrl: 'pages/createUser.html',
            controller: 'createUserController',
            controllerAs : 'createUserCtrl'
        }).when('/Vote/:role/:uid', {
            templateUrl: 'pages/createVote.html',
            controller: 'votingController',
            controllerAs : 'votingCtrl'
        }).when('/submitVoteSenator/:role/uid', {
            templateUrl: 'pages/submitVote.html',
            controller: 'submitVoteSenController',
            controllerAs : 'submitVoteSenCtrl'
        }).when('/submitVoteChancellor/:role/uid', {
            templateUrl: 'pages/submitVoteChan.html',
            controller: 'submitVoteChanController',
            controllerAs : 'submitVoteChanCtrl'
        }).when('/oldMeeting/:role/:uid', {
            templateUrl: 'pages/viewOldMeetins.html',
            controller: 'oldMeetingsController',
            controllerAs : 'oldMeetingsSenCtrl'
        }).when('/editUser/:role/:uid', {
            templateUrl: 'pages/editUser.html',
            controller: 'editUserController',
            controllerAs : 'editUserCtrl'
        }).when('/voting/:role/:uid', {
            templateUrl: 'pages/submitVote.html',
            controller: 'submitVoteController',
            controllerAs : 'submitVoteCtrl'
        }).otherwise({
            redirectTo: '/login'
        });
    }]);

})();