(function () {

    'use strict';

    angular
        .module('app.services')
        .service('TutorialService', TutorialService);

    TutorialService.$inject = ['$http', '$rootScope'];

    /* @ngInject */
    function TutorialService ($http, $rootScope) {

        var service = {};

        service.cadastrarTutorial = function(tutorial) {
            tutorial.autor = $rootScope.usuarioLogado._id;
            return $http({
                method: 'POST',
                url: '/tutorial/cadastrar',
                data: {
                    tutorial: tutorial
                }
            });
        };

        service.desativarTutorial = function(tutorialId) {
            return $http({
                method: 'POST',
                url: '/tutorial/desativar',
                data: {
                    tutorial: {
                        id: tutorialId
                    }
                }
            });
        };

        service.ativarTutorial = function(tutorialId) {
            return $http({
                method: 'POST',
                url: '/tutorial/ativar',
                data: {
                    tutorial: {
                        id: tutorialId
                    }
                }
            });
        };

        service.suspenderTutorial = function(tutorialId, motivo) {
            return $http({
                method: 'POST',
                url: '/tutorial/suspender',
                data: {
                    tutorial: {
                        id: tutorialId,
                        motivo: motivo
                    }
                }
            });
        };

        service.desuspenderTutorial = function(tutorialId) {
            return $http({
                method: 'POST',
                url: '/tutorial/desuspender',
                data: {
                    tutorial: {
                        id: tutorialId
                    }
                }
            });
        };

        service.atualizarTutorial = function(tutorial) {
            return $http({
                method: 'POST',
                url: '/tutorial/atualizar',
                data: {
                    tutorial: tutorial
                }
            });
        };

        service.alterarTutorial = function(tutorial) {
            return $http({
                method: 'POST',
                url: '/tutorial/alterar',
                data: {
                    tutorial: tutorial
                }
            });
        };

        service.listarTutoriais = function() {
            return $http.get('/tutorial/listar');
        };

        service.listarTutoriaisRecentes = function() {
            return $http.get('/tutorial/listar/recentes');
        };

        service.listarMeusTutoriais = function() {
            return $http.get('/tutorial/listar/autenticado');
        };

        service.listarTutoriaisCategoria = function(categoria) {
            return $http.get('/tutorial/listar/' + categoria);
        };

        service.listarTutoriaisSubcategoria = function(subcategoria) {
            return $http.get('/tutorial/listar/sub/' + subcategoria);
        };

        service.consultarTutorial = function(tutorialId) {
            var usuarioId;
            if($rootScope.usuarioLogado) {
                usuarioId = $rootScope.usuarioLogado._id;
            }
            return $http({
                method: 'POST',
                url: '/tutorial/consultar',
                data: {
                    tutorial: tutorialId,
                    usuario: usuarioId
                }
            });
        };

        service.consultarTutorialTexto = function(tutorialId) {
            var usuarioId;
            if($rootScope.usuarioLogado) {
                usuarioId = $rootScope.usuarioLogado._id;
            }
            return $http({
                method: 'POST',
                url: '/tutorial/consultar/texto',
                data: {
                    tutorial: tutorialId,
                    usuario: usuarioId
                }
            });
        };

        service.consultarTutoriaisFiltro = function(filtro) {
            return $http.get('/tutorial/consultar/' + filtro);
        };

        service.comentar = function(comentario, tutorial) {
            var autor = $rootScope.usuarioLogado._id;
            return $http({
                method: 'POST',
                url: '/comentario/cadastrar',
                data: {
                    comentario:{
                        texto: comentario,
                        tutorial: tutorial,
                        autor: autor
                    }
                }
            });
        };

        service.listarComentarios = function(tutorial) {
            return $http.get('/comentario/listar/' + tutorial);
        };

        service.classificar = function(nota, tutorial, autor) {
            return $http({
                method: 'POST',
                url: '/tutorial/classificar',
                data: {
                    classificacao:{
                        nota: nota,
                        tutorial: tutorial,
                        autor: autor
                    }
                }
            });
        };

        return service;

    }

})();