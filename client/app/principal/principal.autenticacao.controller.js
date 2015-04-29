(function () {

    'use strict';

    angular
        .module('app.principal')
        .controller('PrincipalAutenticacaoController', PrincipalAutenticacaoController);

    PrincipalAutenticacaoController.$inject = ['$scope', '$rootScope', '$location', '$modal', 'UsuarioService', 'dialog', 'Constants'];

    /* @ngInject */
    function PrincipalAutenticacaoController($scope, $rootScope, $location, $modal, UsuarioService, dialog, Constants) {

        if($rootScope.autenticado) {
            $location.path('/');
        }

        $scope.usuario = {};

        $scope.autenticar = function() {
            UsuarioService.autenticar($scope.usuario).success(function(resposta){
                if(resposta && resposta.status == "n") {
                    dialog({
                        mensagem: resposta.mensagem
                    });
                } else {
                    $rootScope.autenticado = true;
                    $rootScope.usuarioLogado = resposta;
                    $location.path('/');
                }
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        $scope.abrirCadastro = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/principal/principal.cadastro.html',
                controller: 'PrincipalCadastroController',
                size: 'md'
            });
            modalInstance.result.then(function(result){
                if(result && result.email && result.senha) {
                    $scope.usuario.email = result.email;
                    $scope.usuario.senha = result.senha;
                }
            });
        };

        $scope.recuperarSenha = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/principal/principal.recuperar-senha.html',
                controller: 'PrincipalRecuperarSenhaController',
                size: 'md'
            });
        };

    }

})();