(function() {

    'use strict';

    angular
        .module('app.painel')
        .controller('PainelControleAtualizarTutorialController', PainelControleAtualizarTutorialController);

    PainelControleAtualizarTutorialController.$inject = ['$rootScope', '$scope', '$modalInstance', 'TutorialService', 'dialog', 'tutorialId', 'Constants'];

    /* @ngInject */
    function PainelControleAtualizarTutorialController($rootScope, $scope, $modalInstance, TutorialService, dialog, tutorialId, Constants) {

        if(!$rootScope.autenticado) {
            dialog({
                mensagem: "É necessário estar autenticado para acessar a atualização de tutorial."
            });
            $location.path('/autenticacao');
        }

        var consultarTutorial = function() {
            TutorialService.consultarTutorialTexto(tutorialId).success(function(resposta){
                if(resposta && resposta.status == "n") {
                    dialog({
                        mensagem: resposta.mensagem
                    });
                } else {
                    $scope.titulo = resposta.dados.titulo;
                    $scope.tutorial = {
                        texto: resposta.dados.texto
                    };
                }
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        $scope.atualizar = function(tutorial) {
            tutorial.id = tutorialId;
            TutorialService.atualizarTutorial(tutorial).success(function(resposta){
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

        $scope.fechar = function() {
            $modalInstance.close();
        };

        consultarTutorial();

    }

})();