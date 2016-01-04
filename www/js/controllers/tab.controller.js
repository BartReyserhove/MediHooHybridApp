/**
 * Created by oliviercappelle on 18/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('TabCtrl', ['$rootScope', '$scope', '$state', 'CordovaUtilityFactory',
      '$ionicPlatform', /*'$cordovaEmailComposer', '$cordovaClipboard',*/ '$cordovaNetwork', '$ionicContentBanner',
      function ($rootScope, $scope, $state, CordovaUtilityFactory,
                $ionicPlatform, /*$cordovaEmailComposer, $cordovaClipboard,*/ $cordovaNetwork, $ionicContentBanner) {
        //TODO: find better place to put this?
        $scope.searchOptions = {
          classification: null,
          specialization: null,
          country: null,
          city: null,
          location: null,
          distance: 50,
          skip: 0
        };

        $ionicPlatform.ready(function () {
          $scope.hasNetwork = $cordovaNetwork.isOnline;
          console.log('hasNetwork:');
          console.log($scope.hasNetwork);
        });

        $scope.swipeTo = function (tabName) {
          $state.go('tab.' + tabName);
        };

        $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
          $scope.hasNetwork = true;
          console.log('hasNetwork = true');
        });

        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
          $scope.hasNetwork = false;
          console.log('hasNetwork = false');
          $ionicContentBanner.show({
            text: ['No network found'],
            type: 'error',
            autoClose: 10000
          });
        });

        $scope.copyToClipBoard = function (value) {
          CordovaUtilityFactory.copyToClipBoard(value);
          /*var callbacks = {
            success: function () {
              console.log('Copy success');
            },
            error: function (error) {
              console.log('Copy error');
            }
          };

          $ionicPlatform.ready(function () {
            $cordovaClipboard.copy(value).then(callbacks.success, callbacks.error);
          });*/
        };

        $scope.openInAppBrowser = function (url) {
          CordovaUtilityFactory.openInAppBrowser(url);
          /*// Open in app browser
          console.log('url: ' + url);
          if (url.indexOf('http://') != 0) {
            url = 'http://' + url;
          }
          console.log('changed url: ' + url);
          window.open(url, '_blank');*/
        };

        //$scope.launchNavigator = function (latitude, longitude) {
        $scope.launchNavigator = function (location) {
          CordovaUtilityFactory.launchNavigator(location);
          /*var destination = item.AddressLine1 + ',' + item.City + ',' + item.Country;
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
          }*/
        };

        $scope.sendEmail = function (mailTo) {
          CordovaUtilityFactory.sendEmail(mailTo);
          /*$ionicPlatform.ready(function () {
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
          });*/
        };

        /*$ionicModal.fromTemplateUrl('./templates/search-filters.html',
         function (modal) {
         $scope.modal = modal;

         $scope.hideFilters = function () {
         $scope.modal.hide();
         };

         $scope.searchWithFilters = function () {
         console.log('close modal');
         $scope.hideFilters();
         };
         },
         {
         scope: $scope,
         animation: 'slide-in-up'
         });

         $scope.showFilters = function () {
         console.log('show modal');
         $scope.modal.show();
         };*/

        //TODO: link to settings ctrl
        $scope.language = '';
      }]);
})();
