angular.module('grayze', ['ui.router'])
    .filter('decodeURI', function(){
        return window.decodeURI;
    })
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider){
            $stateProvider
                .state('home', {
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
                .state('login', {
                    url: '/login',
                    templateUrl: '/login.html',
                    controller: 'AuthCtrl',
                    onEnter: ['$state', 'auth', function($state, auth){
                        if(auth.isLoggedIn()){
                            $state.go('home');
                        }
                    }]
                })
                .state('register', {
                    url: '/register',
                    templateUrl: '/register.html',
                    controller: 'AuthCtrl',
                    onEnter: ['$state', 'auth', function($state, auth){
                        if(auth.isLoggedIn()){
                            $state.go('home');
                        }
                    }]
                });

            $urlRouterProvider.otherwise('home')
        }
    ])

    .factory('auth', ['$http', '$window', function($http, $window){
        var auth = {};

        auth.saveToken = function(token){
            // TODO make this token a var
            //TODO name this token whatever you'd like
            $window.localStorage['whatifoundinthetubes-token'] = token;
        };

        auth.getToken = function(){
            return $window.localStorage['whatifoundinthetubes-token'];
        }

        auth.isLoggedIn = function(){
            var token = auth.getToken();

            if (token){
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            }
            else {
                return false;
            }
        }

        auth.currentUser = function(){
            if (auth.isLoggedIn()){
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload.email;
            }

        }

        auth.register = function(user){
            return $http.post('/register', user).success(function(data){
                auth.saveToken(data.token);
            });
        }

        auth.login = function(user){
            return $http.post('/login', user).success(function(data){
                auth.saveToken(data.token);
            })
        }

        auth.logout = function(user){
            $window.localStorage.removeItem('whatifoundinthetubes-token');
        }

        return auth;
    }])


    .factory('posts',  ['$http', 'auth', function($http, auth){
        var o = {
            posts: [ ]
        }
        o.getAll = function(){
            return $http.get('/slack/messages').success(function(data){
                angular.copy(data, o.posts);
            })
        }

        o.get = function(id){
            return $http.get('/message/' + id).then(function (res) {
                return res.data
            })
        }

        return o;
    }])
    .controller('MainCtrl', [
        '$scope',
        'posts',
        'auth',
        function($scope, posts, auth){
            $scope.posts = posts.posts;
            $scope.isLoggedIn = auth.isLoggedIn;
        }])
    .controller('PostsCtrl', [
        '$scope',
        'posts',
        'post',
        'auth',
        function($scope, posts, post, auth){
            $scope.post = post;
            $scope.isLoggedIn = auth.isLoggedIn;

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
    ])
    .controller('AuthCtrl', [
        '$scope',
        '$state',
        'auth',
        function($scope, $state, auth){
            $scope.user = {};

            $scope.register = function(){
                auth.register($scope.user).error(function(error){
                    $scope.error = error;
                }).then(function(){
                    $state.go('home');
                });
            };

            $scope.login = function(){
                auth.login($scope.user).error(function(error){
                    $scope.error = error;
                }).then(function(){
                    $state.go('home');
                });
            }
        }
    ])
    .controller('NavCtrl', [
        '$scope',
        'auth',
        function($scope, auth){
            $scope.isLoggedIn = auth.isLoggedIn;
            $scope.currentUser = auth.currentUser;
            $scope.logOut = auth.logout;
        }
    ]);