(function () {
    
    'use strict';

    angular
    	.module('app.chat')
    	.config(route);

    function route($routeProvider) {
        $routeProvider
        .when('/chat/geral', {
            templateUrl: 'app/chat/chat.geral.html',
            controller: 'ChatGeralController',
            title: 'Chat Geral',
            autenticacao: true,
            menu: 'chat'
        })
        .otherwise({
            redirectTo: '/'
        });
    }

})();