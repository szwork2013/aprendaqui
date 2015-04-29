(function () {

    'use strict';

    angular
        .module('app.principal')
        .controller('PrincipalPesquisaController', PrincipalPesquisaController);

    PrincipalPesquisaController.$inject = ['$scope', '$routeParams', '$location', 'TutorialService', 'dialog', 'Constants'];

    /* @ngInject */
    function PrincipalPesquisaController($scope, $routeParams, $location, TutorialService, dialog, Constants) {

        $scope.filtro = $routeParams.filtro;

        if(!$scope.filtro) {
            dialog({
                mensagem: 'Nada foi pesquisado.'
            });
            $location.path('/');
        }

        var consultarTutoriais = function() {
            TutorialService.consultarTutoriaisFiltro($scope.filtro).success(function(resposta){
                if(resposta && resposta.status == "n") {
                    dialog({
                        mensagem: resposta.mensagem
                    });
                } else {
                    if(resposta.dados.tipo == 'nome') {
                        $scope.tutoriais = resposta.dados.tutoriais;
                        $scope.tipo = resposta.dados.tipo;
                    } else if(resposta.dados.tipo == 'estrelas') {
                        $scope.tutoriais = _.pluck(resposta.dados.tutoriais, 'tutorial');
                        $scope.tipo = resposta.dados.tipo;
                        $scope.filtro = $scope.filtro.split("*")[1] + ' estrelas';
                    }
                }
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        $scope.aprender = function(id) {
            $location.path('/tutorial/visualizacao/' + id);
        };

        consultarTutoriais();

    }

})();