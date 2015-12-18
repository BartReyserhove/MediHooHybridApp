// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('mediHooApp', ['ionic', 'ui.bootstrap', 'ngCordova', 'mediHooApp.controllers', 'mediHooApp.factories'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        window.open = cordova.InAppBrowser.open;
        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
        //$cordovaStatusbar.backgroundColorByHexString('#f48231');
        //$cordovaStatusbar.overlaysWebView(true);
        //$cordovaStatusbar.styleHex('#f48231');
        //window.StatusBar.styleHex('#f48231');
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'TabCtrl'
      })
      .state('tab.home', {
        url: '/home',
        views: {
          'tab-home': {
            templateUrl: 'templates/tab-home.html',
            controller: 'HomeCtrl'
          }
        }
      })
      .state('tab.about', {
        url: '/about',
        views: {
          'tab-about': {
            templateUrl: 'templates/tab-about.html',
            controller: 'AboutCtrl'
          }
        }
      })
      .state('tab.settings', {
        url: '/settings',
        views: {
          'tab-settings': {
            templateUrl: 'templates/tab-settings.html',
            controller: 'SettingsCtrl'
          }
        }
      })
      .state('tab.search', {
        url: '/search',
        views: {
          'tab-search': {
            templateUrl: 'templates/tab-search.html',
            controller: 'SearchCtrl'
          }
        }
      })
      .state('tab.search-result-list', {
        cache: false,
        url: '/search/result',
        views: {
          'tab-search': {
            templateUrl: 'templates/search-result-list.html',
            controller: 'SearchResultListCtrl'
          }
        }
      })
      .state('tab.search-result-detail', {
        cache: false,
        url: '/search/result/:resultId',
        views: {
          'tab-search': {
            templateUrl: 'templates/search-result-detail.html',
            controller: 'SearchResultDetailCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/tab/home');
  });
