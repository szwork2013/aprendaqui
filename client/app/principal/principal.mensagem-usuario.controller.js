(function() {

    'use strict';

    angular
        .module('app.principal')
        .controller('PrincipalMensagemUsuarioController', PrincipalMensagemUsuarioController);

    PrincipalMensagemUsuarioController.$inject = ['$rootScope', '$scope', '$modalInstance', 'dialog', 'usuarioId', 'usuarioNome', 'MensagemService', 'Constants'];

    /* @ngInject */
    function PrincipalMensagemUsuarioController($rootScope, $scope, $modalInstance, dialog, usuarioId, usuarioNome, MensagemService, Constants) {

        if(!$rootScope.autenticado) {
            dialog({
                mensagem: "É necessário estar autenticado para acessar a página de mensagem para usuário."
            });
            $location.path('/autenticacao');
        }

        $scope.usuario = {
            nome: usuarioNome
        };

        $scope.enviar = function(mensagem) {
            if(usuarioId == $rootScope.usuarioLogado._id) {
                dialog({
                    mensagem: 'Você não pode enviar uma mensagem para si mesmo.'
                });
                return;
            }
            if(mensagem.length >= 5 && mensagem.length <= 1000) {
                MensagemService.enviarMensagem(mensagem, usuarioId, $rootScope.usuarioLogado._id).success(function(resposta){
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
                    mensagem: 'A mensagem deve conter 5 a 1000 caracteres.'
                });
            }
        };

        $scope.cancelar = function() {
            $modalInstance.close();
        };

    }

})();
