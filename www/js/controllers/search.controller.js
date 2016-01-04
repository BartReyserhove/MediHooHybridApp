/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('SearchCtrl', ['$scope', '$state', '$ionicLoading', '$ionicContentBanner',
      'HealthCareFactory', 'CordovaUtilityFactory',
      function ($scope, $state, $ionicLoading, $ionicContentBanner, HealthCareFactory, CordovaUtilityFactory) {

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
            .then(function (data) {
              return data;
            });
        };
        $scope.getCities = function (val) {
          return HealthCareFactory.searchCity($scope.searchOptions.country.Id, val)
            .then(function (data) {
              return data;
            });
        };

        $scope.getSpecializations = function (val) {
          console.log('searchOptions');
          console.log($scope.searchOptions);
          return HealthCareFactory.searchSpecializationByClassification($scope.searchOptions.classification, val)
            .then(function (data) {
              return data;
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
          console.log('check if you got geolocation');
          if($scope.useGeoLocation.checked) {
            $ionicLoading.show({
              template: '<ion-spinner></ion-spinner>'
            });
            CordovaUtilityFactory.getGeoLocation().then(function(location) {
              if(location == null) {
                console.log('enable location in settings');

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
          console.log('show results for following value: ');
          console.log($scope.searchOptions);

          if ( ($scope.searchOptions.country == null || $scope.searchOptions.country.Name == undefined)
            && !$scope.useGeoLocation.checked) {
            return;
          }

          $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
          });

          HealthCareFactory.changeCurrentSearchOptions($scope.searchOptions).then(function () {
            HealthCareFactory.searchResultsWithGivenOptions().then(function () {
              $ionicLoading.hide();
              $state.go('tab.search-result-list');
            });
          });
        }
      }]);
})();
