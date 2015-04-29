(function() {

    'use strict';

    angular
        .module('app.painel')
        .controller('PainelControleController', PainelControleController);

    PainelControleController.$inject = ['$rootScope', '$scope', '$route', '$location', '$modalInstance', '$modal', 'UsuarioService', 'TutorialService', 'MensagemService', 'dialog', 'ngTableParams', 'Constants'];

    /* @ngInject */
    function PainelControleController($rootScope, $scope, $route, $location, $modalInstance, $modal, UsuarioService, TutorialService, MensagemService, dialog, ngTableParams, Constants) {

        if(!$rootScope.autenticado) {
            dialog({
                mensagem: "É necessário estar autenticado para acessar o painel de controle."
            });
            $location.path('/autenticacao');
        }

        /* Alterar Senha */

        $scope.alterarSenha = function(senha) {
            if (senha.nova != senha.nova2) {
                dialog({
                    mensagem: 'As duas senhas novas não conferem.'
                });
                return;
            }
            UsuarioService.alterarSenha(senha).success(function(resposta) {
                dialog({
                    mensagem: resposta.mensagem
                });
                senha.antiga = '';
                senha.nova = '';
                senha.nova2 = '';
            }).error(function(resposta) {
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        /* Alterar Foto */

        $scope.fotoAtual = $rootScope.usuarioLogado.fotoPath;

        $scope.alterarFoto = function(foto) {
            UsuarioService.alterarFoto(foto).success(function(resposta) {
                $scope.fotoAtual = resposta.dados.fotoPath;
                $rootScope.usuarioLogado.fotoPath = resposta.dados.fotoPath;
                dialog({
                    mensagem: resposta.mensagem
                });
            }).error(function(resposta, status) {
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

        /* Meus Tutoriais */

        $scope.tableTutoriais = new ngTableParams({
            page: 1,
            count: 4,
        }, {
            counts: [],
            getData: function($defer, params) {
                TutorialService.listarMeusTutoriais().success(function(resposta){
                    if(resposta && resposta.status == "n") {
                        dialog({
                            mensagem: resposta.mensagem
                        });
                    } else {
                        $scope.tutoriais = resposta.dados;
                        $scope.tutoriais = _.map($scope.tutoriais, function(tutorial){
                            tutorial.data = new Date(tutorial.data).toLocaleDateString();
                            return tutorial;
                        });
                        params.total($scope.tutoriais.length);
                        $defer.resolve($scope.tutoriais.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                }).error(function(resposta){
                    dialog({
                        mensagem: Constants.errorMsg
                    });
                });
            },
            total: function() {
                return getData().length;
            }
        });

        $scope.atualizar = function(tutorialId) {
            var modalInstance = $modal.open({
                templateUrl: 'app/painel/painel.controle.atualizar-tutorial.html',
                controller: 'PainelControleAtualizarTutorialController',
                size: 'lg',
                backdrop: false,
                resolve: {
                    tutorialId: function() {
                        return tutorialId;
                    }
                }
            });
            modalInstance.result.then(function(result){
                if(result) {
                    $scope.tableTutoriais.reload();
                }
            });
        };

        $scope.desativar = function(tutorialId) {
            TutorialService.desativarTutorial(tutorialId).success(function(resposta) {
                dialog({
                    mensagem: resposta.mensagem
                });
                $scope.tableTutoriais.reload();
            }).error(function(resposta) {
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        $scope.ativar = function(tutorialId) {
            TutorialService.ativarTutorial(tutorialId).success(function(resposta) {
                dialog({
                    mensagem: resposta.mensagem
                });
                $scope.tableTutoriais.reload();
            }).error(function(resposta) {
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        $scope.visualizar = function(tutorialId) {
            $modalInstance.close();
            $location.path('/tutorial/visualizacao/' + tutorialId);
        };

        /* Minhas Mensagens */

        $scope.mensagens = [];
        $scope.oneAtATime = true;

        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };

        var listarMinhasMensagens = function() {
            MensagemService.listarMensagens().success(function(resposta) {
                $scope.mensagens = resposta.dados;
                $scope.mensagens = _.map($scope.mensagens, function(mensagem) {
                    mensagem.data = new Date(mensagem.data).toLocaleDateString();
                    return mensagem;
                });
            }).error(function(resposta) {
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        $scope.excluirMensagem = function(mensagemId) {
            MensagemService.excluirMensagem(mensagemId).success(function(resposta) {
                dialog({
                    mensagem: resposta.mensagem
                });
                listarMinhasMensagens();
            }).error(function(resposta) {
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        $scope.responder = function(autorId, autorNome) {
            var modalInstance = $modal.open({
                templateUrl: 'app/principal/principal.mensagem-usuario.html',
                controller: 'PrincipalMensagemUsuarioController',
                size: 'md',
                resolve: {
                    usuarioId: function() {
                        return autorId;
                    },
                    usuarioNome: function() {
                        return autorNome;
                    }
                }
            });
        };

        listarMinhasMensagens();

        $scope.fechar = function() {
            $modalInstance.close();
            $route.reload();
        };

    }

})();
