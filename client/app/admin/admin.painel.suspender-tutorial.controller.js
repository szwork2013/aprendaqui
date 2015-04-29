(function() {

    'use strict';

    angular
        .module('app.admin')
        .controller('AdminPainelSuspenderTutorialController', AdminPainelSuspenderTutorialController);

    AdminPainelSuspenderTutorialController.$inject = ['$rootScope', '$scope', '$modalInstance', 'TutorialService', 'dialog', 'tutorialId', 'Constants'];

    /* @ngInject */
    function AdminPainelSuspenderTutorialController($rootScope, $scope, $modalInstance, TutorialService, dialog, tutorialId, Constants) {

        if(!$rootScope.autenticado) {
            dialog({
                mensagem: "É necessário estar autenticado para acessar a suspensão de tutorial."
            });
            $location.path('/autenticacao');
        }

        $scope.suspender = function(motivo) {
            if(motivo.length >= 15 && motivo.length <= 400) {
                TutorialService.suspenderTutorial(tutorialId, motivo).success(function(resposta){
                    dialog({
                        mensagem: resposta.mensagem
                    });
                    $modalInstance.close(true);
                }).error(function(resposta){
                    dialog({
                        mensagem: Constants.errorMsg
                    });
                });
            } else {
                dialog({
                    mensagem: 'O motivo da suspensão deve conter 15 a 400 caracteres.'
                });
            }
        };

        $scope.fechar = function() {
            $modalInstance.close();
        };

    }

})();
