'use strict';

angular.module('app', ['http-auth-interceptor'])
.config(function($routeProvider) {
    $routeProvider
    .when('/', { templateUrl: 'views/index.html', controller: IndexController})
    .when('/register', { templateUrl: 'views/register.html', controller: RegisterController})
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
    this.user = {};
});

function IndexController($scope) {
    // $scope
}

function RegisterController ($scope, $http, $location) {
    $scope.message = '';
    $scope.user = {};

    $scope.register = function(){
        $http.post('/register', {
            username: $scope.user.username,
            password: $scope.user.password,
            confirm: $scope.user.confirm
        }).success(function(data){
            $scope.message = "Register successfullly!";
            $location.url('/login');
        }).error(function(err){
            $scope.message = "Failed";
        });
    };
}

LoginController.$inject = ['$scope', '$http', '$location'];

function LoginController ($scope, $http, $location, Authentication, authService) {
    $scope.message = '';
    $scope.user = {};

    $scope.login = function() {
        $http.post('/login', {
            username: $scope.user.username,
            password: $scope.user.password
        }).success(function(data){
            authService.loginConfirmed();
            Authentication.isloggedIn = true;
            Authentication.user = data;
            $location.url('/home');
        }).error(function(err){
            $scope.message = '';
            $location.url('/login');
        });
    };
}

LoginController.$inject = ['$scope', '$http', '$location', 'Authentication', 'authService'];

function HomeController ($scope, $http, $location, Authentication) {
    $scope.loggedIn = Authentication.isloggedIn;
    $scope.topics = [];
    $scope.replies = [];
    $scope.currentTopicIndex = -1;
    $scope.user = Authentication.user;

    $http.get('/topics').success(function(data){
        $scope.topics = data;
        if ($scope.topics.length > 0) {
            $scope.currentTopicIndex = 0;
            $http.get('/topic/' + $scope.topics[$scope.currentTopicIndex].id + '/replies')
            .success(function(data){
                $scope.replies = data;
            }).error(function(err){
                $scope.flashMessage = err.msg;
            });
        }
    });

    $scope.postNewTopic = function() {
        $http.post('/topics', {
            content: $scope.newTopic.content,
        }).success(function(data){
            $scope.newTopic.content = '';
            $scope.flashMessage = data.msg;
        }).error(function(err){
            $scope.flashMessage = err.msg;
        });
    };

    $scope.logout = function() {
        $http.post('/logout').success(function(){
            $scope.flashMessage = "Logout successfully"
            $location.url('/');
        }).error(function(){
            $scope.flashMessage = "Logout failed";
        });
    };

    $scope.setDetail = function(topicId) {
        if (topicId > -1 && topicId < $scope.topics.length ) {
            $scope.currentTopicIndex = topicId;
            $http.get('/topic/' + $scope.topics[topicId].id + '/replies')
            .success(function(data){
                $scope.replies = data;
            }).error(function(err){
                $scope.flashMessage = err.msg;
            });
        } else {
            $scope.flashMessage = "setDetail error.";
        }
    };

    $scope.postNewReply = function() {
        $http.post('/topic/' + $scope.topics[$scope.currentTopicIndex].id + '/replies', {
            content: $scope.newReply
        }).success(function(data){
            $scope.newReply = '';
            $scope.flashMessage = data.msg;
        }).error(function(error){
            $scope.flashMessage = error.msg;
        });
    };
}

HomeController.$inject = ['$scope', '$http', '$location', 'Authentication'];
