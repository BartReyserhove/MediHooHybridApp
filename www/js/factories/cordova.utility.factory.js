/**
 * Created by oliviercappelle on 18/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.factories')
    .factory('CordovaUtilityFactory', ['$q', '$ionicPlatform', '$cordovaGeolocation', '$cordovaEmailComposer', '$cordovaClipboard',
      function ($q, $ionicPlatform, $cordovaGeolocation, $cordovaEmailComposer, $cordovaClipboard) {
        var currentLocation = {};
        var positionOptions = {timeout: 10000, enableHighAccuracy: true};

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

        function sendEmail(mailTo) {
          $ionicPlatform.ready(function () {
            $cordovaEmailComposer.isAvailable().then(function () {
              // is available
              console.log("available");

              var email = {
                to: mailTo,
                cc: null,
                bcc: null,
                attachments: null,
                subject: null,
                body: null,
                isHtml: true
              };

              $cordovaEmailComposer.open(email).then(null, function () {
                // user cancelled email
              });
            }, function () {
              // not available
              console.log("not available");
            });
          });
        }

        function launchNavigator(location) {
          var destination = location.AddressLine1 + ',' + location.City + ',' + location.Country;
          var start = null;

          var callbacks = {
            success: function () {
              console.log('Plugin success');
            },
            error: function (error) {
              console.log('Plugin error: ' + error);
              window.open('https://maps.google.com?daddr=' + destination.replace(',', '+'), '_blank');
            }
          };

          var options = null;
          var isMobile = false;

          if (ionic.Platform.isIOS()) {
            isMobile = true;
            options = {
              preferGoogleMaps: true,
              enableDebug: true,
              disableAutoGeolocation: true
            };
          }
          else if (ionic.Platform.isAndroid()) {
            isMobile = true;
            options = {
              navigationMode: "turn-by-turn",
              disableAutoGeolocation: true
            };
          }
          else if (ionic.Platform.isWindowsPhone()) {
            isMobile = true;
            options = {
              disableAutoGeolocation: true
            };
          }

          if (isMobile) {
            launchnavigator.navigate(
              destination,
              start,
              callbacks.success,
              callbacks.error,
              options
            );
          }
        }

        function openInAppBrowser(url) {
          // Open in app browser
          console.log('url: ' + url);
          if (url.indexOf('http://') != 0) {
            url = 'http://' + url;
          }
          console.log('changed url: ' + url);
          window.open(url, '_blank');
        }

        function copyToClipBoard(value) {
          var callbacks = {
            success: function () {
              console.log('Copy success');
            },
            error: function (error) {
              console.log('Copy error');
            }
          };

          $ionicPlatform.ready(function () {
            $cordovaClipboard.copy(value).then(callbacks.success, callbacks.error);
          });
        }

        return {
          getGeoLocation: getGeoLocation,
          sendEmail: sendEmail,
          launchNavigator: launchNavigator,
          openInAppBrowser: openInAppBrowser,
          copyToClipBoard: copyToClipBoard
        }
      }]);
})();
