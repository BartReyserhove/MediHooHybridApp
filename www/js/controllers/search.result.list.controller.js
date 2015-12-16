/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('SearchResultListCtrl', ['$scope', '$ionicNavBarDelegate', 'HealthCareFactory',
      function ($scope, $ionicNavBarDelegate, HealthCareFactory) {
        $ionicNavBarDelegate.showBackButton(true);

        this._init = function () {
          $scope.isReadOnly = true;
          $scope.maxRating = 5;
          HealthCareFactory.getCurrentResultSet().then(function (data) {
            $scope.results = data;
          });
        };

        this._init();
      }]);
})();
