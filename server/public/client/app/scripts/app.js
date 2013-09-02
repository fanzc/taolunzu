'use strict';

angular.module('app', ['http-auth-interceptor'])
.config(function($routeProvider) {
    $routeProvider
    .when('/', { templateUrl: 'views/index.html', controller: IndexController})
    .when('/register', { templateUrl: 'views/register.html', controller: RegisterController})
    .when('/login', { templateUrl: 'views/login.html', controller: LoginController})
    .when('/home', { templateUrl: 'views/home.html', controller: HomeController})
    .when('/feed', { templateUrl: 'views/feed.html', controller: FeedController})
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
    this.isloggedIn = localStorage.isloggedIn;
    this.user = {
        username: localStorage.getItem('username'),
        avatar: localStorage.getItem('avatar')
    };
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
            Authentication.isloggedIn = localStorage.isloggedIn = true
            Authentication.user = data;
            localStorage.setItem('username', data.username);
            localStorage.setItem('avatar', data.avatar);
            $location.url('/home');
        }).error(function(err){
            $scope.message = '';
            $location.url('/login');
        });
    };
}

LoginController.$inject = ['$scope', '$http', '$location', 'Authentication', 'authService'];

function HomeController ($scope, $http, $location, Authentication) {
    $scope.showNewTopicForm = false;
    $scope.loggedIn = Authentication.isloggedIn;
    $scope.topics = [];
    $scope.replies = [];
    $scope.currentTopicIndex = -1;
    $scope.user = Authentication.user;
    $scope.since_id = 0;

    $http.get('/topics').success(function(data){
        $scope.topics = data;
        if ($scope.topics.length > 0) {
            $scope.currentTopicIndex = 0;
            $scope.since_id = $scope.topics[$scope.topics.length-1].topic_id;
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
            var topic = {
                avatar: Authentication.user.avatar,
                content: $scope.newTopic.content,
                create_by: $scope.user.username,
                id: data.topic_id
            };
            $scope.topics.unshift(topic);
            $scope.currentTopicIndex++;
            $scope.newTopic.content = '';
            $scope.showNewTopicForm = false;
            $scope.flashMessage = data.msg;
        }).error(function(err){
            $scope.flashMessage = err.msg;
        });
    };

    $scope.logout = function() {
        $http.post('/logout').success(function(){
            $scope.flashMessage = "Logout successfully"
            localStorage.clear();
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
            var reply = {
                avatar: $scope.user.avatar,
                content: $scope.newReply,
                create_by: $scope.user.username,
                created_at: (new Date()).getTime(),
                id: data.message_id
            };
            $scope.replies.push(reply);
            $scope.topics[$scope.currentTopicIndex].reply_count++;
            $scope.newReply = '';
            $scope.flashMessage = data.msg;
        }).error(function(error){
            $scope.flashMessage = error.msg;
        });
    };

    $scope.toggleNewTopic = function() {
        $scope.showNewTopicForm = !$scope.showNewTopicForm;
    };

    $scope.nextPage = function() {
        $http.get('/topics', {
            params: {
                since_id: $scope.since_id
            }
        }).success(function(data){
            if (data.length > 0) {
                data.splice(0, 1);
                $scope.topics = $scope.topics.concat(data);
                $scope.since_id = $scope.topics[$scope.topics.length-1].topic_id;
            }
        });
    };
}

HomeController.$inject = ['$scope', '$http', '$location', 'Authentication'];

function FeedController ($scope, $http, $location, Authentication) {
    $scope.toggleNewTopic = false;
    $scope.messages = [];

    $http.get('/messages').success(function(data){
        $scope.messages = data;
    })

    $scope.logout = function() {
        $http.post('/logout').success(function(){
            $scope.flashMessage = "Logout successfully"
            $location.url('/');
        }).error(function(){
            $scope.flashMessage = "Logout failed";
        });
    };

    $scope.toggleNewTopic = function() {
        $scope.showNewTopicForm = !$scope.showNewTopicForm;
    };
};

FeedController.$inject = ['$scope', '$http', '$location', 'Authentication'];
