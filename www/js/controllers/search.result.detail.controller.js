/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('SearchResultDetailCtrl', ['$scope', '$stateParams', 'HealthCareFactory', function ($scope, $stateParams, HealthCareFactory) {

      this._init = function () {
        var id = $stateParams.resultId;
        console.log('id: ' + id);
        /*HealthCareFactory.getResultWithId(id).then(function (item) {
          console.log('callback result with id');
          console.log(item);
          $scope.result = item;
        });*/
        //TODO: replace by call to factory
        $scope.result = {
          "Key": "AA5EB254746C9D198CABAA0C53AC5DA3",
          "Score": 8.285714,
          "Data": {
            "Id": "ae5afada-b2ba-4e57-9b37-c64d47f8ead3",
            "DisplayName": "REGIONAAL ZIEKENHUIS HEILIG HART LEUVEN",
            "LegalName": "",
            "AddressLine1": "Naamsestraat",
            "City": "Leuven",
            "ZipCode": null,
            "Region": "Flanders",
            "Country": "Belgium",
            "CustomLocation": {
              "type": "Point",
              "coordinates": [
                0,
                0
              ]
            },
            "Location": {
              "type": "Point",
              "coordinates": [
                4.70166414949201,
                50.8722792094284
              ]
            },
            "Telephone": "+32 ((0)16) 209211",
            "Website": "www.hhleuven.be/",
            "EmailAddress": "info@hhleuven.be",
            "Rating": 4.428571,
            "ProfilePictureUrl": "https://mhprodweproviders.blob.core.windows.net/public/ae5afada-b2ba-4e57-9b37-c64d47f8ead3/8d75070c-ad6b-4961-b896-5059b06f5e70/Regionaalziekenhuisheilighart_Naamsestraat_1.jpg",
            "HasClaimed": false,
            "HasPictures": true,
            "Url": "/hospitals/belgium/leuven/regionaal-ziekenhuis-heilig-hart-leuven",
            "Classifications": [],
            "Specializations": [],
            "Professions": [],
            "Types": [
              "Hospitals",
              "Organisation"
            ],
            "IsHospital": true,
            "Recommended": true,
            "HouseNumber": "105"
          }
        }
      };

      this._init();

    }]);
})();
