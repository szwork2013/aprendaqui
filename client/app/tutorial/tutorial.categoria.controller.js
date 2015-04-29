(function () {

    'use strict';

    angular
        .module('app.tutorial')
        .controller('TutorialCategoriaController', TutorialCategoriaController);

    TutorialCategoriaController.$inject = ['$scope', '$location', '$routeParams', 'TutorialService', 'dialog', 'Constants'];

    /* @ngInject */
    function TutorialCategoriaController($scope, $location, $routeParams, TutorialService, dialog, Constants) {

    	var categoria = $routeParams.categoria;

        var listarTutoriaisCategoria = function() {
            TutorialService.listarTutoriaisCategoria(categoria).success(function(resposta){
                if(resposta && resposta.status == "n") {
                    dialog({
                        mensagem: resposta.mensagem
                    });
                } else {
                    $scope.categoria = resposta.dados;
                }
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        listarTutoriaisCategoria();

        $scope.aprender = function(id) {
            $location.path('/tutorial/visualizacao/' + id);
        };

    }

})();