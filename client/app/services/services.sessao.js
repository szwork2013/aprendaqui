(function () {

    'use strict';

    angular
        .module('app.services')
        .service('SessaoService', SessaoService);

    SessaoService.$inject = ['$http', '$rootScope', '$location', 'dialog'];

    /* @ngInject */
    function SessaoService ($http, $rootScope, $location, dialog) {

        var service = {};

        service.verificarAutenticacao = function() {
            $http.get('/usuario/autenticado').success(function(resposta){
                if(resposta.autenticado) {
                    $rootScope.autenticado = true;
                    $rootScope.usuarioLogado = resposta.usuario;
                } else {
                    $rootScope.autenticado = false;
                    $rootScope.usuarioLogado = undefined;
                }
            }).error(function(){
                $rootScope.autenticado = false;
                $rootScope.usuarioLogado = undefined;
            });
        };

        return service;

    }

})();