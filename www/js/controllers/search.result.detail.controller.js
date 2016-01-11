/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('SearchResultDetailCtrl', ['$scope', '$stateParams', '$ionicNavBarDelegate', '$ionicLoading',
      'HealthCareFactory', 'FavouritesFactory',
      function ($scope, $stateParams, $ionicNavBarDelegate, $ionicLoading, HealthCareFactory, FavouritesFactory) {

        $ionicNavBarDelegate.showBackButton(true);

        this._init = function () {
          this.id = $stateParams.resultId;

          $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
          });
          HealthCareFactory.getResultWithId(this.id).then(function (res) {
            if (res.error) { //TODO: might want to do something here when an error occurs
              $ionicLoading.hide();
            }
            else {
              //$scope.result = res.data;
              $scope.provider = {
                id: res.data.ProviderAddressItem.Id,
                country: res.data.ProviderAddressItem.Address.Country.Name,
                city: res.data.ProviderAddressItem.Address.City.Name,
                street: res.data.ProviderAddressItem.Address.AddressLine1,
                houseNumber: res.data.ProviderAddressItem.Address.HouseNumber,
                website: res.data.ProviderAddressItem.Website,
                emailAddress: res.data.ProviderAddressItem.EmailAddress,
                phoneNumber: res.data.ProviderAddressItem.PhoneNumber1,
                profilePicture: res.data.ProviderAddressItem.MainPicture == null ?
                  null : res.data.ProviderAddressItem.MainPicture.ThumbnailUrl,
                displayName: res.data.ProviderAddressItem.DisplayName,
                isIndividual: res.data.IsIndividual,
                isRecommended: res.data.IsRecommended,
                type: res.data.ProviderClassificationGroup.Type,
                specializations: res.data.ProviderClassificationGroup.Specializations,
                classifications: res.data.ProviderClassificationGroup.Classifications
              };

              //PhoneNumber sometimes contains a string at the end
              if ($scope.provider.phoneNumber != undefined
                && $scope.provider.phoneNumber != null
                && $scope.provider.phoneNumber != '') {
                var indexOf = $scope.provider.phoneNumber.search(/[a-z]/i);
                if (indexOf > -1) {
                  var indexIsANumber = false;
                  var regexIsNumber = /^\d+$/;
                  do {
                    if(regexIsNumber.test($scope.provider.phoneNumber.charAt(--indexOf))) {
                      indexIsANumber = true;
                    }
                  } while (!indexIsANumber);
                  $scope.provider.phoneNumber = $scope.provider.phoneNumber.substring(0, indexOf);
                }
              }

              FavouritesFactory.isFavourite($scope.provider.id).then(function (isFavourite) {
                $scope.isFavourite = isFavourite;
                $ionicLoading.hide();
              });
            }
          });
        }.bind(this);

        this._init();

        $scope.clickFavouriteBtn = function () {
          if ($scope.isFavourite) {
            FavouritesFactory.remove($scope.provider.id);
          }
          else {
            FavouritesFactory.add($scope.provider);
          }
          $scope.isFavourite = !$scope.isFavourite;
        }
      }]);
})();
