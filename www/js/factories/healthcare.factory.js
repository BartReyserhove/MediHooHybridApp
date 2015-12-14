/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
    'use strict';

    angular.module('mediHooApp.factories')
      .factory('HealthCareFactory', ['$q', '$http', function($q, $http) {
        function search() {
          var callbacks = {
            success: function (res) {
              return { data: res.data, error: false };
            },
            error: function () {
              return { error: true };
            }
          };
          return $http.get('/data/example.json')
            .then(callbacks.success, callbacks.error);
        }

        return {
          search : search
        }
      }]);
})();
