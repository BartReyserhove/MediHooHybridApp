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
          this.id = $stateParams.resultId;

          HealthCareFactory.getResultWithId(this.id).then(function (item) {
            $scope.result = item;
          });
        }.bind(this);

        this._init();

      }]);
})();
