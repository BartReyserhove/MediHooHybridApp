/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('SearchResultListCtrl', ['$scope', '$ionicNavBarDelegate', '$ionicSideMenuDelegate', 'HealthCareFactory',
      function ($scope, $ionicNavBarDelegate, $ionicSideMenuDelegate, HealthCareFactory) {
        $ionicNavBarDelegate.showBackButton(true);

        this._init = function () {
          $scope.isSpecifiedInSearchCriteria = HealthCareFactory.isSpecifiedInSearchCriteria();
          $scope.results = HealthCareFactory.getCurrentResultSet();
        };

        this._init();

        $scope.showMoreResults = function () {
          HealthCareFactory.searchNextResultsWithGivenOptions().then(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        };

        $scope.hasMoreResults = function () {
          return HealthCareFactory.hasMoreResults();
        };
      }]);
})();
