(function () {

    'use strict';

    angular
        .module('app.services')
        .service('RankingService', RankingService);

    RankingService.$inject = ['$http', '$rootScope'];

    /* @ngInject */
    function RankingService ($http, $rootScope) {

        var service = {};

        service.listarTutoriaisEstrelas = function() {
            return $http.get('/ranking/tutoriais/melhores');
        };

        service.listarTutoriaisMediaEstrelas = function() {
            return $http.get('/ranking/tutoriais/estrelas/media');
        };

        service.listarUsuariosEstrelas = function() {
            return $http.get('/ranking/usuarios/melhores');
        };

        service.listarUsuariosMediaEstrelas = function() {
            return $http.get('/ranking/usuarios/estrelas/media');
        };

        return service;

    }

})();