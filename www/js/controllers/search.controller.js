/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
    'use strict';

    angular.module('mediHooApp.controllers')
      .controller('SearchCtrl', ['$scope', '$state', 'HealthCareFactory', function($scope, $state, HealthCareFactory) {
        $scope.getCountries = function(val) {
          return HealthCareFactory.searchCountry(val)
            .then(function(data) {
              return data;
            });
        };

        $scope.showResults = function(val) {
          console.log(val);
          HealthCareFactory.searchByCountry(val).then(function() {
            $state.go('tab.search-result-list');
          });
        }
      }]);
})();
