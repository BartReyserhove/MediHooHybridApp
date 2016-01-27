/**
 * Created by oliviercappelle on 08/01/16.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.factories')
    .factory('FavouritesFactory', ['$q', '$filter', 'localStorageService',
      function ($q, $filter, localStorageService) {
        var cookieName = 'favourites';
        var favouriteList = [];

        function getAll() {
          var deferred = $q.defer();

          if (favouriteList.length == 0) {
            var favourites = localStorageService.get(cookieName);

            if (favourites == undefined || favourites.list == undefined) {
              console.log('favos is undef');
            }
            else {
              console.log('favourites: ');
              console.log(favourites.list);
              angular.forEach(favourites.list, function (elem) {
                favouriteList.push(elem);
              });
            }
          }

          deferred.resolve(favouriteList);

          return deferred.promise;
        }

        function add(provider) {

          var favourites = localStorageService.get(cookieName);
          if (provider.profilePicture == null) {
            if (provider.isIndividual) {
              provider.imageTile = './img/individual.png';
            }
            else {
              provider.imageTile = './img/organisation.png';
            }
          }
          else {
            provider.imageTile = provider.profilePicture;
          }

          if (favourites != undefined && favourites.list != undefined && favourites.list.length > 0) {
            console.log('add to favourite');
            favourites.list.push(provider);
            localStorageService.set(cookieName, favourites);

            favouriteList.push(provider);
          }
          else {
            console.log('create favo cookie');
            localStorageService.set(cookieName, {list: [provider]});
            favouriteList.push(provider);
          }
        }

        function remove(id) {
          var favourites = localStorageService.get(cookieName);
          if (favourites != undefined && favourites.list != undefined && favourites.list.length > 0) {
            console.log('remove a favo');
            angular.forEach(favourites.list, function (elem, iterator) {
              console.log('index: ' + iterator);
              console.log(elem);
              if (elem.id === id) {
                console.log('remove this one');
                favourites.list.splice(iterator, 1);
                favouriteList.splice(iterator, 1);
                localStorageService.set(cookieName, favourites);
              }
            });
          }
        }

        function isFavourite(id) {
          var deferred = $q.defer();

          getAll().then(function (favourites) {
            var resultList = $filter('filter')(favourites, {id: id});

            return deferred.resolve(resultList.length > 0);
          });

          return deferred.promise;
        }

        return {
          getAll: getAll,
          add: add,
          remove: remove,
          isFavourite: isFavourite
        }
      }]);
})();
