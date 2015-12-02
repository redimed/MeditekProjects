var app = angular.module('app.authentication.home.list.controller',[
	'app.authentication.home.list.detail.controller',
]);

app.controller('homeListCtrl', function($scope, MovieRetriever, $state){
	$scope.movies = MovieRetriever.getmovies("...");
	$scope.movies.then(function(data){
		$scope.movies = data;
	});

	$scope.getmovies = function(){
		return $scope.movies;
	}

	$scope.doSomething = function(typedthings){
		console.log("Do something like reload data with this: " + typedthings );
		$scope.newmovies = MovieRetriever.getmovies(typedthings);
		$scope.newmovies.then(function(data){
			$scope.movies = data;
		});
	}

	$scope.doSomethingElse = function(suggestion){
		console.log("Suggestion selected: " + suggestion );
	}

	$scope.movies=[];

	

    // gives another movie array on change
    // $scope.updateMovies = function(typed){
    //     // MovieRetriever could be some service returning a promise
    //     $scope.newmovies = MovieRetriever.getmovies(typed);
    //     $scope.newmovies.then(function(data){
    //       $scope.movies = data;
    //     });
    // };

});






