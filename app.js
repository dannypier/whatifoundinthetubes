angular.module('flapperNews', ['ui.router'])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider){
            $stateProvider.state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl'
            })
                .state('posts', {
                url: '/posts/{id}',
                templateUrl: '/posts.html',
                controller: 'PostsCtrl'
            })

            $urlRouterProvider.otherwise('home')
        }
    ])
    .factory('posts', [function(){
    var o = {
        posts: [ ]
    }
    return o;
}])
.controller('MainCtrl', [
    '$scope',
    'posts',
    function($scope, posts){
        $scope.test = 'Hello world!';

        $scope.posts = posts.posts;

        $scope.addPost = function(){
            if ($scope.title == '' || $scope.link == '') { return ;}
            $scope.posts.push( {
                title: $scope.title,
                link: $scope.link,
                upvotes:1,
                comments: []
            })
            $scope.title=''
            $scope.link=''
        }

        $scope.incrementUpvotes = function(post){
            post.upvotes += 1;
        }
    }])
    .controller('PostsCtrl', [
        '$scope',
        '$stateParams',
        'posts',
        function($scope, $stateParams, posts){
            $scope.post = posts.posts[$stateParams.id];

            $scope.addComment = function(){
                if ($scope.body == '') { return ;}
                $scope.post.comments.push(
                        {
                            author: '',
                            body : $scope.body,
                            upvotes: 1
                        }
                );
                $scope.body=''

            }
        }
    ]);