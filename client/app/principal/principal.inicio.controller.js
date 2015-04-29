(function () {

    'use strict';

    angular
        .module('app.principal')
        .controller('PrincipalInicioController', PrincipalInicioController);

    PrincipalInicioController.$inject = ['$rootScope', '$scope', '$location', 'TutorialService', 'RankingService', 'dialog', 'Constants'];

    /* @ngInject */
    function PrincipalInicioController($rootScope, $scope, $location, TutorialService, RankingService, dialog, Constants) {

        $scope.bemVindo = $rootScope.msgBemVindo;
        $rootScope.msgBemVindo = false;

        var listarTutoriaisMelhoresAvaliados = function() {
            RankingService.listarTutoriaisEstrelas().success(function(resposta){
                if(resposta && resposta.status == "n") {
                    dialog({
                        mensagem: resposta.mensagem
                    });
                } else {
                    $scope.tutoriaisMelhores = resposta.dados;
                }
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        var listarTutoriaisRecentes = function() {
            TutorialService.listarTutoriaisRecentes().success(function(resposta){
                if(resposta && resposta.status == "n") {
                    dialog({
                        mensagem: resposta.mensagem
                    });
                } else {
                    $scope.tutoriaisRecentes = resposta.dados;
                }
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        listarTutoriaisMelhoresAvaliados();
        listarTutoriaisRecentes();

        $scope.aprender = function(id) {
            $location.path('/tutorial/visualizacao/' + id);
        };

    }

})();