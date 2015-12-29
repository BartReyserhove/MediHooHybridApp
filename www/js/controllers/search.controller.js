/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('SearchCtrl', ['$scope', '$state', '$ionicLoading', '$ionicContentBanner',
      'HealthCareFactory', 'UtilityFactory',
      function ($scope, $state, $ionicLoading, $ionicContentBanner, HealthCareFactory, UtilityFactory) {

        this._init = function () {
          //TODO: check with settings
          $scope.useGeoLocation = {
            text: 'Use current location',
            checked: false
          };

          $scope.searchOptions = {
            classification: null,
            specialization: null,
            country: null,
            city: null,
            location: null
          };
          //$scope.selectedClassification = null;
          //$scope.selectedSpecialization = null;

          HealthCareFactory.getClassifications().then(function (data) {
            $scope.classifications = data;
          });

          //TODO: verwijder hier geolocatie
          //console.log('GetPosition');
          /*UtilityFactory.getUserCurrentLocation().then(function (position) {
            console.log(position);
            $scope.position = position;
            //return data;
          });*/
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
          return HealthCareFactory.searchSpecializationByClassification($scope.searchOptions.classification.code, val)
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
            UtilityFactory.getGeoLocation().then(function(location) {
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
            })
          }
        };

        $scope.showResults = function () {
          console.log('show results for following value: ');
          console.log($scope.searchOptions);

          if ($scope.searchOptions.country == null || $scope.searchOptions.country.Name == undefined) {
            return;
          }

          $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
          });
          var searchOptions = {
            country: $scope.searchOptions.country,
            city: $scope.searchOptions.city,
            classification: $scope.searchOptions.classification,
            specialization: $scope.searchOptions.specialization,
            location: $scope.searchOptions.location,
            skip: 0
          };
          HealthCareFactory.changeCurrentSearchOptions(searchOptions).then(function () {
            HealthCareFactory.searchByCountry().then(function () {
              $ionicLoading.hide();
              $state.go('tab.search-result-list');
            });
          });
        }
      }]);
})();
