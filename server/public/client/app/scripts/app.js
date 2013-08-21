'use strict';

angular.module('app', ['http-auth-interceptor'])
.config(function($routeProvider) {
    $routeProvider
    .when('/', { templateUrl: 'views/index.html', controller: IndexController})
    .when('/login', { templateUrl: 'views/login.html', controller: LoginController})
    .when('/home', { templateUrl: 'views/home.html', controller: HomeController})
    .otherwise({redirectTo: '/'});
})
.directive('httpAuthApp', function($location){
    return {
        restrict: 'C',
        link: function(scope, elem, attrs) {
            scope.$on('event:auth-loginRequired', function() {
                $location.url('/login');
            });
            scope.$on('event:auth-loginConfirmed', function() {
                $location.url('/home');
            });
        }
    };
})
.service('Authentication', function(){
    this.isloggedIn = false;
});

function IndexController($scope) {
    // $scope
}

function LoginController ($scope, $http, $location, Authentication, authService) {
    $scope.message = '';
    $scope.user = {};

    $scope.login = function() {
        $http.post('/login', {
            email: $scope.user.email,
            password: $scope.user.password
        })
        .success(function(data){
            authService.loginConfirmed();
            Authentication.isloggedIn = true;
            $location.url('/home');
        })
        .error(function(err){
            $scope.message = '';
            $location.url('/login');
        });
    };
}

LoginController.$inject = ['$scope', '$http', '$location', 'Authentication', 'authService'];

function HomeController ($scope, $http, Authentication) {
    $scope.loggedIn = Authentication.isloggedIn;
    $scope.topics = [];

    $http.get('/topics').success(function(data){
        $scope.topics = data;
    });

    if ($scope.topics.length > 0) {
        $scope.topicId = $scope.topcis[0].id;
        $http.get('/topic/'+$scope.topicId)
        .success(function(data){
            $scope.topicDetail = data;
        });
    }

    $scope.logout = function() {
        $http.post('/logout').success(function(){
            $scope.flashMessage = "Logout successfully"
            $location.url('/');
        }).error(function(){
            $scope.flashMessage = "Logout failed"
        });
    };
}

HomeController.$inject = ['$scope', '$http', 'Authentication'];
