(function() {

    var app = angular.module('Whitestone',['ngRoute']);

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider, $location) {
        $routeProvider.when('/login', {
            templateUrl: '/static/pages/login.html',
            controller: 'LoginController',
            controllerAs : 'loginCtrl'
        }).when('/activityLog/:role/:uid', {
            templateUrl: '/static/pages/activityLog.html',
            controller: 'activityLogController',
            controllerAs : 'activityLogCtrl'
        }).when('/meeting/:role/:uid', {
            templateUrl: 'static/pages/createMeeting.html',
            controller: 'createMeetingController',
            controllerAs : 'createMeetingCtrl'
        }).when('/createUser/:role/:uid', {
            templateUrl: '/static/pages/createUser.html',
            controller: 'createUserController',
            controllerAs : 'createUserCtrl'
        }).when('/Vote/:role/:uid', {
            templateUrl: '/static/pages/createVote.html',
            controller: 'votingController',
            controllerAs : 'votingCtrl'
        }).when('/submitVoteSenator/:role/uid', {
            templateUrl: '/static/pages/submitVote.html',
            controller: 'submitVoteSenController',
            controllerAs : 'submitVoteSenCtrl'
        }).when('/votingChancellor/:role/:uid', {
            templateUrl: '/static/pages/submitVoteChan.html',
            controller: 'submitVoteChanController',
            controllerAs : 'submitVoteChanCtrl'
        }).when('/oldMeeting/:role/:uid', {
            templateUrl: '/static/pages/viewOldMeetings.html',
            controller: 'oldMeetingsController',
            controllerAs : 'oldMeetingsCtrl'
        }).when('/editUser/:role/:uid', {
            templateUrl: '/static/pages/editUser.html',
            controller: 'editUserController',
            controllerAs : 'editUserCtrl'
        }).when('/voting/:role/:uid', {
            templateUrl: '/static/pages/submitVote.html',
            controller: 'submitVoteController',
            controllerAs : 'submitVoteCtrl'
        }).otherwise({
            redirectTo: '/login'
        });
    }]);

})();