/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('SearchResultListCtrl', ['$scope', '$ionicNavBarDelegate', '$ionicSideMenuDelegate', 'HealthCareFactory',
      function ($scope, $ionicNavBarDelegate, $ionicSideMenuDelegate, HealthCareFactory) {
        $ionicNavBarDelegate.showBackButton(true);

        $scope.showMoreResults = function () {
          console.log('next');
          HealthCareFactory.searchNextByCountry().then(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        };

        $scope.hasMoreResults = function () {
          return HealthCareFactory.hasMoreResults();
        };

        this._init = function () {
          $scope.isReadOnly = true;
          $scope.maxRating = 5;
          /*HealthCareFactory.getCurrentResultSet().then(function (data) {
           $scope.results = data;
           });*/
          $scope.results = HealthCareFactory.getCurrentResultSet();

        };

        this._init();

      }]);
})();
