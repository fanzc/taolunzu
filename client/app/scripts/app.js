'use strict';

var app = angular.module('app', []).
  config(function($routeProvider) {
  $routeProvider
        .when('/', { templateUrl: 'views/index.html', controller: IndexController})
        .when('/login', { templateUrl: 'views/login.html', controller: LoginController})
        .when('/home', { templateUrl: 'views/home.html', controller: HomeController})
        .otherwise({redirectTo: '/'});
});

function IndexController($scope) {
    // $scope
}

function LoginController ($scope) {
    // body...
}

function HomeController ($scope) {
    // body...
}
