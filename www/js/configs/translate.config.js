(function () {
  'use strict';

  angular.module('mediHooApp.configs')
    .config(['$translateProvider',
      function ($translateProvider) {
        $translateProvider
          .useStaticFilesLoader({
            prefix: 'languages/',
            suffix: '.json'
          })
          .preferredLanguage('en')
          .useLocalStorage()
          .useSanitizeValueStrategy('escape');
      }]);
})();
