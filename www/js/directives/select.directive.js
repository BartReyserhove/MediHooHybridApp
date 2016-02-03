/**
 * Created by oliviercappelle on 03/02/16.
 */
(function () {
    'use strict';

    angular.module('mediHooApp.directives')
      .directive('select', function($ionicScrollDelegate, $timeout) {
        return {
          restrict: 'E',
          link: function(scope, element, attrs) {
            element.bind('focus', function(e) {
              if (window.cordova && window.cordova.plugins.Keyboard) {
                // console.log("show bar (hide = false)");
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
              }
            });
            element.bind('blur', function(e) {
              if (window.cordova && window.cordova.plugins.Keyboard) {
                // console.log("hide bar (hide = true)");
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                $timeout(function () {
                  $ionicScrollDelegate.resize();
                  //$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
                }, 500);
              }
            });
          }
        };
      })
})();
