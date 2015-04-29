(function () {

    'use strict';

    angular
        .module('app.principal')
        .controller('PrincipalProjetoController', PrincipalProjetoController);

    PrincipalProjetoController.$inject = ['$scope', 'PrincipalService', 'Constants'];

    /* @ngInject */
    function PrincipalProjetoController($scope, PrincipalService, Constants) {

        var listarNumeros = function() {
            PrincipalService.listarNumeros().success(function(resposta){
                if(resposta && resposta.status == "n") {
                    dialog({
                        mensagem: resposta.mensagem
                    });
                } else {
                    $scope.numeros = resposta.dados;
                }
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

       	listarNumeros();

    }

})();