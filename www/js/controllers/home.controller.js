/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('HomeCtrl', ['$scope', '$state', 'HealthCareFactory',
      function ($scope, $state, HealthCareFactory) {

        $scope.navigateToSearch = function (code) {
          HealthCareFactory.getClassification(code).then(function (item) {
            $scope.searchOptions.classification = item.code;
            $state.go('tab.search');
          });
        };

      }]);
})();
