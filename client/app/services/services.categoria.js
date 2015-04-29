(function () {

    'use strict';

    angular
        .module('app.services')
        .service('CategoriaService', CategoriaService);

    CategoriaService.$inject = ['$http', '$rootScope'];

    /* @ngInject */
    function CategoriaService ($http, $rootScope) {

        var service = {};

        service.cadastrarCategoria = function(categoria) {
            return $http({
                method: 'POST',
                url: '/categoria/cadastrar',
                data: {
                    categoria: categoria
                }
            });
        };

        service.desativarCategoria = function(categoriaId) {
            return $http({
                method: 'POST',
                url: '/categoria/desativar',
                data: {
                    categoria: {
                        id: categoriaId
                    }
                }
            });
        };

        service.ativarCategoria = function(categoriaId) {
            return $http({
                method: 'POST',
                url: '/categoria/ativar',
                data: {
                    categoria: {
                        id: categoriaId
                    }
                }
            });
        };

        service.cadastrarSubcategoria = function(subcategoria) {
            return $http({
                method: 'POST',
                url: '/categoria/cadastrar/sub',
                data: {
                    subcategoria: subcategoria
                }
            });
        };

        service.desativarSubcategoria = function(subcategoriaId) {
            return $http({
                method: 'POST',
                url: '/categoria/desativar/sub',
                data: {
                    subcategoria: {
                        id: subcategoriaId
                    }
                }
            });
        };

        service.ativarSubcategoria = function(subcategoriaId) {
            return $http({
                method: 'POST',
                url: '/categoria/ativar/sub',
                data: {
                    subcategoria: {
                        id: subcategoriaId
                    }
                }
            });
        };

        service.listarCategorias = function() {
            return $http.get('/categoria/listar');
        };

        service.listarSubcategorias = function() {
            return $http.get('/categoria/listar/sub');
        };

        //Lista categoria e suas subcategorias.
        service.listarCategoriasSub = function() {
            return $http.get('/categoria/listar/grupo');
        };

        return service;

    }

})();