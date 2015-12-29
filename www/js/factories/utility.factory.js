/**
 * Created by oliviercappelle on 18/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.factories')
    .factory('UtilityFactory', ['$q', '$ionicPlatform', '$cordovaGeolocation', function ($q, $ionicPlatform, $cordovaGeolocation) {
      //TODO: use location, safe to cookies
      var useLocation = true;
      var currentLocation = {};
      var positionOptions = {timeout: 10000, enableHighAccuracy: true};

      function getUserCurrentLocation() {
        var deferred = $q.defer();
        if (useLocation) {
          console.log('try to use geolocation');
          /*if(_this.position.lat !== 'undefined' && _this.position.long !== 'undefined') {
           deferred.resolve(_this.position);
           }*/
          $ionicPlatform.ready(function () {
            $cordovaGeolocation
              .getCurrentPosition(positionOptions)
              .then(function (position) {
                console.log('geolocation success');
                console.log(position);
                var lat = position.coords.latitude;
                var long = position.coords.longitude;
                currentLocation.lat = lat;
                currentLocation.long = long;
                console.log(currentLocation);
                deferred.resolve(currentLocation);

              }, function (err) {
                // error
                console.log('can\'t get current geolocation');
                deferred.resolve(null);
              });
          });
        }
        else {
          deferred.resolve(null);
        }
        return deferred.promise;
      }

      function getGeoLocation() {
        var deferred = $q.defer();

        console.log('try to use geolocation');

        var callbacks = {
          success: function (position) {
            console.log('geolocation success');
            console.log(position);

            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            currentLocation.lat = lat;
            currentLocation.long = long;
            console.log(currentLocation);
            deferred.resolve(currentLocation);
          },
          error: function (err) {
            console.log('can\'t get current geolocation');
            deferred.resolve(null);
          }
        };

        $ionicPlatform.ready(function () {
          $cordovaGeolocation
            .getCurrentPosition(positionOptions)
            .then(callbacks.success, callbacks.error);
        });

        return deferred.promise;
      }

      return {
        getUserCurrentLocation: getUserCurrentLocation,
        getGeoLocation: getGeoLocation
      }
    }]);
})();
