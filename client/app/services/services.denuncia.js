(function () {

    'use strict';

    angular
        .module('app.services')
        .service('DenunciaService', DenunciaService);

    DenunciaService.$inject = ['$http', '$rootScope'];

    /* @ngInject */
    function DenunciaService ($http, $rootScope) {

        var service = {};

        service.denunciarTutorial = function(motivo, tutorialId, denunciante) {
            return $http({
                method: 'POST',
                url: '/denuncia/cadastrar',
                data: {
                    denuncia: {
                        tutorial: tutorialId,
                        motivo: motivo,
                        denunciante: denunciante
                    }
                }
            });
        };

        service.excluirDenuncia = function(denunciaId) {
            return $http({
                method: 'POST',
                url: '/denuncia/excluir',
                data: {
                    denuncia: {
                        id: denunciaId
                    }
                }
            });
        };

        service.listarDenuncias = function() {
            return $http.get('/denuncia/listar');
        };

        return service;

    }

})();