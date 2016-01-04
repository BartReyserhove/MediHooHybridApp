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

          if (newOptions.country != null) {
            newOptions.countryUrl = newOptions.country.Name.split(' ').join('+');
          }
          else {
            newOptions.countryUrl = '';
          }

          if (newOptions.city != null) {
            newOptions.cityUrl = newOptions.city.Name.split(' ').join('+');
          }
          else {
            newOptions.cityUrl = '';
          }

          if (newOptions.classification == null
            || newOptions.classification == ''
            /*|| newOptions.classification.code == undefined*/) {
            newOptions.classificationUrl = '';
          }
          else {
            newOptions.classificationUrl = newOptions.classification; //is the code of the classification
          }

          if (newOptions.specialization != null) {
            if (newOptions.specialization.SpecializationName == null) {
              newOptions.specializationUrl = newOptions.specialization.ParentSpecializationName.split(' ').join('+');
            }
            else {
              newOptions.specializationUrl = newOptions.specialization.SpecializationName.split(' ').join('+');
            }
          }
          else {
            newOptions.specializationUrl = '';
          }

          if (newOptions.location != null) {
            newOptions.locationUrl =
              '&location%5Blat%5D=' + newOptions.location.lat
              + '&location%5Blng%5D=' + newOptions.location.long
              + '&distance=' + newOptions.distance;
          }
          else {
            newOptions.locationUrl = '';
          }

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

        function searchCity(countryId, searchValue) {
          var deferred = $q.defer();

          var url = ConfigFactory.mediHooApi + '/location/cities/?query=' + searchValue +
            '&country=' + countryId;

          console.log(url);

          var callbacks = {
            success: function (res) {
              /*var data = $filter('filter')(res.data, {Name:searchValue});
               console.log(data);
               deferred.resolve(data);*/
              console.log(res);
              deferred.resolve(res.data);
            },
            error: function (err) {
              deferred.reject('Can\'t find ' + url);
            }
          };

          //$http.get('data/countries.json')
          $http.get(url)
            .then(callbacks.success, callbacks.error);

          return deferred.promise;
        }

        //TODO: seach is only based on countryname
        function searchResultsForCountryName() {
          var deferred = $q.defer();

          var url = ConfigFactory.mediHooApi + '/provider/search' +
            '?country=' + currentSearchOptions.countryUrl
            + '&city=' + currentSearchOptions.cityUrl
            + '&classification=' + currentSearchOptions.classificationUrl
            + '&specializations=' + currentSearchOptions.specializationUrl
            + currentSearchOptions.locationUrl
            + '&skip=' + checkIfUndefinedAndReturnValue(currentSearchOptions.skip)
            + '&take=' + ConfigFactory.takeItems;

          var callbacks = {
            success: function (res) {
              console.log('successfull search');
              console.log(res);
              currentResultSet.push.apply(currentResultSet, res.data.Documents);
              currentSearchOptions.totalCount = res.data.TotalCount;
              deferred.resolve();
            },
            error: function (err) {
              console.log('unsuccessfull search');
              deferred.reject('Can\'t find ' + url);
            }
          };

          console.log('search country: ');
          console.log(currentSearchOptions);

          console.log('url: ' + url);

          $http.get(url)
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
            angular.forEach(data, function(item) {
              if(item.code === code) {
                deferred.resolve(item);
              }
            });
            deferred.resolve();
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
              deferred.resolve(res.data);
            },
            error: function (err) {
              deferred.reject('Can\'t find ' + url);
            }
          };

          $http.get(url)
            .then(callbacks.success, callbacks.error);

          return deferred.promise;
        }

        return {
          searchCountry: searchCountry,
          searchCity: searchCity,
          searchByCountry: searchResultsForCountryName,
          searchNextByCountry: searchNextResultsForCountryName,
          getCurrentResultSet: getCurrentResultSet,
          getResultWithId: getResultWithId,
          changeCurrentSearchOptions: changeCurrentSearchOptions,
          hasMoreResults: hasMoreResults,
          getClassifications: getClassifications,
          getClassification: getClassification,
          searchSpecializationByClassification: searchSpecializationByClassification
        }
      }]);
})();
