/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
    'use strict';

    angular.module('mediHooApp.controllers')
      .controller('SearchCtrl', ['$scope', '$state', '$ionicLoading', 'HealthCareFactory', function($scope, $state, $ionicLoading, HealthCareFactory) {
        $scope.getCountries = function(val) {
          return HealthCareFactory.searchCountry(val)
            .then(function(data) {
              return data;
            });
        };

        $scope.showResults = function(val) {
          $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
          });
          console.log(val.Name);
          var searchOptions = {
            country: {name: val.Name, id: val.Id},
            skip: 0
          };
          HealthCareFactory.changeCurrentSearchOptions(searchOptions).then(function() {
            HealthCareFactory.searchByCountry().then(function() {
              $ionicLoading.hide();
              $state.go('tab.search-result-list');
            });
          });
        }
      }]);
})();
