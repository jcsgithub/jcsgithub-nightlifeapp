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
         $scope.totalBars = 0;
         
         var Bar = $resource('/api/bars');
         var User = $resource('/api/user');
         
         getUser();
         
         
         
         /***** CONTROLLER FUNCTIONS *****/
         function getBars (searchTxt) {
            $scope.hasSearched = true;
            $scope.loader.isSearchingBars = true;
            
            $scope.bars = [];
            
            Bar.get({ searchTxt: searchTxt }, function (res) {
               console.log('Bar.get', res)
               
               $scope.loader.isSearchingBars = false;
               $('.bars').removeClass('hidden');
               
               $scope.bars = res.businesses;
               $scope.totalBars = res.total;
            }, function (err) {
               console.log('Bar.get error', err);
            });
         }
         
         function getUser () {
            User.get(function (res) {
               console.log('User.get', res)
               
               if (res._id) {
                  $("#authorized-navbar").removeClass("hide");
                  $("#unauthorized-navbar").addClass("hide");
                  
                  // if user is logged in, continue with the last search
                  getBars($scope.searchTxt);
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