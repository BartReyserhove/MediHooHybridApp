/**
 * Created by oliviercappelle on 15/01/16.
 */
(function () {
    'use strict';

    angular.module('mediHooApp.factories')
      .factory('LandingPageFactory', ['$q', function($q) {

        var clients = {};
        var healthProviders = {};
        var partners = {};

        function getLandigPageData(type) {
          switch (type) {
            case 'healthProviders':
                  //something
                  break;
            case 'partners':
                  //something
                  break;
            default: //clients & patients

          }
        }

        return {
          getLandigPageData: getLandigPageData
        }
      }]);
})();
