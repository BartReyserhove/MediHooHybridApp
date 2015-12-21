/**
 * Created by oliviercappelle on 21/12/15.
 */
(function () {
    'use strict';

    angular.module('mediHooApp.factories')
      .factory('ConfigFactory', function() {
          return {
            mediHooApi: 'http://www.medihoo.com/api',
            takeItems: 10
          }
      });
})();
