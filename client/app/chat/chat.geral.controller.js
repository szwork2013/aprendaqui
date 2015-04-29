(function () {

    'use strict';

    angular
        .module('app.chat')
        .controller('ChatGeralController', ChatGeralController);

    ChatGeralController.$inject = ['$rootScope', '$scope', '$location', 'SocketService', 'dialog'];

    /* @ngInject */
    function ChatGeralController($rootScope, $scope, $location, SocketService, dialog) {

        $scope.respostas = [];
        $scope.mensagem = undefined;
        $scope.usuariosLogado = [];

        SocketService.connect();

        $scope.enviarMensagem = function() {
            if($scope.formulario.$invalid) {
                dialog({
                    mensagem: 'Digite a mensagem antes de enviar.'
                });
                return;
            }
            SocketService.emit('chat:mensagem', $scope.mensagem);
            $scope.mensagem = undefined;
        };

        SocketService.on('chat:mensagem', function(resposta){
        	$scope.respostas.push(resposta);
            setTimeout(function(){
                $(".chat-scroll").scrollTop($(".chat-scroll")[0].scrollHeight);
            }, 100);
        });

        SocketService.emit('usuarios:online');

        SocketService.on('usuarios:online', function(usuariosLogado){
            $scope.usuariosLogado = [];
            usuariosLogado.forEach(function(usuario) {
                if(usuario.nome.split(" ").length == 2) {
                    usuario.nome = usuario.nome.split(" ")[0];
                }
                $scope.usuariosLogado.push(usuario);
            });
        });

    }

})();