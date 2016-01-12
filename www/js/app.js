angular.module('mediHooApp',
  [
    'ionic',
    'ui.bootstrap',
    'ngCordova',
    'jett.ionic.content.banner',
    'LocalStorageModule',
    'ngCookies',
    'pascalprecht.translate',
    'mediHooApp.configs',
    'mediHooApp.controllers',
    'mediHooApp.factories'
  ])

  .run(['$ionicPlatform', '$cordovaGlobalization', '$translate',
    function ($ionicPlatform, $cordovaGlobalization, $translate) {
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

          //return {value: 'en-US'} for example
          $cordovaGlobalization.getPreferredLanguage().then(function (language) {
            var langKey = language.value.split('-')[0];
            $translate.preferredLanguage('en');
            $translate.fallbackLanguage('en');
            $translate.use(langKey);
          });
        }
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }
      });
    }]);
