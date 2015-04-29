(function () {

    'use strict';

    angular
        .module('app.tutorial')
        .controller('TutorialVisualizacaoController', TutorialVisualizacaoController);

    TutorialVisualizacaoController.$inject = ['$rootScope', '$scope', '$routeParams', '$location', '$route', '$modal', 'TutorialService', 'dialog', 'Constants'];

    /* @ngInject */
    function TutorialVisualizacaoController($rootScope, $scope, $routeParams, $location, $route, $modal, TutorialService, dialog, Constants) {

        var tutorialId = $routeParams.id;

        /* Classificação */
        $scope.classificacao = 0;
        $scope.max = 5;
        $scope.isReadonly = false;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

        $scope.classificar = function() {
            TutorialService.classificar($scope.classificacao, $scope.tutorial._id, $scope.tutorial.autor._id).success(function(resposta){
                dialog({
                    mensagem: resposta.mensagem
                });
                $route.reload();
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        var consultarTutorial = function() {
            TutorialService.consultarTutorial(tutorialId).success(function(resposta){
                if(resposta && resposta.status == "n") {
                    dialog({
                        mensagem: resposta.mensagem
                    });
                    $location.path('/');
                } else {
                    $scope.tutorial = resposta.dados;
                    $scope.tutorial.data = new Date($scope.tutorial.data).toLocaleDateString();
                    $scope.classificacao = resposta.dados.nota;
                }
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
                $location.path('/');
            });
        };

        var listarComentarios = function() {
            TutorialService.listarComentarios(tutorialId).success(function(resposta){
                if(resposta && resposta.status == "n") {
                    dialog({
                        mensagem: resposta.mensagem
                    });
                } else {
                    $scope.comentarios = resposta.dados;
                    $scope.comentarios = _.map($scope.comentarios, function(comentario){
                        comentario.horario = new Date(comentario.data).toLocaleTimeString();
                        comentario.data = new Date(comentario.data).toLocaleDateString();
                        return comentario;
                    });
                }
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        consultarTutorial();
        listarComentarios();

        $scope.comentar = function() {
            if($scope.comentario.length >= 5 && $scope.comentario.length <= 100) {
                TutorialService.comentar($scope.comentario, tutorialId).success(function(resposta){
                    dialog({
                        mensagem: resposta.mensagem
                    });
                    $route.reload();
                }).error(function(resposta){
                    dialog({
                        mensagem: Constants.errorMsg
                    });
                });
            } else {
                dialog({
                    mensagem: 'O comentário deve conter 5 a 400 caracteres.'
                });
            }
        };

        $scope.denunciar = function(tutorialId, tutorialTitulo) {
            var modalInstance = $modal.open({
                templateUrl: 'app/tutorial/tutorial.denuncia.html',
                controller: 'TutorialDenunciaController',
                size: 'md',
                resolve: {
                    tutorialId: function() {
                        return tutorialId;
                    },
                    tutorialTitulo: function() {
                        return tutorialTitulo;
                    }
                }
            });
        };

    }

})();