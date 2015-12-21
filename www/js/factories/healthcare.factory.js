/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.factories')
    .factory('HealthCareFactory', ['$q', '$http', '$filter', 'ConfigFactory',
      function ($q, $http, $filter, ConfigFactory) {
        var currentResultSet = [];
        var currentSearchOptions = null;

        function changeCurrentSearchOptions(newOptions) {
          var deferred = $q.defer();

          currentSearchOptions = newOptions;
          currentResultSet = [];

          deferred.resolve();

          return deferred.promise;
        }

        function getCurrentResultSet() {
          //var deferred = $q.defer();

          //TODO: Don't populate currentResultSet
          /*if (currentResultSet.length == 0) {
           searchResultForCountryName("").then(function () {
           deferred.resolve(currentResultSet);
           });
           }*/
          //deferred.resolve(currentResultSet);

          return currentResultSet;
        }

        function getResultWithId(id) {
          var deferred = $q.defer();

          var resultList = $filter('filter')(currentResultSet, {Data: {Id: id}});
          console.log('resultList:');
          console.log(resultList);
          deferred.resolve(resultList[0]);

          return deferred.promise;
        }

        function searchCountry(searchValue) {
          var deferred = $q.defer();

          var callbacks = {
            success: function (res) {
              /*var data = $filter('filter')(res.data, {Name:searchValue});
               console.log(data);
               deferred.resolve(data);*/
              console.log(res);
              deferred.resolve(res.data);
            },
            error: function (err) {
              deferred.reject('Can\'t find www.medihoo.com/api/location/countries/?query=' + searchValue);
            }
          };

          //$http.get('data/countries.json')
          $http.get(ConfigFactory.mediHooApi + '/location/countries/?query=' + searchValue)
            .then(callbacks.success, callbacks.error);

          return deferred.promise;
        }

        //TODO: seach is only based on countryname
        function searchResultsForCountryName() {
          var deferred = $q.defer();

          var callbacks = {
            success: function (res) {
              console.log(res);
              currentResultSet.push.apply(currentResultSet, res.data.Documents);
              currentSearchOptions.totalCount = res.data.TotalCount;
              deferred.resolve();
            },
            error: function (err) {
              deferred.reject('Can\'t find www.medihoo.com/api/provider/search/');
            }
          };

          console.log('search country: ');
          console.log(currentSearchOptions);
          //$http.get('data/resultsForBelgium.json')
          $http.get(ConfigFactory.mediHooApi + '/provider/search' +
            '?country=' + currentSearchOptions.country.name
            + '&skip=' + checkIfUndefinedAndReturnValue(currentSearchOptions.skip)
            + '&take=' + ConfigFactory.takeItems)
            .then(callbacks.success, callbacks.error);

          return deferred.promise;
        }

        function searchNextResultsForCountryName() {
          currentSearchOptions.skip += ConfigFactory.takeItems;
          return searchResultsForCountryName();
        }

        function checkIfUndefinedAndReturnValue(elem) {
          return elem != undefined ? elem : '';
        }

        function hasMoreResults() {
          return currentSearchOptions.skip < currentSearchOptions.totalCount;
        }

        return {
          searchCountry: searchCountry,
          searchByCountry: searchResultsForCountryName,
          searchNextByCountry: searchNextResultsForCountryName,
          getCurrentResultSet: getCurrentResultSet,
          getResultWithId: getResultWithId,
          changeCurrentSearchOptions: changeCurrentSearchOptions,
          hasMoreResults: hasMoreResults
        }
      }]);
})();
