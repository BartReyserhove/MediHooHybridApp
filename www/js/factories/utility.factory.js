/**
 * Created by oliviercappelle on 18/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.factories')
    .factory('UtilityFactory', ['$q', '$cordovaGeolocation', function ($q, $cordovaGeolocation) {
      //TODO: use location, safe to cookies
      var useLocation = true;
      var position = {};
      var positionOptions = {timeout: 10000, enableHighAccuracy: false};

      function getUserCurrentLocation() {
        var deferred = $q.defer();
        var _this = this;
        if (useLocation) {
          if(_this.position.lat !== 'undefined' && _this.position.long !== 'undefined') {
            deferred.resolve(_this.position);
          }
          $cordovaGeolocation
            .getCurrentPosition(_this.positionOptions)
            .then(function (position) {
              var lat = position.coords.latitude;
              var long = position.coords.longitude;
              _this.position.lat = lat;
              _this.position.long = long;
              deferred.resolve(_this.position);

            }, function (err) {
              // error
              deferred.resolve(null);
            });
        }
        else {
          deferred.resolve(null);
        }
        return deferred.promise;
      }

      return {
        getUserCurrentLocation: getUserCurrentLocation
      }
    }]);
})();
