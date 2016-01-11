/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('SearchCtrl', ['$scope', '$state', '$ionicLoading', '$ionicContentBanner',
      'HealthCareFactory', 'CordovaUtilityFactory', 'SearchHistoryFactory',
      function ($scope, $state, $ionicLoading, $ionicContentBanner,
                HealthCareFactory, CordovaUtilityFactory, SearchHistoryFactory) {

        this._init = function () {
          $scope.useGeoLocation = {
            text: 'Use current location',
            checked: false
          };

          HealthCareFactory.getClassifications().then(function (data) {
            $scope.classifications = data;
          });
        };

        this._init();

        $scope.getCountries = function (val) {
          return HealthCareFactory.searchCountry(val)
            .then(function (res) {
              if (res.error) {
                $scope.showMessage('No network found', 'error');
                return [];
              }
              else return res.data;
            });
        };
        $scope.getCities = function (val) {
          return HealthCareFactory.searchCity($scope.searchOptions.country.Id, val)
            .then(function (res) {
              if (res.error) {
                $scope.showMessage('No network found', 'error');
                return [];
              }
              else return res.data;
            });
        };

        $scope.getSpecializations = function (val) {
          return HealthCareFactory.searchSpecializationByClassification($scope.searchOptions.classification, val)
            .then(function (res) {
              if (res.error) {
                $scope.showMessage('No network found', 'error');
                return [];
              }
              else return res.data;
            });
        };

        $scope.specializationLabel = function (specialization) {
          if (specialization != null) {
            if (specialization.SpecializationName == null) {
              return specialization.ParentSpecializationName;
            }
            else {
              return specialization.ParentSpecializationName + ' - ' + specialization.SpecializationName;
            }
          }
          else {
            return '';
          }
        };

        $scope.geoLocationChanged = function () {
          if ($scope.useGeoLocation.checked) {
            $ionicLoading.show({
              template: '<ion-spinner></ion-spinner>'
            });
            CordovaUtilityFactory.getGeoLocation().then(function (location) {
              if (location == null) {

                $scope.useGeoLocation.checked = false;
                $ionicContentBanner.show({
                  text: ['Please enable location on your smartphone first.'],
                  autoClose: 10000
                });
                $scope.searchOptions.location = null;
              }
              else {
                $scope.searchOptions.location = location;
              }
              $ionicLoading.hide();
            })
          }
        };

        $scope.showResults = function () {
          if (($scope.searchOptions.country == null || $scope.searchOptions.country.Name == undefined)
            && !$scope.useGeoLocation.checked) {
            return;
          }

          $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
          });

          HealthCareFactory.changeCurrentSearchOptions($scope.searchOptions).then(function () {
            HealthCareFactory.searchResultsWithGivenOptions().then(function (res) {
              if (res.error) {
                $scope.showMessage('No network found', 'error');
                $ionicLoading.hide();
              }
              else {
                SearchHistoryFactory.addSearchCriteriaToHistory(HealthCareFactory.getCurrentSearchOptions());
                $ionicLoading.hide();
                $state.go('tab.search-result-list');
              }
            });
          });
        };

      }]);
})();
