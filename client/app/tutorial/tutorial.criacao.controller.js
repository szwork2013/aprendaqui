(function () {

    'use strict';

    angular
        .module('app.tutorial')
        .controller('TutorialCriacaoController', TutorialCriacaoController);

    TutorialCriacaoController.$inject = ['$scope', '$rootScope', '$location', 'TutorialService', 'CategoriaService', 'dialog', 'Constants'];

    /* @ngInject */
    function TutorialCriacaoController($scope, $rootScope, $location, TutorialService, CategoriaService, dialog, Constants) {

        $scope.tutorial = {};
        $scope.categorias = [];

        $scope.possuiPreRequisito = 'nao';
        $scope.tutorial.preRequisitos = [];
        $scope.possuiPosRequisito = 'nao';
        $scope.tutorial.posRequisitos = [];

        var listarCategorias = function() {
            CategoriaService.listarCategoriasSub().success(function(resposta){
                if(resposta && resposta.status == "n") {
                    dialog({
                        mensagem: resposta.mensagem
                    });
                } else {
                    $scope.categorias = resposta.dados;
                }
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        listarCategorias();

        $scope.cadastrar = function() {
            if($scope.possuiPreRequisito == 'sim' && $scope.tutorial.preRequisitos.length == 0) {
                dialog({
                    mensagem: 'Você marcou que existem pré-requisitos, por favor adicione pelo menos um.'
                });
                return;
            }
           if($scope.possuiPosRequisito == 'sim' && $scope.tutorial.posRequisitos.length == 0) {
                dialog({
                    mensagem: 'Você marcou que existem pós-requisitos, por favor adicione pelo menos um.'
                });
                return;
            }
            if($scope.tutorial.texto.length >= 10 && $scope.tutorial.texto.length <= 100000) {
                TutorialService.cadastrarTutorial($scope.tutorial).success(function(resposta){
                    dialog({
                        mensagem: resposta.mensagem
                    });
                    $location.path('/tutorial/visualizacao/' + resposta.dados._id);
                }).error(function(resposta){
                    dialog({
                        mensagem: Constants.errorMsg
                    });
                });
            } else {
                dialog({
                    mensagem: 'O texto do tutorial é obrigatório e deve conter 10 a 100000 caracteres.'
                });
            }
        };

        $scope.alterarPossuiPreRequisito = function() {
            if($scope.possuiPreRequisito == 'nao' && $scope.tutorial.preRequisitos.length > 0) {
                $scope.tutorial.preRequisitos = [];
            }
        };

        $scope.adicionarPreRequisito = function() {
            if($scope.tutorial.preRequisitos.indexOf($scope.preRequisito) === -1) {
                $scope.tutorial.preRequisitos.push($scope.preRequisito);
                $scope.preRequisito = '';
            } else {
                dialog({
                    mensagem: 'Já existe um pré-requisito com este nome.'
                });
            }
        };

        $scope.removerPreRequisito = function(indice) {
            $scope.tutorial.preRequisitos.splice(indice, 1);
        };

        $scope.alterarPossuiPosRequisito = function() {
            if($scope.possuiPosRequisito == 'nao' && $scope.tutorial.posRequisitos.length > 0) {
                $scope.tutorial.posRequisitos = [];
            }
        };

        $scope.adicionarPosRequisito = function() {
            if($scope.tutorial.posRequisitos.indexOf($scope.posRequisito) === -1) {
                $scope.tutorial.posRequisitos.push($scope.posRequisito);
                $scope.posRequisito = '';
            } else {
                dialog({
                    mensagem: 'Já existe um pós-requisito com este nome.'
                });
            }
        };

        $scope.removerPosRequisito = function(indice) {
            $scope.tutorial.posRequisitos.splice(indice, 1);
        };

    }

})();