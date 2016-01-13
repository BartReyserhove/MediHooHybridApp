/**
 * Created by oliviercappelle on 13/01/16.
 */
(function () {
    'use strict';

    angular.module('mediHooApp.configs')
      .config(['$httpProvider',
        function($httpProvider) {
            $httpProvider.interceptors.push('HttpInterceptorFactory');
        }]);
})();
