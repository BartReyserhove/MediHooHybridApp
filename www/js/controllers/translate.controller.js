(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('TranslateCtrl', ['$scope', '$translate',
      function ($scope, $translate) {

        this._init = function () {
          $scope.language = $translate.use();
        };

        this._init();

        $scope.changeLang = function (key) {
          $translate.use(key);
        };

      }]);
})();
