/**
 * Created by oliviercappelle on 07/01/16.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.factories')
    .factory('SearchHistoryFactory', ['$q', 'localStorageService', 'HealthCareFactory',
      function ($q, localStorageService, HealthCareFactory) {
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

              containsObject(searchHistory.list, searchCriteria).then(function(criteriaExists) {
                //if (!containsObject(searchHistory.list, searchCriteria)) {
                if(!criteriaExists) {
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
              && el.countryUrl === obj.countryUrl && el.cityUrl === obj.cityUrl && el.locationUrl === obj.locationUrl) {
              deferred.resolve(true);
            }
          });
          deferred.resolve(false);

          return deferred.promise;
        }

        function getSearchCriteriaTextRepresentation(criteria) {
          var deferred = $q.defer();

          var what = '';
          var where = '';
          var hasClassification = false;

          if (criteria.specializationUrl != '') {
            what += criteria.specializationUrl.split('+').join(' ') + ' in ';
          }
          if (criteria.classificationUrl != '') {
            hasClassification = true;
          }

          if (criteria.locationUrl != '') {
            if (hasClassification) where += ' based on ';
            where += 'current location';
          }
          else {
            if (hasClassification) where += ' for ';
            if (criteria.cityUrl != '') where += criteria.cityUrl + ', ';
            where += criteria.countryUrl;
          }

          if(criteria.distanceUrl != '') {
            var distance = criteria.distanceUrl.split('=')[1];
            where += 'in a range of ' + distance + 'km'
          }

          if(hasClassification) {
            console.log('get classifcation');
            HealthCareFactory.getClassification(criteria.classificationUrl).then(function (classification) {
              console.log(classification);
              what += classification.type;
              deferred.resolve(what + where);
            });
          }
          else {
            deferred.resolve(where);
          }

          return deferred.promise;
        }

        return {
          addSearchCriteriaToHistory: addSearchCriteriaToHistory,
          getSearchHistory: getSearchHistory
        }
      }]);
})();
