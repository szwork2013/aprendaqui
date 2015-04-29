(function() {

    'use strict';

    angular
        .module('app.admin')
        .controller('AdminPainelController', AdminPainelController);

    AdminPainelController.$inject = ['$rootScope', '$scope', '$route', '$modalInstance', '$modal', 'UsuarioService', 'TutorialService', 'CategoriaService', 'DenunciaService', 'dialog', 'ngTableParams', 'Constants'];

    /* @ngInject */
    function AdminPainelController($rootScope, $scope, $route, $modalInstance, $modal, UsuarioService, TutorialService, CategoriaService, DenunciaService, dialog, ngTableParams, Constants) {

        if(!$rootScope.autenticado) {
            dialog({
                mensagem: "É necessário estar autenticado para acessar o painel da administração."
            });
            $location.path('/autenticacao');
        }

        /* Gerenciar Categorias */

        $scope.tableCategorias = new ngTableParams({
            page: 1,
            count: 4,
        }, {
            counts: [],
            getData: function($defer, params) {
                CategoriaService.listarCategorias().success(function(resposta){
                    $scope.categorias = resposta.dados;
                    $scope.categorias = _.map($scope.categorias, function(categoria){
                        categoria.data = new Date(categoria.data).toLocaleDateString();
                        return categoria;
                    });
                    params.total($scope.categorias.length);
                    $defer.resolve($scope.categorias.slice((params.page() - 1) * params.count(), params.page() * params.count()));
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

        $scope.cadastrarCategoria = function(categoria) {
            CategoriaService.cadastrarCategoria(categoria).success(function(resposta){
                dialog({
                    mensagem: resposta.mensagem
                });
                categoria.nome = '';
                $scope.tableCategorias.reload();
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        $scope.desativarCategoria = function(categoriaId) {
            CategoriaService.desativarCategoria(categoriaId).success(function(resposta){
                dialog({
                    mensagem: resposta.mensagem
                });
                $scope.tableCategorias.reload();
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        $scope.ativarCategoria = function(categoriaId) {
            CategoriaService.ativarCategoria(categoriaId).success(function(resposta){
                dialog({
                    mensagem: resposta.mensagem
                });
                $scope.tableCategorias.reload();
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        /* Gerenciar Subcategorias */

        $scope.tableSubcategorias = new ngTableParams({
            page: 1,
            count: 4,
        }, {
            counts: [],
            getData: function($defer, params) {
                CategoriaService.listarSubcategorias().success(function(resposta){
                    $scope.subcategorias = resposta.dados;
                    $scope.subcategorias = _.map($scope.subcategorias, function(subcategoria){
                        subcategoria.data = new Date(subcategoria.data).toLocaleDateString();
                        return subcategoria;
                    });
                    params.total($scope.subcategorias.length);
                    $defer.resolve($scope.subcategorias.slice((params.page() - 1) * params.count(), params.page() * params.count()));
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

        $scope.cadastrarSubcategoria = function(subcategoria) {
            CategoriaService.cadastrarSubcategoria(subcategoria).success(function(resposta){
                dialog({
                    mensagem: resposta.mensagem
                });
                subcategoria.nome = '';
                subcategoria.categoria = '';
                $scope.tableSubcategorias.reload();
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        $scope.desativarSubcategoria = function(subcategoriaId) {
            CategoriaService.desativarSubcategoria(subcategoriaId).success(function(resposta){
                dialog({
                    mensagem: resposta.mensagem
                });
                $scope.tableSubcategorias.reload();
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        $scope.ativarSubcategoria = function(subcategoriaId) {
            CategoriaService.ativarSubcategoria(subcategoriaId).success(function(resposta){
                dialog({
                    mensagem: resposta.mensagem
                });
                $scope.tableSubcategorias.reload();
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        /* Gerenciar Tutoriais */

        $scope.tableTutoriais = new ngTableParams({
            page: 1,
            count: 4,
        }, {
            counts: [],
            getData: function($defer, params) {
                TutorialService.listarTutoriais().success(function(resposta){
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

        $scope.suspender = function(tutorialId) {
            var modalInstance = $modal.open({
                templateUrl: 'app/admin/admin.painel.suspender-tutorial.html',
                controller: 'AdminPainelSuspenderTutorialController',
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

        $scope.desuspender = function(tutorialId) {
            TutorialService.desuspenderTutorial(tutorialId).success(function(resposta){
                dialog({
                    mensagem: resposta.mensagem
                });
                $scope.tableTutoriais.reload();
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        $scope.alterar = function(tutorialId) {
            var modalInstance = $modal.open({
                templateUrl: 'app/admin/admin.painel.alterar-tutorial.html',
                controller: 'AdminPainelAlterarTutorialController',
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

        /* Gerenciar Denúncias */

        var listarDenuncias = function() {
            DenunciaService.listarDenuncias().success(function(resposta){
                if(resposta && resposta.status == "n") {
                    dialog({
                        mensagem: resposta.mensagem
                    });
                } else {
                    $scope.denuncias = resposta.dados;
                    $scope.denuncias = _.map($scope.denuncias, function(denuncia){
                        denuncia.data = new Date(denuncia.data).toLocaleDateString();
                        return denuncia;
                    });
                }
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        $scope.excluirDenuncia = function(denunciaId) {
            DenunciaService.excluirDenuncia(denunciaId).success(function(resposta) {
                dialog({
                    mensagem: resposta.mensagem
                });
                listarDenuncias();
            }).error(function(resposta) {
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        listarDenuncias();
        
        $scope.fechar = function() {
            $modalInstance.close();
            $route.reload();
        };

    }

})();
