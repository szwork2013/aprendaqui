(function () {
    
    'use strict';

    angular
        .module('app.widgets')
        .controller('DialogController', DialogController);

    DialogController.$inject = ['$scope', '$modalInstance', 'configuracoes'];

    /* @ngInject */
    function DialogController($scope, $modalInstance, configuracoes) {
        
        $scope.mensagem = configuracoes.mensagem;
        $scope.textoBotoes = {
            confirmar: (configuracoes.textoBotoes && configuracoes.textoBotoes.confirmar) ? configuracoes.textoBotoes.confirmar : 'OK',
            cancelar: (configuracoes.textoBotoes && configuracoes.textoBotoes.cancelar) ? configuracoes.textoBotoes.cancelar : 'Cancelar'
        };
        $scope.podeCancelar = configuracoes.podeCancelar || false;

        $scope.close = close;
        $scope.confirmar = confirmar;
        $scope.cancelar = cancelar;

        function close() {
            $modalInstance.dismiss('cancel');
        }

        function confirmar() {
            $modalInstance.close(true);
        }

        function cancelar() {
            $modalInstance.close(false);
        }
    }

})();
