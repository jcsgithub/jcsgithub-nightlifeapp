'use strict';

(function () {
   angular
      .module('NightlifeApp', ['ngResource'])
      .controller('indexController', ['$scope', '$resource', function ($scope, $resource) {
         
         /***** INITIALIZE *****/
         $scope.hasSearched = false;
         $scope.loader = { isAddingBar: false, isDeletingBar: false, isLoadingUser: true, isSearchingBars: false };
         
         $scope.bars = [];
         $scope.isLoggedIn = false;
         $scope.searchTxt = '';
         $scope.userObject = {};
         
         var Bar = $resource('/api/bars');
         var BarById = $resource('/api/bars/:id');
         var User = $resource('/api/user');
         var UserBars = $resource(
            '/api/user/bars',
            {},
            { update: { method: 'PUT' } }
         );
         
         
         getUser();
         
         
         
         /***** CONTROLLER FUNCTIONS *****/
         function getBars (searchTxt) {
            $scope.hasSearched = true;
            $scope.loader.isSearchingBars = true;
            
            $scope.bars = [];
            
            Bar.get({ location: searchTxt }, function (res) {
               $scope.loader.isSearchingBars = false;
               $('.bars').removeClass('hidden');
               
               $scope.bars = res.bars;
               
               // get the number of attendees of each bars
               $scope.bars.forEach(function (item, index) {
                  
                  BarById.get({ id: item.id }, function (res) {
                     if (res && res.attendees) {
                        $scope.bars[index].attendees = res.attendees;
                     }
                  }, function (err) {
                     // bar document not found error
                  });
                  
               });
               
               // to not search again after logging in
               localStorage.setItem('jcsgithubNightlifeAppLastSearch', searchTxt);
            }, function (err) {
               console.log('Bar.get error', err);
            });
         }
         
         function getUser () {
            User.get(function (res) {
               $scope.isLoggedIn = true;
               $scope.userObject = res;
               
               if ($scope.userObject._id) {
                  $("#authorized-navbar").removeClass("hide");
                  $("#unauthorized-navbar").addClass("hide");
                  
                  // check if localStorage has last search
                  var lastSearchTxt = localStorage.getItem('jcsgithubNightlifeAppLastSearch');
                  if (lastSearchTxt) {
                     $scope.searchTxt = lastSearchTxt;
                     getBars(lastSearchTxt);
                  }
               }
            }, function (err) {
               $("#authorized-navbar").addClass("hide");
               $("#unauthorized-navbar").removeClass("hide");
            });
         }

         
         
         /***** USER INTERACTIONS *****/
         $scope.addBar = function (barId, index) {
            if ($scope.isLoggedIn) {
               $scope.loader.isAddingBar = true;
               
               $scope.bars[index].attendees.push($scope.userObject._id);
               $scope.userObject.bars.push(barId);
               
               var data = { 
                  barId: barId,
                  newUserBars: $scope.userObject.bars,
                  userId: $scope.userObject._id
               };
               
               UserBars.save(data, function (res) {
                  $scope.loader.isAddingBar = false;
               }, function (err) {
                  console.log('UserBars.save error', err)
               });
            } else {
               window.location.href = 'https://jcsgithub-nightlifeapp-jcsgithub.c9users.io/auth/facebook'
            }
         };
         
         $scope.deleteBar = function (barId, index) {
            $scope.loader.isDeletingBar = true;
            
            var barIdIndex = $scope.userObject.bars.indexOf(barId);
            $scope.userObject.bars.splice(barIdIndex, 1);
            
            var userIdIndex = $scope.bars[index].attendees.indexOf($scope.userObject._id);
            $scope.bars[index].attendees.splice(userIdIndex, 1);
            
            var data = { 
               barId: barId,
               newUserBars: $scope.userObject.bars,
               userId: $scope.userObject._id
            };
            
            UserBars.update(data, function (res) {
               $scope.loader.isDeletingBar = false;
            }, function (err) {
               console.log('UserBars.update error', err)
            });
         };
         
         $scope.search = function (searchTxt) {
            getBars(searchTxt);
         };
      }]);
})();