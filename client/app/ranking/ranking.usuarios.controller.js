(function () {

    'use strict';

    angular
        .module('app.ranking')
        .controller('RankingUsuariosController', RankingUsuariosController);

    RankingUsuariosController.$inject = ['$scope', 'RankingService', 'Constants'];

    /* @ngInject */
    function RankingUsuariosController($scope, RankingService, Constants) {

    	$scope.ranking = {
    		estrelas: [],
    		mediaEstrelas: []
    	};

        var listarRankingEstrelas = function() {
            RankingService.listarUsuariosEstrelas().success(function(resposta){
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

        listarRankingEstrelas();

    }

})();