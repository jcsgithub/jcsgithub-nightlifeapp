'use strict';

(function () {
   angular
      .module('NightlifeApp', ['ngResource'])
      .controller('mybarsController', ['$scope', '$resource', function ($scope, $resource) {
         
         /***** INITIALIZE *****/
         $scope.loader = { isLoadingPolls: true };
         
         $scope.bars = [];
         $scope.searchTxt = '';
         
         var User = $resource('/api/user');
         
         getUser();
         
         
         
         /***** CONTROLLER FUNCTIONS *****/
         function getBars (searchTxt) {
            console.log('user is logged in, getting bars')
         }
         
         function getUser () {
            User.get(function (res) {
               console.log('getUser', res)
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
         
      }]);
})();