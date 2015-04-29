(function() {

    'use strict';

    angular
        .module('app.admin')
        .controller('AdminPainelAlterarTutorialController', AdminPainelAlterarTutorialController);

    AdminPainelAlterarTutorialController.$inject = ['$rootScope', '$scope', '$modalInstance', 'TutorialService', 'CategoriaService', 'dialog', 'tutorialId', 'Constants'];

    /* @ngInject */
    function AdminPainelAlterarTutorialController($rootScope, $scope, $modalInstance, TutorialService, CategoriaService, dialog, tutorialId, Constants) {

        if(!$rootScope.autenticado) {
            dialog({
                mensagem: "É necessário estar autenticado para acessar a página alteração de tutorial."
            });
            $location.path('/autenticacao');
        }

        $scope.categorias = [];
        $scope.subcategorias = [];

        var consultarTutorial = function() {
            TutorialService.consultarTutorial(tutorialId).success(function(resposta){
                if(resposta && resposta.status == "n") {
                    dialog({
                        mensagem: resposta.mensagem
                    });
                } else {
                    $scope.tutorial = resposta.dados;
                    $scope.tutorial.categoria = $scope.tutorial.categoria._id;
                    $scope.alterarSubcategoria($scope.tutorial.categoria);
                    $scope.tutorial.subcategoria = $scope.tutorial.subcategoria._id;
                }
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        var listarCategorias = function() {
            CategoriaService.listarCategoriasSub().success(function(resposta){
                if(resposta && resposta.status == "n") {
                    dialog({
                        mensagem: resposta.mensagem
                    });
                } else {
                    $scope.categorias = resposta.dados;
                    consultarTutorial();
                }
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        $scope.alterarSubcategoria = function(categoria) {
            var achou = false;
            $scope.categorias.forEach(function(_categoria){
                if(_categoria._id == categoria) {
                    $scope.subcategorias = _categoria.subcategorias;
                    achou = true;
                }
            });
            if(!achou) {
                $scope.subcategorias = [];
                $scope.tutorial.subcategoria = undefined;
            }
        };

        $scope.alterar = function(tutorial) {
            tutorial.id = tutorialId;
            TutorialService.alterarTutorial(tutorial).success(function(resposta){
                dialog({
                    mensagem: resposta.mensagem
                });
                $modalInstance.close(true);
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        $scope.sair = function() {
            $modalInstance.close();
        };

        listarCategorias();

    }

})();
