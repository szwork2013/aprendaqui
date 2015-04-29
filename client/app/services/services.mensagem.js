(function () {

    'use strict';

    angular
        .module('app.services')
        .service('MensagemService', MensagemService);

    MensagemService.$inject = ['$http', '$rootScope'];

    /* @ngInject */
    function MensagemService ($http, $rootScope) {

        var service = {};

        service.enviarMensagem = function(mensagem, leitor, autor) {
            return $http({
                method: 'POST',
                url: '/mensagem/enviar',
                data: {
                    mensagem: {
                        texto: mensagem,
                        leitor: leitor,
                        autor: autor
                    }
                }
            });
        };

        service.excluirMensagem = function(mensagemId) {
            return $http({
                method: 'POST',
                url: '/mensagem/excluir',
                data: {
                    mensagem: {
                        id: mensagemId
                    }
                }
            });
        };

        service.listarMensagens = function() {
            return $http.get('/mensagem/listar/');
        };

        return service;

    }

})();