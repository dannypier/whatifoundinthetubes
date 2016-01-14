angular.module('whatifoundinthetubes', ['ui.router'])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider){
            $stateProvider.state('home', {
                    url: '/home',
                    templateUrl: '/home.html',
                    controller: 'MainCtrl',
                    resolve: {
                        postPromise: ['posts', function(posts){
                            return posts.getAll();
                        }]
                    }
                })
                .state('posts', {
                    url: '/posts/{id}',
                    templateUrl: '/posts.html',
                    controller: 'PostsCtrl',
                    resolve :{
                        post : ['$stateParams', 'posts', function($stateParams, posts){
                            return posts.get($stateParams.id);
                        }]
                    }
                })

            $urlRouterProvider.otherwise('home')
        }
    ])
    .factory('posts',  ['$http', function($http){
        var o = {
            posts: [ ]
        }
        o.getAll = function(){
            return $http.get('/posts').success(function(data){
                angular.copy(data, o.posts);
            })
        }

        o.get = function(id){
            return $http.get('/posts/' + id).then(function (res) {
                return res.data
            })
        }

        o.create = function(post){
            return $http.post('/posts', post).success(function(data){
                o.posts.push(data);
            })
        }

        o.addComment = function(id, comment){
            return $http.post('/posts/' + id + '/comments', comment);
        }

        o.upvote = function(post){
            return $http.put('/posts/' + post._id + '/upvote').success(function(data){
                post.upvotes += 1;
            })
        }

        o.upvoteComment = function(postId, comment){
            return $http.put('/posts/' + postId + '/comments/' + comment._id + '/upvote').success(function(data){
                comment.upvotes += 1;
            })
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
                posts.create( {
                    title: $scope.title,
                    link: $scope.link
                })
                $scope.title=''
                $scope.link=''
            }

            $scope.incrementUpvotes = function(post){
                posts.upvote(post)
            }
        }])
    .controller('PostsCtrl', [
        '$scope',
        'posts',
        'post',
        function($scope, posts, post){
            $scope.post = post

            $scope.addComment = function(){

                if ($scope.body == '') { return ;}

                comment = {
                    'body' : $scope.body,
                    'author' : 'dp'
                }

                posts.addComment(post._id,comment).then(function(res) {
                        $scope.post.comments.push(res.data)
                    }
                )
                $scope.body =''
            }

            $scope.incrementUpvotes = function(post, comment){
                posts.upvoteComment(post._id,comment);
            }
        }
    ]);