/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('HomeCtrl', ['$scope', '$state', 'HealthCareFactory', 'SearchHistoryFactory', '$ionicLoading',
      function ($scope, $state, HealthCareFactory, SearchHistoryFactory, $ionicLoading) {

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

        $scope.navigateToSearch = function (code) {
          HealthCareFactory.getClassification(code).then(function (item) {
            $scope.searchOptions.classification = item.code;
            $state.go('tab.search');
          });
        };

      }]);
})();
