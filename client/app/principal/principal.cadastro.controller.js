(function() {

    'use strict';

    angular
        .module('app.principal')
        .controller('PrincipalCadastroController', PrincipalCadastroController);

    PrincipalCadastroController.$inject = ['$scope', '$location', '$modalInstance', 'UsuarioService', 'dialog', 'Constants'];

    /* @ngInject */
    function PrincipalCadastroController($scope, $location, $modalInstance, UsuarioService, dialog, Constants) {

        $scope.usuario = {};

        $scope.cadastrar = function(usuario, senhaNovamente) {
            if(usuario.senha != senhaNovamente) {
                dialog({
                    mensagem: 'As duas senhas novas não conferem.'
                });
                return;
            }
            if(!usuario.foto) {
                dialog({
                    mensagem: 'Envie uma foto.'
                });
                return;
            }
            UsuarioService.cadastrar(usuario, usuario.foto).success(function(resposta){
                dialog({
                    mensagem: resposta.mensagem
                });
                if(resposta.status == "s") {
                    $modalInstance.close({email: usuario.email, senha: usuario.senha});
                }
            }).error(function(resposta, status){
                if(status != 413) {
                    dialog({
                        mensagem: Constants.errorMsg
                    });
                } else {
                   dialog({
                        mensagem: Constants.tamanhoMaximoFoto
                    });
                }
            });
        };

        $scope.fechar = function() {
            $modalInstance.close();
        };

    }

})();
