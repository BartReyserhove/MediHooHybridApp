/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
    'use strict';

    angular.module('mediHooApp.factories')
      .factory('HealthCareFactory', ['$q', '$http', '$filter', function($q, $http, $filter) {
        var currentResultSet = [];

        function getCurrentResultSet() {
          var deferred = $q.defer();

          //TODO: Don't populate currentResultSet
          if(currentResultSet.length == 0) {
            searchResultForCountryName("").then(function() {
              deferred.resolve(currentResultSet);
            });
          }
          deferred.resolve(currentResultSet);

          return deferred.promise;
        }

        function getResultWithId(id) {
          var deferred = $q.defer();

          var resultList = $filter('filter')(currentResultSet, { Data: { Id: id }});
          console.log('resultList:');
          console.log(resultList);
          deferred.resolve(resultList[0]);

          return deferred.promise;
        }

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

        function searchCountry(searchValue) {
          var deferred = $q.defer();

          var callbacks = {
            success: function(res) {
              var data = $filter('filter')(res.data, {Name:searchValue});
              console.log(data);
              deferred.resolve(data);
            },
            error: function(err) {
              deferred.reject('Can\'t find www.medihoo.com/api/location/countries/?query=' + searchValue);
            }
          };

          $http.get('data/countries.json')
            .then(callbacks.success, callbacks.error);

          return deferred.promise;
        }

        function searchResultForCountryName(countryName) {
          var deferred = $q.defer();

          var callbacks = {
            success: function(res) {
              console.log(res);
              currentResultSet = res.data.Documents;
              deferred.resolve();
            },
            error: function(err) {
              deferred.reject('Can\'t find www.medihoo.com/api/location/countries/?query=' + searchValue);
            }
          };

          $http.get('data/resultsForBelgium.json')
            .then(callbacks.success, callbacks.error);

          return deferred.promise;
        }

        return {
          search : search,
          searchCountry: searchCountry,
          searchByCountry: searchResultForCountryName,
          getCurrentResultSet: getCurrentResultSet,
          getResultWithId: getResultWithId
        }
      }]);
})();
