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

        $scope.launchNavigator = function (location) {
          CordovaUtilityFactory.launchNavigator(location);
        };

        $scope.sendEmail = function (mailTo) {
          CordovaUtilityFactory.sendEmail(mailTo);
        };

      }]);
})();
