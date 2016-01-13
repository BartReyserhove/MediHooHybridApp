/**
 * Created by oliviercappelle on 18/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('TabCtrl', ['$rootScope', '$scope', '$state', 'CordovaUtilityFactory',
      '$ionicPlatform', '$cordovaNetwork', '$ionicContentBanner', '$ionicTabsDelegate',
      function ($rootScope, $scope, $state, CordovaUtilityFactory,
                $ionicPlatform, $cordovaNetwork, $ionicContentBanner, $ionicTabsDelegate) {

        //TODO: find better place to put this?
        this._init = function () {
          //these 2 are used for ratings
          $scope.isReadOnly = true;
          $scope.maxRating = 5;

          $scope.searchOptions = {
            classification: null,
            specialization: null,
            country: null,
            city: null,
            location: null,
            distance: 50,
            skip: 0
          };

          //TODO: remove this maybe?
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
          $scope.showMessage('No network found', 'error');
        });

        $scope.showMessage = function (message, type) {
          //type: error or info
          $ionicContentBanner.show({
            text: [message],
            type: type,
            autoClose: 10000
          });
        };

        $scope.swipeTo = function (tabIndex) {
          $ionicTabsDelegate.select(tabIndex);
        };

        $scope.goForward = function () {
          var selected = $ionicTabsDelegate.selectedIndex();
          if (selected != -1) {
            $ionicTabsDelegate.select(selected + 1);
          }
        };

        $scope.goBack = function () {
          var selected = $ionicTabsDelegate.selectedIndex();
          if (selected != -1 && selected != 0) {
            $ionicTabsDelegate.select(selected - 1);
          }
        };

        $scope.copyToClipBoard = function (value) {
          CordovaUtilityFactory.copyToClipBoard(value);
        };

        $scope.openInAppBrowser = function (url) {
          CordovaUtilityFactory.openInAppBrowser(url);
        };

        $scope.launchNavigator = function (provider) {
          CordovaUtilityFactory.launchNavigator(provider);
        };

        $scope.sendEmail = function (mailTo) {
          CordovaUtilityFactory.sendEmail(mailTo);
        };

      }]);
})();
