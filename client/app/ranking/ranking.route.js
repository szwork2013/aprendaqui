(function () {
    
    'use strict';

    angular
    	.module('app.ranking')
    	.config(route);

    function route($routeProvider) {
        $routeProvider
        .when('/ranking/tutoriais', {
            templateUrl: 'app/ranking/ranking.tutoriais.html',
            controller: 'RankingTutoriaisController',
            title: 'Ranking Tutoriais',
            menu: 'ranking'
        })
        .when('/ranking/usuarios', {
            templateUrl: 'app/ranking/ranking.usuarios.html',
            controller: 'RankingUsuariosController',
            title: 'Ranking Usuários',
            menu: 'ranking'
        })
        .otherwise({
            redirectTo: '/'
        });
    }

})();