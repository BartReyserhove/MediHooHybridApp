(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('TranslateCtrl', ['$scope', '$translate', 'HealthCareFactory',
      function ($scope, $translate, HealthCareFactory) {

        this._init = function () {
          $scope.language = $translate.use();
        };

        this._init();

        $scope.changeLang = function (key) {
          HealthCareFactory.changeApiLanguage(key).then(function() {
            $translate.use(key);
          });

        };

      }]);
})();
