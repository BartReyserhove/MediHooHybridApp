/**
 * Created by oliviercappelle on 07/01/16.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.factories')
    .factory('SearchHistoryFactory', ['localStorageService', function (localStorageService) {
      var cookieName = 'searchHistory';
      var maxCache = 10;
      var searchHistoryList = [];

      function addSearchCriteriaToHistory(searchCriteria) {
        var searchHistory = localStorageService.get(cookieName);
        if (searchHistory != undefined && searchHistory.list != undefined && searchHistory.list.length > 0) {
          console.log('it exists');
          if (searchHistoryList.length == 0) {
            searchHistoryList = searchHistory.list;
          }

          if (!containsObject(searchHistory.list, searchCriteria)) {
            if (searchHistory.list.length == maxCache) {
              searchHistory.list.pop();
              searchHistoryList.pop();
            }
            searchHistory.list.push(searchCriteria);
            searchHistoryList.push(searchCriteria);
            localStorageService.set(cookieName, searchHistory);
          }
        }
        else {
          console.log('searchhistory is undefined');
          localStorageService.set(cookieName, {list: [searchCriteria]});
          searchHistoryList.push(searchCriteria);
        }
      }

      function getSearchHistory() {
        if (searchHistoryList.length == 0) {
          var searchHistory = localStorageService.get(cookieName);

          if (searchHistory == undefined || searchHistory.list == undefined) {
            console.log('searchhist is undef');
          }
          else {
            searchHistoryList = searchHistory.list;
          }
        }

        return searchHistoryList;
      }

      function containsObject(list, obj) {
        angular.forEach(list, function (el) {
          if (el.classificationUrl === obj.classificationUrl && el.specializationUrl === obj.specializationUrl
            && el.countryUrl === obj.countryUrl && el.cityUrl === obj.cityUrl && el.locationUrl === obj.locationUrl) {
            return true;
          }
        });
        return false;
      }

      return {
        addSearchCriteriaToHistory: addSearchCriteriaToHistory,
        getSearchHistory: getSearchHistory
      }
    }]);
})();
