(function () {

    'use strict';

    angular
        .module('app.services')
        .service('PrincipalService', PrincipalService);

    PrincipalService.$inject = ['$http', '$rootScope'];

    /* @ngInject */
    function PrincipalService ($http, $rootScope) {

        var service = {};

        service.listarNumeros = function() {
            return $http.get('/principal/estatistica');
        };

        service.consultarUsuario = function(usuarioId) {
            return $http.get('/principal/estatistica/usuario/' + usuarioId);
        };

        return service;

    }

})();