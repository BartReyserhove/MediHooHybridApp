/**
 * Created by oliviercappelle on 14/12/15.
 */
(function () {
  'use strict';

  angular.module('mediHooApp.controllers')
    .controller('SearchResultListCtrl', ['$scope', 'HealthCareFactory',
      function ($scope, HealthCareFactory) {
        this._init = function () {
          HealthCareFactory.search().then(function (res) {
            if(!res.error) {
              console.log(res);
              $scope.results = res.data;
            }
          });
        };

        this._init();

      }

    ]);
})
();
