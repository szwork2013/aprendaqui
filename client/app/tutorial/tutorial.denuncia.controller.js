(function() {

    'use strict';

    angular
        .module('app.tutorial')
        .controller('TutorialDenunciaController', TutorialDenunciaController);

    TutorialDenunciaController.$inject = ['$rootScope', '$scope', '$modalInstance', 'dialog', 'tutorialId', 'tutorialTitulo', 'DenunciaService', 'Constants'];

    /* @ngInject */
    function TutorialDenunciaController($rootScope, $scope, $modalInstance, dialog, tutorialId, tutorialTitulo, DenunciaService, Constants) {

        $scope.tutorial = {
            id: tutorialId,
            titulo: tutorialTitulo
        };

        $scope.denunciar = function(motivo) {
            if(motivo.length >= 5 && motivo.length <= 400) {
                DenunciaService.denunciarTutorial(motivo, $scope.tutorial.id, $rootScope.usuarioLogado._id).success(function(resposta){
                    dialog({
                        mensagem: resposta.mensagem
                    });
                    $modalInstance.close();
                }).error(function(resposta){
                    dialog({
                        mensagem: Constants.errorMsg
                    });
                });
            } else {
                dialog({
                    mensagem: 'O motivo da denúncia deve conter 5 a 400 caracteres.'
                });
            }
        };

        $scope.cancelar = function() {
            $modalInstance.close();
        };

    }

})();
