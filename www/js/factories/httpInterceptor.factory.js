/**
 * Created by oliviercappelle on 13/01/16.
 */
(function () {
    'use strict';

    angular.module('mediHooApp.factories')
      .factory('HttpInterceptorFactory', ['$q', '$translate', function($q, $translate) {
        return {
          request: function (config) {
            config.headers = config.headers || {};

            config.headers['Cookie'] = 'lang-medihoo=' + $translate.use();

            return config || $q.when(config);
          },

          requestError: function (rejection) {
            return $q.reject(rejection);
          },

          response: function (response) {
            return response || $q.when(response);
          },

          responseError: function (rejection) {
            return $q.reject(rejection);
          }
        }
      }]);
})();
