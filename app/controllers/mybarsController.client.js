'use strict';

(function () {
   angular
      .module('NightlifeApp', ['ngResource'])
      .controller('mybarsController', ['$scope', '$resource', function ($scope, $resource) {
         
         /***** INITIALIZE *****/
         $scope.loader = { isLoadingData: true };
         
         $scope.user = {};
         
         var User = $resource('/api/user');
         
         getUser();
         
         
         
         /***** CONTROLLER FUNCTIONS *****/
         function getUser () {
            User.get(function (res) {
               $scope.loader.isLoadingData = false;
               $scope.user = res;
            }, function (err) {
               console.log('User.get error', err)
               alert('Oops! Something went wrong. Refresh the page or try again later.');
            });
         }

         
         
         /***** USER INTERACTIONS *****/
         
      }]);
})();