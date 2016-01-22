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
        var isSpecifiedInSearch = {
          classification: false,
          specialization: false
        };

        function getCurrentSearchOptions() {
          return currentSearchOptions;
        }

        function changeCurrentSearchOptions(newOptions) {
          var deferred = $q.defer();

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
          var url = ConfigFactory.mediHooApi + '/provider/details?provider=' + id;

          var callbacks = {
            success: function (res) {
              console.log('details:');
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

        function getProviderRatings(id) {
          var deferred = $q.defer();
          var url = ConfigFactory.mediHooApi + '/provider/ratings?provider=' + id;

          var callbacks = {
            success: function (res) {
              console.log('ratings:');
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

        function searchCountry(searchValue) {
          var deferred = $q.defer();
          var url = ConfigFactory.mediHooApi + '/location/countries/?query=' + searchValue;

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

        function searchCity(countryId, searchValue) {
          var deferred = $q.defer();
          var url = ConfigFactory.mediHooApi + '/location/cities/?query=' + searchValue +
            '&country=' + countryId;

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
            + '&take=' + ConfigFactory.takeItems;

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
              //deferred.resolve({error: false});
              return {error: false};
            },
            error: function (err) {
              console.log('unsuccessfull search');
              //deferred.resolve({error: true});
              return {error: true};
            }
          };

          console.log('search country: ');
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
          var deferred = $q.defer();

          var classifications = [{
            "type": "Hospital",
            "icon": "/content/images/searchicons/icon_hospitals.png",
            "code": "HOSP",
            "typeDescription": "Hospitals",
            "isContainer": false
          }, {
            "type": "Dental Providers",
            "icon": "/content/images/searchicons/icon_dental_providers.png",
            "code": "DENP",
            "typeDescription": "Dental Providers",
            "isContainer": false
          }, {
            "type": "Pharmacy Service Providers",
            "icon": "/content/images/searchicons/icon_pharmacies.png",
            "code": "PHAS",
            "typeDescription": "Pharmacy Service Providers",
            "isContainer": false
          }, {
            "type": "Ambulances",
            "icon": "/content/images/searchicons/icon_ambulances.png",
            "code": "341600000X",
            "typeDescription": "Medical transport: Air, ground \u0026 water",
            "isContainer": false
          }, {
            "type": "Opticians",
            "icon": "/content/images/searchicons/icon_opticians.png",
            "code": "EYEV",
            "typeDescription": "Opticians",
            "isContainer": false
          }, {
            "type": "Physicians",
            "icon": "/content/images/searchicons/icon_physicians.png",
            "code": "PHYS",
            "typeDescription": "Physicians",
            "isContainer": false
          }, {
            "type": "Nurses",
            "icon": "/content/images/searchicons/icon_nurses.png",
            "code": "NSPR",
            "typeDescription": "Nurses",
            "isContainer": false
          }, {
            "type": "Psychologists",
            "icon": "/content/images/searchicons/icon_psychologists.png",
            "code": "BHSS",
            "typeDescription": "Psychologists",
            "isContainer": false
          }, {
            "type": "Dietitians",
            "icon": "/content/images/searchicons/icon_dietitians.png",
            "code": "DNSP",
            "typeDescription": "Dietitians",
            "isContainer": false
          }, {
            "type": "Chiropractors",
            "icon": "/content/images/searchicons/icon_chiropractors.png",
            "code": "CPRO",
            "typeDescription": "Chiropractors",
            "isContainer": false
          }, {
            "type": "Acupuncturists",
            "icon": "/content/images/searchicons/icon_accupunctarists.png",
            "code": "OSPR",
            "typeDescription": null,
            "isContainer": false
          }, {
            "type": "Physical Therapists",
            "icon": "/content/images/searchicons/icon_physical_therapists.png",
            "code": "RDRR",
            "typeDescription": null,
            "isContainer": false
          }, {
            "type": "Laboratories",
            "icon": "/content/images/searchicons/icon_laboratories.png",
            "code": "291U00000X",
            "typeDescription": null,
            "isContainer": false
          }, {
            "type": "Other Health Care Providers",
            "icon": "/content/images/searchicons/icon_physicians.png",
            "code": "OMP",
            "typeDescription": "Other Health Care Providers (organisations i.e. clinics \u0026 individuals) - Physician Assistants, technologists, etc.",
            "isContainer": false
          }, {
            "type": "Other Service Providers",
            "icon": "/content/images/searchicons/icon_others.png",
            "code": "OSP",
            "typeDescription": "Other Service Providers - Blood Banks, Burn Centers, Dialysis Centers, Day Care Centers, Nursing/Custodial Care/Residential treatment facilities, Agencies, etc.",
            "isContainer": false
          }];

          deferred.resolve(classifications);

          return deferred.promise;
        }

        function getClassification(code) {
          var deferred = $q.defer();

          getClassifications().then(function (data) {
            var resultList = $filter('filter')(data, {code: code});
            deferred.resolve(resultList[0]);
          });

          return deferred.promise;
        }

        function searchSpecializationByClassification(classificationCode, searchValue) {
          var deferred = $q.defer();
          var url = ConfigFactory.mediHooApi + '/taxonomy/specializations/' + classificationCode + '/' + searchValue;
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
          var value = '';

          ConfigFactory.languages.forEach(function (el) {
            if (el.key === key) value = el.value;
          });
          var url = ConfigFactory.mediHooUrl + '/en-US/Accounts/changeLanguage/' + value;

          $http.get(url).then(function (res) {
            deferred.resolve();
          });

          return deferred.promise;
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
          getClassification: getClassification,
          searchSpecializationByClassification: searchSpecializationByClassification,
          isSpecifiedInSearchCriteria: isSpecifiedInSearchCriteria,
          changeApiLanguage: changeApiLanguage
        }
      }]);
})();
