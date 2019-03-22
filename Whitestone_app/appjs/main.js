(function() {

    var app = angular.module('Whitestone',['ngRoute']);

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider, $location) {
        $routeProvider.when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'LoginController',
            controllerAs : 'loginCtrl'
        }).otherwise({
            redirectTo: '/login'
        });
    }]);

})();