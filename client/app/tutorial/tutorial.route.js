(function () {

    'use strict';

    angular
        .module('app.tutorial')
        .config(route);

    function route($routeProvider) {
        $routeProvider
            .when('/tutorial/criacao', {
                templateUrl: 'app/tutorial/tutorial.criacao.html',
                controller: 'TutorialCriacaoController',
                title: 'Criação de Tutoriais',
                autenticacao: true,
                menu: 'tutoriais'
            })
            .when('/tutorial/visualizacao/:id', {
                templateUrl: 'app/tutorial/tutorial.visualizacao.html',
                controller: 'TutorialVisualizacaoController',
                title: 'Visualização de Tutorial',
                menu: 'tutoriais'
            })
            .when('/tutorial/categoria/:categoria', {
                templateUrl: 'app/tutorial/tutorial.categoria.html',
                controller: 'TutorialCategoriaController',
                title: 'Tutorial por Categoria',
                menu: 'tutoriais'
            })
            .when('/tutorial/subcategoria/:subcategoria', {
                templateUrl: 'app/tutorial/tutorial.subcategoria.html',
                controller: 'TutorialSubcategoriaController',
                title: 'Tutorial por Subcategoria',
                menu: 'tutoriais'
            })
            .otherwise({
                redirectTo: '/'
            });
    }

})();