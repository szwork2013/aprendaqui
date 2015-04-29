(function() {

    'use strict';

    angular.module('app', [
        'app.core',
        'app.widgets',
        'app.services',
        'app.principal',
        'app.tutorial',
        'app.chat',
        'app.ranking',
        'app.painel',
        'app.admin'
    ]);

    angular.module('app.core', [
        'ngRoute',
        'ngAnimate',
        'ui.bootstrap',
        'angular-loading-bar'
    ]);

    angular.module('app').run(Run);

    Run.$inject = ['$rootScope', '$location', '$modal', 'UsuarioService', 'SessaoService', 'CategoriaService', 'SocketService', 'dialog', 'Constants'];

    function Run($rootScope, $location, $modal, UsuarioService, SessaoService, CategoriaService, SocketService, dialog, Constants) {

        SessaoService.verificarAutenticacao();
        
        document.querySelector('#loading').style.display = 'none';
        document.querySelector('body').style.overflow = '';

        var listarCategorias = function() {
            CategoriaService.listarCategoriasSub().success(function(resposta) {
                if (resposta && resposta.status == "s") {
                    $rootScope.categorias = resposta.dados;
                }
            }).error(function(resposta) {
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        listarCategorias();

        $rootScope.visualizarCategoria = function(categoria) {
            $location.path('/tutorial/categoria/' + categoria);
        };

        $rootScope.$on('$routeChangeSuccess', function(next, current, previous) {
            if (current.$$route) {
                $rootScope.title = current.$$route.title;
                $rootScope.menuActive = current.$$route.menu;
            }
            if(previous && previous.$$route && previous.$$route.controller == 'ChatGeralController') {
                if(SocketService.connected()) {
                    SocketService.disconnect();
                }
            }
            if(previous && previous.$$route && previous.$$route.controller == 'PrincipalAutenticacaoController') {
                if(current && current.$$route && current.$$route.controller == 'PrincipalInicioController' && $rootScope.autenticado) {
                    $rootScope.msgBemVindo = true;
                }
            }
            if(current.$$route && current.$$route.autenticacao && !$rootScope.autenticado) {
                dialog({
                    mensagem: "É necessário estar autenticado para acessar a página " + $rootScope.title + "."
                });
                $location.path('/autenticacao');
            }
        });

        $rootScope.goTo = function(route) {
            $location.url(route);
        };

        $rootScope.painelControle = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/painel/painel.controle.html',
                controller: 'PainelControleController',
                size: 'lg'
            });
        };

        $rootScope.painelAdministracao = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/admin/admin.painel.html',
                controller: 'AdminPainelController',
                size: 'lg'
            });
        };

        $rootScope.pesquisar = function(filtro) {
            var _filtro = filtro;
            $rootScope.filtro = '';
            if(_filtro) {
                $location.path('/pesquisa/' + _filtro);
            }
        };

        $rootScope.informacoesUsuario = function(usuarioId) {
            var modalInstance = $modal.open({
                templateUrl: 'app/principal/principal.info-usuario.html',
                controller: 'PrincipalInfoUsuarioController',
                size: 'md',
                resolve: {
                    usuarioId: function() {
                        return usuarioId;
                    }
                }
            });
        };

        $rootScope.sair = function() {
            UsuarioService.sair().success(function() {
                $rootScope.autenticado = false;
                $rootScope.usuarioLogado = undefined;
                if(SocketService.connected()) {
                    SocketService.disconnect();
                }
                $location.path('/');
            });
        };

    }

})();
