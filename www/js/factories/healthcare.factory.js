/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.factories')
    .factory('HealthCareFactory', ['$q', '$http', '$filter', 'ConfigFactory',
      function ($q, $http, $filter, ConfigFactory) {
        var currentResultSet = [];
        var resultsAreAlternatives = false;
        var currentSearchOptions = null;
        var isSpecifiedInSearch = {
          classification: false,
          specialization: false
        };
        var classifications = [];

        function getCurrentSearchOptions() {
          return currentSearchOptions;
        }

        function changeCurrentSearchOptions(newOptions) {
          var deferred = $q.defer();

          //reset resultsAreAlternatives
          resultsAreAlternatives = false;

          if (newOptions.country != null && newOptions.country != undefined && newOptions.country != ''
            && newOptions.country.Name != undefined) {
            newOptions.countryUrl = newOptions.country.Name.split(' ').join('+');
          }
          else {
            newOptions.countryUrl = '';
          }

          if (newOptions.city != null && newOptions.city != undefined && newOptions.city != ''
            && newOptions.city.Name != undefined) {
            newOptions.cityUrl = newOptions.city.Name.split(' ').join('+');
            newOptions.distanceUrl = '&distance=' + newOptions.distance;
          }
          else {
            newOptions.cityUrl = '';
          }

          if (newOptions.classification == null
            || newOptions.classification == ''
            || newOptions.classification == undefined) {
            newOptions.classificationUrl = '';
            isSpecifiedInSearch.classification = false;
          }
          else {
            newOptions.classificationUrl = newOptions.classification; //is the code of the classification
            isSpecifiedInSearch.classification = true;
          }

          if (newOptions.specialization != null && newOptions.specialization != undefined
            && newOptions.specialization != '' && newOptions.specialization.ParentSpecializationName != undefined) {
            if (newOptions.specialization.SpecializationName == null) {
              newOptions.specializationUrl = newOptions.specialization.ParentSpecializationName.split(' ').join('+');
            }
            else {
              newOptions.specializationUrl = newOptions.specialization.SpecializationName.split(' ').join('+');
            }
            isSpecifiedInSearch.specialization = true;
          }
          else {
            newOptions.specializationUrl = '';
            isSpecifiedInSearch.specialization = false;
          }

          if (newOptions.location != null) {
            newOptions.locationUrl =
              '&location%5Blat%5D=' + newOptions.location.lat
              + '&location%5Blng%5D=' + newOptions.location.long;
            newOptions.distanceUrl = '&distance=' + newOptions.distance;
          }
          else {
            newOptions.locationUrl = '';
          }

          //because if city is defined, locationUrl contains the distance
          if (newOptions.distanceUrl == undefined) {
            newOptions.distanceUrl = '';
          }

          currentSearchOptions = newOptions;
          currentResultSet = [];

          deferred.resolve();

          return deferred.promise;
        }

        function getCurrentResultSet() {
          return currentResultSet;
        }

        //TODO: change name to provider? to be more clear
        function getResultWithId(id) {
          var deferred = $q.defer();

          getProviderDetails(id).then(function (detailsResponse) {
            getProviderRatings(id).then(function (ratingsResponse) {
              if (ratingsResponse.error) detailsResponse.error = ratingsResponse.error;
              detailsResponse.data.ratings = ratingsResponse.data;
              deferred.resolve(detailsResponse);
            });
          });

          return deferred.promise;
        }

        function getProviderDetails(id) {
          var deferred = $q.defer();
          var url = ConfigFactory.mediHooApi + '/provider/details?provider=' + id + ConfigFactory.mediHooApiConsumer;
          console.log(url);
          var callbacks = {
            success: function (res) {
              deferred.resolve({data: res.data, error: false});
            },
            error: function (err) {
              deferred.resolve({error: true});
            }
          };

          $http.get(url)
            .then(callbacks.success, callbacks.error);

          return deferred.promise;
        }

        function getProviderRatings(id) {
          var deferred = $q.defer();
          var url = ConfigFactory.mediHooApi + '/provider/ratings?provider=' + id + ConfigFactory.mediHooApiConsumer;
          console.log(url);
          var callbacks = {
            success: function (res) {
              deferred.resolve({data: res.data, error: false});
            },
            error: function (err) {
              deferred.resolve({error: true});
            }
          };

          $http.get(url)
            .then(callbacks.success, callbacks.error);

          return deferred.promise;
        }

        function searchCountry(searchValue) {
          var deferred = $q.defer();
          var url = ConfigFactory.mediHooApi + '/location/countries/?query=' + searchValue + ConfigFactory.mediHooApiConsumer;
          console.log(url);
          var callbacks = {
            success: function (res) {
              deferred.resolve({data: res.data, error: false});
            },
            error: function (err) {
              deferred.resolve({error: true});
            }
          };

          $http.get(url)
            .then(callbacks.success, callbacks.error);

          return deferred.promise;
        }

        function searchCity(countryId, searchValue) {
          var deferred = $q.defer();
          var url = ConfigFactory.mediHooApi + '/location/cities/?query=' + searchValue +
            '&country=' + countryId + ConfigFactory.mediHooApiConsumer;
          console.log(url);
          var callbacks = {
            success: function (res) {
              deferred.resolve({data: res.data, error: false});
            },
            error: function (err) {
              deferred.resolve({error: true});
            }
          };

          $http.get(url)
            .then(callbacks.success, callbacks.error);

          return deferred.promise;
        }

        function searchResultsWithGivenOptions() {
          //var deferred = $q.defer(); //TODO: add a boolean you pass through to be able to detect they are alternative results
          var url = ConfigFactory.mediHooApi + '/provider/search' +
            '?country=' + currentSearchOptions.countryUrl
            + '&city=' + currentSearchOptions.cityUrl
            + '&classification=' + currentSearchOptions.classificationUrl
            + '&specializations=' + currentSearchOptions.specializationUrl
            + currentSearchOptions.locationUrl
            + currentSearchOptions.distanceUrl
            + '&skip=' + checkIfUndefinedAndReturnValue(currentSearchOptions.skip)
            + '&take=' + ConfigFactory.takeItems
            + ConfigFactory.mediHooApiConsumer;

          var callbacks = {
            success: function (res) {
              console.log('successfull search');
              console.log(res);
              if (res.data.TotalCount == 0) {
                console.log('totalcount is 0');
                if (currentSearchOptions.specializationUrl != '') {
                  currentSearchOptions.specializationUrl = '';
                }
                else if (currentSearchOptions.classificationUrl != '') {
                  currentSearchOptions.classificationUrl = '';
                }
                else if (currentSearchOptions.distanceUrl != '') {
                  currentSearchOptions.distanceUrl = '';
                }
                else if (currentSearchOptions.cityUrl != '') {
                  currentSearchOptions.cityUrl = '';
                }

                resultsAreAlternatives = true;

                return searchResultsWithGivenOptions();
              }
              else {
                res.data.Documents.forEach(function (obj) {
                  if (obj.Data.ProfilePictureUrl == null) {
                    if (obj.Data.Types[1] == 'Organisation') {
                      obj.Data.ProfilePictureUrl = './img/organisation.png';
                    }
                    else {
                      obj.Data.ProfilePictureUrl = './img/individual.png';
                    }
                  }
                });
              }

              currentResultSet.push.apply(currentResultSet, res.data.Documents);
              currentSearchOptions.totalCount = res.data.TotalCount;

              return {error: false};
            },
            error: function (err) {
              console.log('unsuccessfull search');
              //deferred.resolve({error: true});
              return {error: true};
            }
          };

          console.log('search criteria: ');
          console.log(currentSearchOptions);

          console.log('url: ' + url);

          return $http.get(url)
            .then(callbacks.success, callbacks.error);

          //return deferred.promise;
        }

        function searchNextResultsWithGivenOptions() {
          currentSearchOptions.skip += ConfigFactory.takeItems;
          return searchResultsWithGivenOptions();
        }

        function checkIfUndefinedAndReturnValue(elem) {
          return elem != undefined ? elem : '';
        }

        function hasMoreResults() {
          return currentSearchOptions.skip < currentSearchOptions.totalCount;
        }

        function getClassifications() {
          return classifications;
        }

        function changeClassifications(key) {
          var deferred = $q.defer();
          var url = ConfigFactory.mediHooApi + '/taxonomy/promotedclassifications?language=' + key + ConfigFactory.mediHooApiConsumer;
          console.log(url);
          var callbacks = {
            success: function (res) {
              console.log('classifications:');
              console.log(res.data);
              classifications.splice(0, classifications.length);
              classifications.push.apply(classifications, res.data);
              //deferred.resolve({error: false, data: res.data});
              deferred.resolve();
            },
            error: function (err) {
              //deferred.resolve({error: true});
              deferred.resolve();
            }
          };

          $http.get(url)
            .then(callbacks.success, callbacks.error);

          return deferred.promise;
        }

        function getClassification(code) {
          var deferred = $q.defer();

          var resultList = $filter('filter')(classifications, {code: code});
          deferred.resolve(resultList[0]);

          return deferred.promise;
        }


        function searchSpecializationByClassification(classificationCode, searchValue) {
          var deferred = $q.defer();
          var url = ConfigFactory.mediHooApi + '/taxonomy/specializations/' + classificationCode + '/' + searchValue
          /*+ ConfigFactory.mediHooApiConsumer*/; //TODO: temporary
          console.log(url);

          var callbacks = {
            success: function (res) {
              console.log(res);
              deferred.resolve({data: res.data, error: false});
            },
            error: function (err) {
              deferred.resolve({error: true});
            }
          };

          $http.get(url)
            .then(callbacks.success, callbacks.error);

          return deferred.promise;
        }

        function isSpecifiedInSearchCriteria() {
          return isSpecifiedInSearch;
        }

        function changeApiLanguage(key) {
          var deferred = $q.defer();
          var value = '', keyIsFound = false;

          ConfigFactory.languages.forEach(function (el) {
            if (el.key === key) {
              value = el.value;
              keyIsFound = true;
            }
          });
          var url = ConfigFactory.mediHooUrl + '/en-US/Accounts/changeLanguage/' + value /*+ ConfigFactory.mediHooApiConsumer*/; //TODO: temporary

          if (keyIsFound) {
            $http.get(url).then(function (res) {
              changeClassifications(key).then(function () {
                deferred.resolve();
              })
            });
          }
          else {
            deferred.resolve();
          }

          return deferred.promise;
        }

        function isResultsAreAlternatives() {
          return resultsAreAlternatives;
        }

        return {
          searchCountry: searchCountry,
          searchCity: searchCity,
          searchResultsWithGivenOptions: searchResultsWithGivenOptions,
          searchNextResultsWithGivenOptions: searchNextResultsWithGivenOptions,
          getCurrentResultSet: getCurrentResultSet,
          getResultWithId: getResultWithId,
          changeCurrentSearchOptions: changeCurrentSearchOptions,
          getCurrentSearchOptions: getCurrentSearchOptions,
          hasMoreResults: hasMoreResults,
          getClassifications: getClassifications,
          changeClassifications: changeClassifications,
          getClassification: getClassification,
          searchSpecializationByClassification: searchSpecializationByClassification,
          isSpecifiedInSearchCriteria: isSpecifiedInSearchCriteria,
          changeApiLanguage: changeApiLanguage,
          isResultsAreAlternatives: isResultsAreAlternatives
        }
      }]);
})();
