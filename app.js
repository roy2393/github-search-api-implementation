var myApp = angular.module('urbanpiper', ['SearchService']);

myApp.controller('SearchController', function ($scope,$http, SearchOp) {
    $scope.search = "";
    $scope.related;
      $scope.getRepositories = function() {
        if($scope.search.length>=3){
          SearchOp.getRepositories($scope.search)
              .success(function (repos) {
                  delete $scope.issue;
                  delete $scope.user;
                  $scope.related = repos;
                  // console.log(repos);
              })
              .error(function (error) {
                  $scope.status = 'Unable to load customer data: ' + error.message;
              });
      }
    };

    $scope.showIssue = function(repo){
      delete $scope.related;
      $scope.search = repo.full_name;
      $scope.full_name = repo.full_name;
      var today = +new Date;
      var ondDay = 1000 * 60 * 60 * 24;
      var diff = today - ondDay;
      var yesterday = new Date(diff);
      var yesterdayString = yesterday.getFullYear() + '-' + (yesterday.getMonth() + 1) + '-' + yesterday.getDate();
      $http.get( "https://api.github.com/repos/"+ $scope.full_name +"/issues?q=&state=open&since=" + yesterdayString)
      .then(function(response){
        $scope.issues = response.data;
        console.log($scope.issues);
        });
    };

    $scope.showIssueDetails = function(issue){
      $scope.issue = issue;
      delete $scope.issues;
      var issue_number = $scope.issue.number;
      // console.log(issue_number);
      if(typeof(Storage) !== "undefined") {
        if (issue_number in localStorage) {
          // console.log('exists');
          count = Number(localStorage.getItem(issue_number)) + 1;
            localStorage.setItem(issue_number, count);
        } else {
          // console.log('not exist');
            localStorage.setItem(issue_number, 1);
        }
        // console.log(localStorage);
        $scope.hits = localStorage.getItem(issue_number);
        // console.log("Hits - " +$scope.hits);
      }

    };

    $scope.showUser = function(user){
      delete $scope.issue;
      $scope.user = user;
    };

});



var SearchService = angular.module('SearchService', [])
SearchService.factory('SearchOp', ['$http', function ($http) {

    var urlBase = 'https://api.github.com/search/repositories?q=';
    var SearchOp = {};

    SearchOp.getRepositories = function (search) {
        SearchOp = $http.get(urlBase+ search +'&sort=stars&order=desc&per_page=5')
        return SearchOp;
    };

    // console.log(SearchOp);
    return SearchOp;

}]);
