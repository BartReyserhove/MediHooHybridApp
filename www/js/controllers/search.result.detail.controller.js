/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('SearchResultDetailCtrl', ['$scope', '$stateParams', '$ionicNavBarDelegate', 'HealthCareFactory',
      function ($scope, $stateParams, $ionicNavBarDelegate, HealthCareFactory) {
      $ionicNavBarDelegate.showBackButton(true);

      this._init = function () {
        var id = $stateParams.resultId;
        console.log('id: ' + id);
        HealthCareFactory.getResultWithId(id).then(function (item) {
          console.log('callback result with id');
          console.log(item);
          $scope.result = item;
        });
      };

      this._init();

    }]);
})();
