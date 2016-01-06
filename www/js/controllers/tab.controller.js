/**
 * Created by oliviercappelle on 18/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('TabCtrl', ['$rootScope', '$scope', '$state', 'CordovaUtilityFactory',
      '$ionicPlatform', '$cordovaNetwork', '$ionicContentBanner',
      function ($rootScope, $scope, $state, CordovaUtilityFactory,
                $ionicPlatform, $cordovaNetwork, $ionicContentBanner) {

        //TODO: find better place to put this?
        this._init = function() {
          $scope.searchOptions = {
            classification: null,
            specialization: null,
            country: null,
            city: null,
            location: null,
            distance: 50,
            skip: 0
          };

          $scope.hasNetwork = false;

          //TODO: link to settings ctrl
          $scope.language = '';
        };

        this._init();

        $ionicPlatform.ready(function () {
          $scope.hasNetwork = $cordovaNetwork.isOnline;
          console.log('hasNetwork:');
          console.log($scope.hasNetwork);
        });

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

        $scope.swipeTo = function (tabName) {
          $state.go('tab.' + tabName);
        };

        $scope.copyToClipBoard = function (value) {
          CordovaUtilityFactory.copyToClipBoard(value);
        };

        $scope.openInAppBrowser = function (url) {
          CordovaUtilityFactory.openInAppBrowser(url);
        };

        $scope.launchNavigator = function (location) {
          CordovaUtilityFactory.launchNavigator(location);
        };

        $scope.sendEmail = function (mailTo) {
          CordovaUtilityFactory.sendEmail(mailTo);
        };

      }]);
})();
