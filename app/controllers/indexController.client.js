'use strict';

(function () {
   angular
      .module('NightlifeApp', ['ngResource'])
      .controller('indexController', ['$scope', '$resource', function ($scope, $resource) {
         
         /***** INITIALIZE *****/
         $scope.hasSearched = false;
         $scope.loader = { isLoadingUser: true, isSearchingBars: false };
         
         $scope.bars = [];
         $scope.searchTxt = '';
         
         var Bar = $resource('/api/bars');
         var User = $resource('/api/user');
         
         getUser();
         
         
         
         /***** CONTROLLER FUNCTIONS *****/
         function getBars (searchTxt) {
            $scope.hasSearched = true;
            $scope.loader.isSearchingBars = true;
            
            $scope.bars = [];
            
            Bar.get({ searchTxt: searchTxt }, function (res) {
               $scope.loader.isSearchingBars = false;
               $('.bars').removeClass('hidden');
               
               $scope.bars = res.bars;
               
               // to not search again after logging in
               localStorage.setItem('jcsgithubNightlifeAppLastSearch', searchTxt);
            }, function (err) {
               console.log('Bar.get error');
               console.log(err)
            });
         }
         
         function getUser () {
            User.get(function (res) {
               console.log('User.get', res)
               
               if (res._id) {
                  $("#authorized-navbar").removeClass("hide");
                  $("#unauthorized-navbar").addClass("hide");
                  
                  // check if localStorage has last search
                  var lastSearchTxt = localStorage.getItem('jcsgithubNightlifeAppLastSearch');
                  if (lastSearchTxt)
                     getBars(lastSearchTxt);
               }
            }, function (err) {
               $("#authorized-navbar").addClass("hide");
               $("#unauthorized-navbar").removeClass("hide");
            });
         }

         
         
         /***** USER INTERACTIONS *****/
         $scope.search = function (searchTxt) {
            getBars(searchTxt);
         };
      }]);
})();