(function () {
    'use strict';

    angular.module('mediHooApp.controllers')
        .controller('TranslateCtrl', ['$scope', '$translate', '$rootScope',
            function ($scope, $translate, $rootScope) {
                $scope.changeLang = function (key) {
                    $translate.use(key);
                };
                $scope.fbUse = function (key) {
                    console.log('fbUse set to ' + key);
                    $translate.useFallbackLanguage(key);
                    $translate.use($translate.use());
                };
                $scope.changeStack = function (parm) {
                    $translate.preferredLanguage('en');
                    $translate.fallbackLanguage(parm);
                };
                $rootScope.$on('$translateChangeSuccess', function () {
                    $scope.currentStack = $translate.fallbackLanguage();
                    $scope.currentPref = $translate.preferredLanguage();
                    $scope.currentLang = $translate.use();
                });
            }]);
})();
