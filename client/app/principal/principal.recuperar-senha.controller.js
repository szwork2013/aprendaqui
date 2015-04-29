(function() {

    'use strict';

    angular
        .module('app.principal')
        .controller('PrincipalRecuperarSenhaController', PrincipalRecuperarSenhaController);

    PrincipalRecuperarSenhaController.$inject = ['$scope', '$modalInstance', 'UsuarioService', 'dialog', 'Constants'];

    /* @ngInject */
    function PrincipalRecuperarSenhaController($scope, $modalInstance, UsuarioService, dialog, Constants) {

        $scope.recuperar = function(email) {
            UsuarioService.recuperarSenha(email).success(function(resposta){
                dialog({
                    mensagem: resposta.mensagem
                });
                $modalInstance.close();
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        $scope.fechar = function() {
            $modalInstance.close();
        };

    }

})();