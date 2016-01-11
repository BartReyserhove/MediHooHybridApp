/**
 * Created by oliviercappelle on 08/01/16.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('FavouritesCtrl', ['$scope', '$state', 'FavouritesFactory',
      function ($scope, $state, FavouritesFactory) {
        this._init = function () {
          FavouritesFactory.getAll().then(function(favourites) {
            $scope.favourites = favourites;
          });
        };

        this._init();

        $scope.navigateToDetails = function(id) {
          $state.go('tab.search-result-detail', {resultId: id});
        }
      }]);
})();
