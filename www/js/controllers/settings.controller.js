/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
    'use strict';

    angular.module('mediHooApp.controllers')
      .controller('SettingsCtrl', ['$scope', 'ConfigFactory', function($scope, ConfigFactory) {

        $scope.sendEmailToMediHoo = function() {
          $scope.sendEmail(ConfigFactory.mediHooEmail);
        };

      }]);
})();
