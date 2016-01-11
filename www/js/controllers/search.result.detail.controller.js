/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('SearchResultDetailCtrl', ['$scope', '$stateParams', '$ionicNavBarDelegate', 'HealthCareFactory',
      function ($scope, $stateParams, $ionicNavBarDelegate, HealthCareFactory) {

        $ionicNavBarDelegate.showBackButton(true);

        this._init = function () {
          this.id = $stateParams.resultId;

          HealthCareFactory.getResultWithId(this.id).then(function (res) {
            if (res.error) { //TODO: might want to do something here when an error occurs

            }
            else {
              //$scope.result = res.data;
              $scope.provider = {
                country: res.data.ProviderAddressItem.Address.Country.Name,
                city: res.data.ProviderAddressItem.Address.City.Name,
                street: res.data.ProviderAddressItem.Address.AddressLine1,
                houseNumber: res.data.ProviderAddressItem.Address.HouseNumber,
                website: res.data.ProviderAddressItem.Website,
                emailAddress: res.data.ProviderAddressItem.EmailAddress,
                phoneNumber: res.data.ProviderAddressItem.PhoneNumber1,
                profilePicture: res.data.ProviderAddressItem.MainPicture.ThumbnailUrl,
                displayName: res.data.ProviderAddressItem.DisplayName,
                isIndividual: res.data.IsIndividual,
                isRecommended: res.data.IsRecommended,
                type: res.data.ProviderClassificationGroup.Type,
                specializations: res.data.ProviderClassificationGroup.Specializations,
                classifications: res.data.ProviderClassificationGroup.Classifications
              };

              $scope.isFavourite = false;
            }
          });
        }.bind(this);

        this._init();

        $scope.clickFavouriteBtn = function () {
          $scope.isFavourite = !$scope.isFavourite;
        }
      }]);
})();
