(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('TranslateCtrl', ['$scope', '$translate', '$http', '$q',
      function ($scope, $translate, $http, $q) {

        this._init = function () {
          $scope.language = $translate.use();
        };

        this._init();

        $scope.changeLang = function (key) {
          changeLangCookie(key).then(function() { //TODO: for testing only
            $translate.use(key);
          });

        };

        function changeLangCookie(key) {
          var deferred = $q.defer();
          var languages = [{key:'en',value:'en-US'},{key:'nl',value:'nl-NL'}];
          var value = '';
          languages.forEach(function(el) {
            if(el.key === key) value = el.value;
          });

          $http.get('http://www.medihoo.com/en-US/Accounts/changeLanguage/'+value).then(function(res) {
            deferred.resolve();
          });

          return deferred.promise;
        }

      }]);
})();
