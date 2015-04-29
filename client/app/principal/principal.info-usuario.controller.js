(function() {

    'use strict';

    angular
        .module('app.principal')
        .controller('PrincipalInfoUsuarioController', PrincipalInfoUsuarioController);

    PrincipalInfoUsuarioController.$inject = ['$scope', '$modalInstance', '$modal', 'PrincipalService', 'dialog', 'usuarioId', 'Constants'];

    /* @ngInject */
    function PrincipalInfoUsuarioController($scope, $modalInstance, $modal, PrincipalService, dialog, usuarioId, Constants) {

        var consultarUsuario = function() {
            PrincipalService.consultarUsuario(usuarioId).success(function(resposta){
                if(resposta && resposta.status == "n") {
                    dialog({
                        mensagem: resposta.mensagem
                    });
                } else {
                    $scope.informacoes = resposta.dados;
                    if(!$scope.informacoes.classificacao.mediaNotas) {
                        $scope.informacoes.classificacao.mediaNotas = 0;
                    }
                }
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        consultarUsuario();

        $scope.enviarMensagem = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/principal/principal.mensagem-usuario.html',
                controller: 'PrincipalMensagemUsuarioController',
                size: 'md',
                resolve: {
                    usuarioId: function() {
                        return usuarioId;
                    },
                    usuarioNome: function() {
                        return $scope.informacoes.usuario.nome;
                    }
                }
            });
        };

        $scope.fechar = function() {
            $modalInstance.close();
        };

    }

})();
