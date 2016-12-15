'use strict';

(function () {
   angular
      .module('NightlifeApp', ['ngResource'])
      .controller('mybarsController', ['$q', '$resource', '$scope', function ($q, $resource, $scope) {
         
         /***** INITIALIZE *****/
         $scope.hasLoadedInitialData = false;
         $scope.loader = { isAddingBar: false, isDeletingBar: false, isLoadingData: true };
         
         $scope.bars = [];
         $scope.userObject = {};
         
         var Bar = $resource('/api/bars');
         var BarById = $resource('/api/bars/:id');
         var User = $resource('/api/user');
         var UserBars = $resource(
            '/api/user/bars',
            {},
            { update: { method: 'PUT' } }
         );
         var YelpBusiness = $resource('/api/yelp/business/:id');
         
         $(".alert-add-bar").hide();
         $(".alert-delete-bar").hide();
         
         getData();
         
         
         
         /***** CONTROLLER FUNCTIONS *****/
         function getData () {
            User.get(function (res) {
               $scope.userObject = res;
               
               var promises = [];
               
               res.bars.forEach(function (item, index) {
                  
                  // initialize bar model
                  $scope.bars[index] = { id: item };
                  
                  // get data of each bars
                  promises.push(YelpBusiness.get({ id: item }).$promise.then(function (res) {
                     if (!$scope.hasLoadedInitialData) 
                        $scope.hasLoadedInitialData = true;
                     
                     $scope.bars[index].name = res.name;
                     $scope.bars[index].url = res.url;
                     $scope.bars[index].image_url = res.image_url;
                     $scope.bars[index].review = res.review;
                  }, function (err) {
                     console.log('YelpBusiness.get error', err)
                  }));
                  
                  // get the number of attendees of each bars
                  promises.push(BarById.get({ id: item }).$promise.then(function (res) {
                     $scope.bars[index].attendees = res.attendees;
                  }, function (err) {
                     // bar document not found error
                  }));
                  
               });
               
               $q.all(promises).then(function () {
                  $scope.loader.isLoadingData = false;
               }, function (err) {
                  console.log('$q.all err', err)
               });
            }, function (err) {
               $("#authorized-navbar").addClass("hide");
               $("#unauthorized-navbar").removeClass("hide");
            });
         }

         
         
         /***** USER INTERACTIONS *****/
         $scope.deleteBar = function (barId, index) {
            $scope.loader.isDeletingBar = true;
            
            var barIdIndex = $scope.userObject.bars.indexOf(barId);
            $scope.userObject.bars.splice(barIdIndex, 1);
            
            $scope.bars.splice(index, 1);
            
            var data = { 
               barId: barId,
               newUserBars: $scope.userObject.bars,
               userId: $scope.userObject._id
            };
            
            UserBars.update(data, function (res) {
               $scope.loader.isDeletingBar = false;
               
               $(".alert-delete-bar").alert();
               $(".alert-delete-bar").fadeTo(2000, 500).slideUp(500, function(){
                  $(".alert-delete-bar").slideUp(500);
               });  
            }, function (err) {
               console.log('UserBars.update error', err)
            });
         };
         
         $scope.search = function (searchTxt) {
            getBars(searchTxt);
         };
      }]);
})();