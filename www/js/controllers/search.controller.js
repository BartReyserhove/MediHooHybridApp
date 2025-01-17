/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('SearchCtrl', ['$scope', '$state', '$translate', '$timeout', '$ionicLoading',
      'HealthCareFactory', 'CordovaUtilityFactory', 'SearchHistoryFactory', '$cordovaKeyboard',
      function ($scope, $state, $translate, $timeout, $ionicLoading,
                HealthCareFactory, CordovaUtilityFactory, SearchHistoryFactory, $cordovaKeyboard) {
        var _this = this;
        _this._init = function () {
          $scope.useGeoLocation = {
            checked: false
          };

          $scope.cityIsSpecified = false;

          $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
          });
          HealthCareFactory.changeClassifications($translate.use()).then(function () {
            $scope.classifications = HealthCareFactory.getClassifications();
            $ionicLoading.hide();
          });
        };

        _this._init();

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
            $scope.searchOptions.country = '';
            $scope.searchOptions.city = '';

            $ionicLoading.show({
              template: '<ion-spinner></ion-spinner>'
            });
            CordovaUtilityFactory.getGeoLocation().then(function (location) {
              if (location == null) {

                $scope.useGeoLocation.checked = false;
                $scope.searchOptions.location = null;

                $ionicLoading.hide();

                $scope.showMessage('Please enable location on your smartphone first.');
              }
              else {
                $scope.searchOptions.location = location;

                $ionicLoading.hide();
              }

            })
          }
          else {
            $scope.searchOptions.location = null;
          }
        };

        $scope.showResults = function () {
          if (($scope.searchOptions.country == null || $scope.searchOptions.country.Name == undefined)
            && !$scope.useGeoLocation.checked) {
            return;
          }

          $scope.searchOptions.skip = 0;

          $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
          });

          if($scope.searchOptions.city.Name != undefined) {
            CordovaUtilityFactory.getGeoCode($scope.searchOptions.city.Name + ',' + $scope.searchOptions.country.Name)
              .then(function (location) {
                $scope.searchOptions.location = location;
                _this.getProvidersForCriteria();
              });
          }
          else {
            _this.getProvidersForCriteria();
          }
        };

        _this.getProvidersForCriteria = function() {
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

        //Check if city is a search input by user or an object, to display/hide slider
        $scope.$watch('searchOptions.city', function (newValue) {
          if (newValue.Id == undefined) {
            $scope.cityIsSpecified = false;
          }
          else {
            $scope.cityIsSpecified = true;
            $cordovaKeyboard.close();
          }
        });

        $scope.$watch('searchOptions.country', function (newValue) {
          if (newValue.Id == undefined) {
            $scope.searchOptions.city = '';
          }
          else {
            $cordovaKeyboard.close();
          }
        });

        $scope.$watch('searchOptions.classification', function (newValue) {
          $scope.searchOptions.specialization = '';
        });

        $scope.$watch('searchOptions.specialization', function (newValue) {
          if (newValue.ParentSpecializationName != undefined) {
            $cordovaKeyboard.close();
          }
        });

        $scope.onTap = function(e) {
          if(ionic.Platform.isIOS()) {
            $scope.searchOptions.distance = Math.round((e.target.max / e.target.offsetWidth)*(e.gesture.touches[0].screenX - e.target.offsetLeft));
          }
        };

      }]);
})();
