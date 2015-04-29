(function () {

    'use strict';

    angular
        .module('app.services')
        .service('UsuarioService', UsuarioService);

    UsuarioService.$inject = ['$http', '$upload'];

    /* @ngInject */
    function UsuarioService ($http, $upload) {

        var service = {};

        service.autenticar = function(usuario) {
            return $http.post('/usuario/autenticar', usuario);
        };

        service.cadastrar = function(usuario, foto) {
            delete usuario.foto;
            return $upload.upload({
                url: '/usuario/cadastrar',
                data: usuario,
                file: foto[0]
            });
        };

        service.alterarSenha = function(senha) {
            return $http({
                method: 'POST',
                url: '/usuario/senha/alterar',
                data: {
                    senha: senha
                }
            });
        };

        service.recuperarSenha = function(email) {
            return $http({
                method: 'POST',
                url: '/email/recuperar/senha',
                data: {
                    email: email
                }
            });
        };

        service.alterarFoto = function(foto) {
            return $upload.upload({
                url: '/usuario/foto/alterar',
                file: foto[0]
            });
        };

        service.sair = function() {
            return $http.post('/usuario/sair', {});
        };

        return service;

    }

})();