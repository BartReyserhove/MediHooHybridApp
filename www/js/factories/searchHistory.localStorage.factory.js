/**
 * Created by oliviercappelle on 07/01/16.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.factories')
    .factory('SearchHistoryFactory', ['$q', 'localStorageService', 'HealthCareFactory', 'CordovaUtilityFactory',
      function ($q, localStorageService, HealthCareFactory, CordovaUtilityFactory) {
        var cookieName = 'searchHistory';
        var maxCache = 10;
        var searchHistoryList = [];

        function addSearchCriteriaToHistory(currentSearchCriteria) {
          //localStorageService.remove(cookieName);

          var searchCriteria = angular.copy(currentSearchCriteria);
          var searchHistory = localStorageService.get(cookieName);
          getSearchCriteriaTextRepresentation(searchCriteria).then(function (textRepresentation) {
            searchCriteria.textualRepresentation = textRepresentation;

            if (searchHistory != undefined && searchHistory.list != undefined && searchHistory.list.length > 0) {
              console.log('it exists');

              console.log('searchCriteria: ');
              console.log(searchCriteria);
              console.log('localservice list:');
              console.log(searchHistory.list);

              containsObject(searchHistory.list, searchCriteria).then(function (criteriaExists) {
                //if (!containsObject(searchHistory.list, searchCriteria)) {
                if (!criteriaExists) {
                  console.log('doesn\'t contain object');
                  if (searchHistory.list.length == maxCache) {
                    searchHistory.list.pop();
                    searchHistoryList.pop();
                  }
                  searchHistory.list.push(searchCriteria);
                  localStorageService.set(cookieName, searchHistory);

                  searchHistoryList.push(searchCriteria);
                }
              });
            }
            else {
              console.log('searchhistory is undefined');
              localStorageService.set(cookieName, {list: [searchCriteria]});
              searchHistoryList.push(searchCriteria);
            }
          });
        }

        function getSearchHistory() {
          if (searchHistoryList.length == 0) {
            var searchHistory = localStorageService.get(cookieName);

            if (searchHistory == undefined || searchHistory.list == undefined) {
              console.log('searchhist is undef');
            }
            else {
              console.log('history: ');
              console.log(searchHistory.list);
              angular.forEach(searchHistory.list, function (elem) {
                //elem.textualRepresentation = getSearchCriteriaTextRepresentation(elem);
                searchHistoryList.push(elem);
              });
            }
          }

          return searchHistoryList;
        }

        function containsObject(list, obj) {
          /*list.every(function (el) {
           return (el.classificationUrl == obj.classificationUrl && el.specializationUrl == obj.specializationUrl
           && el.countryUrl == obj.countryUrl && el.cityUrl == obj.cityUrl && el.locationUrl == obj.locationUrl)
           });*/

          var deferred = $q.defer();

          angular.forEach(list, function (el) {
            if (el.classificationUrl === obj.classificationUrl && el.specializationUrl === obj.specializationUrl
              && el.countryUrl === obj.countryUrl && el.cityUrl === obj.cityUrl && el.locationUrl === obj.locationUrl
              && el.distanceUrl === obj.distanceUrl) {
              deferred.resolve(true);
            }
          });
          deferred.resolve(false);

          return deferred.promise;
        }

        function getSearchCriteriaTextRepresentation(criteria) {
          var deferred = $q.defer();

          createTextRepresentationWhat(criteria).then(function (what) {
            createTextRepresentationWhere(criteria).then(function (where) {
              deferred.resolve(what + where);
            });
          });

          return deferred.promise;
        }

        function createTextRepresentationWhere(criteria) {
          var deferred = $q.defer();
          var range = '';
          var place = '';

          if (criteria.distanceUrl != '') {
            var distance = criteria.distanceUrl.split('=')[1];
            range = ' in a range of ' + distance + 'km'
          }

          if (criteria.locationUrl != '') {
            CordovaUtilityFactory.reverseGeoCode(criteria.location.lat, criteria.location.long).then(function (address) {
              deferred.resolve(address + range);
            });
          }
          else {
            if (criteria.cityUrl != '') place += criteria.cityUrl.split('+').join(' ') + ', ';
            place += criteria.countryUrl.split('+').join(' ');
            deferred.resolve(place + range);
          }

          return deferred.promise;
        }

        function createTextRepresentationWhat(criteria) {
          var deferred = $q.defer();
          var what = '';

          if (criteria.specializationUrl != '') {
            what += criteria.specializationUrl.split('+').join(' ') + ' in ';
          }
          if (criteria.classificationUrl != '') {
            HealthCareFactory.getClassification(criteria.classificationUrl).then(function (classification) {
              what += classification.type + ' for ';
              deferred.resolve(what);
            });
          }
          else {
            deferred.resolve(what);
          }

          return deferred.promise;
        }

        function clearHistory() {
          searchHistoryList.splice(0, searchHistoryList.length);
          localStorageService.remove(cookieName);
        }

        function remove(index) {
          var searchHistory = localStorageService.get(cookieName);
          if (searchHistory != undefined && searchHistory.list != undefined && searchHistory.list.length > 0
            && index < searchHistory.list.length && index > -1) {

            searchHistory.list.splice(index, 1);
            favouriteList.splice(index, 1);
            localStorageService.set(cookieName, searchHistory);
          }
        }

        return {
          addSearchCriteriaToHistory: addSearchCriteriaToHistory,
          getSearchHistory: getSearchHistory,
          clearHistory: clearHistory,
          remove: remove
        }
      }]);
})();
