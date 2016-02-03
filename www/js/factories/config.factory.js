/**
 * Created by oliviercappelle on 21/12/15.
 */
(function () {
    'use strict';

    angular.module('mediHooApp.factories')
      .factory('ConfigFactory', function() {
          return {
            mediHooEmail: "info@Medihoo.com",
            mediHooUrl: 'http://www.medihoo.com',
            mediHooApi: 'https://www.medihoo.com/api',
            mediHooApiConsumer: "&apiconsumer=fa17935f-05c5-4570-9e28-dc878792f501",
            takeItems: 10,
            languages: [
              {key:'en', value:'en-US'},
              {key:'nl', value:'nl-NL'},
              {key:'de', value:'de-DE'},
              {key:'es', value:'es-ES'},
              {key:'fr', value:'fr-FR'}
            ]
          }
      });
})();
