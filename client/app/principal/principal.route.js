(function () {
    
    'use strict';

    angular
    	.module('app.principal')
    	.config(route);

    function route($routeProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'app/principal/principal.inicio.html',
            controller: 'PrincipalInicioController',
            title: 'Início',
            menu: 'inicio'
        })
        .when('/autenticacao', {
            templateUrl: 'app/principal/principal.autenticacao.html',
            controller: 'PrincipalAutenticacaoController',
            title: 'Autenticação',
            menu: 'autenticacao'
        })
        .when('/projeto', {
            templateUrl: 'app/principal/principal.projeto.html',
            controller: 'PrincipalProjetoController',
            title: 'O Projeto',
            menu: 'projeto'
        })
        .when('/perguntas-frequentes', {
            templateUrl: 'app/principal/principal.perguntas-frequentes.html',
            controller: 'PrincipalPerguntasFrequentesController',
            title: 'Perguntas Frequentes',
            menu: 'perguntas-frequentes'
        })
        .when('/pesquisa/:filtro', {
            templateUrl: 'app/principal/principal.pesquisa.html',
            controller: 'PrincipalPesquisaController',
            title: 'Pesquisa',
            menu: 'tutoriais'
        })
        .otherwise({
            redirectTo: '/'
        });
    }

})();