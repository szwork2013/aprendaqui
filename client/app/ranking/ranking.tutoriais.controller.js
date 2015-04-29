(function () {

    'use strict';

    angular
        .module('app.ranking')
        .controller('RankingTutoriaisController', RankingTutoriaisController);

    RankingTutoriaisController.$inject = ['$scope', '$location', 'RankingService', 'Constants'];

    /* @ngInject */
    function RankingTutoriaisController($scope, $location, RankingService, Constants) {

    	$scope.ranking = {
    		estrelas: [],
    		mediaEstrelas: []
    	};

        var listarRankingEstrelas = function() {
            RankingService.listarTutoriaisEstrelas().success(function(resposta){
                if(resposta && resposta.status == "n") {
                    dialog({
                        mensagem: resposta.mensagem
                    });
                } else {
                    $scope.ranking.estrelas = resposta.dados;
                }
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        $scope.visualizarTutorial = function(tutorialId) {
            $location.path('/tutorial/visualizacao/' + tutorialId);
        };

        listarRankingEstrelas();

    }

})();