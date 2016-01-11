/**
 * Created by oliviercappelle on 05/01/16.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.configs')
    .config(['$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {
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
          .state('tab.secundary', {
            url: '/home/secundary',
            views: {
              'tab-home': {
                templateUrl: 'templates/tab-home-secundary.html',
                controller: 'FavouritesCtrl'
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
          .state('tab.about', {
            url: '/about',
            views: {
              'tab-settings': {
                templateUrl: 'templates/tab-about.html',
                controller: 'AboutCtrl'
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

        $urlRouterProvider.otherwise('/tab/search');
      }]);
})();
