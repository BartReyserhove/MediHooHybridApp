/**
 * Created by oliviercappelle on 11/01/16.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('HistoryCtrl', ['$scope', '$state', '$ionicLoading', 'SearchHistoryFactory', 'HealthCareFactory',
      function ($scope, $state, $ionicLoading, SearchHistoryFactory, HealthCareFactory) {

        this._init = function () {
          $scope.searchHistory = SearchHistoryFactory.getSearchHistory();
        };

        this._init();

        $scope.navigateToResultList = function (searchCriteria) {
          $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
          });

          HealthCareFactory.changeCurrentSearchOptions(searchCriteria).then(function () {
            HealthCareFactory.searchResultsWithGivenOptions().then(function () {
              $ionicLoading.hide();
              $state.go('tab.search-result-list');
            });
          });
        };

        $scope.clearHistory = function () {
          SearchHistoryFactory.clearHistory();
        };

      }]);
})();
