(function () {
    
    'use strict';

    angular
        .module('app.widgets')
        .controller('TextAngularDialogController', DialogController);

    DialogController.$inject = ['$scope', '$modalInstance', 'configuracoes'];

    /* @ngInject */
    function DialogController($scope, $modalInstance, configuracoes) {
        
        $scope.mensagem = configuracoes.mensagem;
        $scope.url = configuracoes.url;

        $scope.close = close;
        $scope.confirmar = confirmar;
        $scope.cancelar = cancelar;

        function close() {
            $modalInstance.dismiss('cancel');
        }

        function confirmar(url) {
            $modalInstance.close(url);
        }

        function cancelar() {
            $modalInstance.close(false);
        }
    }

})();