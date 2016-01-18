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
          searchCriteria.skip = 0;
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
              deferred.resolve(
                {
                  specialization: what.specialization,
                  classification: what.classification,
                  address: where.address,
                  distance: where.distance
                }
              );
            });
          });

          return deferred.promise;
        }

        function createTextRepresentationWhere(criteria) {
          var deferred = $q.defer();
          var where = {
            address: '',
            distance: ''
          };

          if (criteria.distanceUrl != '') {
            var distance = criteria.distanceUrl.split('=')[1];
            where.distance = distance + ' km';
          }

          if (criteria.locationUrl != '') {
            CordovaUtilityFactory.reverseGeoCode(criteria.location.lat, criteria.location.long).then(function (address) {
              where.address = address;
              deferred.resolve(where);
            });
          }
          else {
            if (criteria.cityUrl != '') where.address = criteria.cityUrl.split('+').join(' ') + ', ';
            where.address += criteria.countryUrl.split('+').join(' ');
            deferred.resolve(where);
          }

          return deferred.promise;
        }

        function createTextRepresentationWhat(criteria) {
          var deferred = $q.defer();
          var what = {
            specialization: '',
            classification: ''
          };

          if (criteria.specializationUrl != '') {
            what.specialization = criteria.specializationUrl.split('+').join(' ');
          }
          if (criteria.classificationUrl != '') {
            HealthCareFactory.getClassification(criteria.classificationUrl).then(function (classification) {
              what.classification = classification.type;
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
