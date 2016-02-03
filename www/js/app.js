angular.module('mediHooApp',
  [
    'ionic', 'ionic.service.core', 'ionic.service.analytics',
    'ui.bootstrap',
    'ngCordova',
    'jett.ionic.content.banner',
    'LocalStorageModule',
    'ngCookies',
    'pascalprecht.translate',
    'mediHooApp.configs',
    'mediHooApp.controllers',
    'mediHooApp.factories',
    'mediHooApp.directives'
  ])

  .run(['$ionicPlatform', '$ionicLoading', '$cordovaGlobalization', '$translate', 'HealthCareFactory', '$ionicAnalytics',
    function ($ionicPlatform, $ionicLoading, $cordovaGlobalization, $translate, HealthCareFactory, $ionicAnalytics) {
      $ionicAnalytics.register();

      // kick off the platform web client
      Ionic.io();

// this will give you a fresh user or the previously saved 'current user'
      var user = Ionic.User.current();

// if the user doesn't have an id, you'll need to give it one.
      if (!user.id) {
        user.id = Ionic.User.anonymousId();
        // user.id = 'your-custom-user-id';
      }

//persist the user
      user.save();

      $ionicPlatform.ready(function () {

        screen.unlockOrientation();

        if (window.cordova && window.cordova.plugins.Keyboard) {
          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
          // for form inputs)
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
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
            //HealthCareFactory.changeApiLanguage($translate.use());
            $ionicLoading.show({
              template: '<ion-spinner></ion-spinner>'
            });
            HealthCareFactory.changeApiLanguage(langKey).then(function() {
              $ionicLoading.hide();
            });
          });
        }
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }
      });
    }]);
