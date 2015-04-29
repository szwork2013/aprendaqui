(function () {

    'use strict';

    angular
        .module('app.tutorial')
        .controller('TutorialSubcategoriaController', TutorialSubcategoriaController);

    TutorialSubcategoriaController.$inject = ['$scope', '$location', '$routeParams', 'TutorialService', 'dialog', 'Constants'];

    /* @ngInject */
    function TutorialSubcategoriaController($scope, $location, $routeParams, TutorialService, dialog, Constants) {

    	var subcategoria = $routeParams.subcategoria;

        var listarTutoriaisSubcategoria = function() {
            TutorialService.listarTutoriaisSubcategoria(subcategoria).success(function(resposta){
                if(resposta && resposta.status == "n") {
                    dialog({
                        mensagem: resposta.mensagem
                    });
                } else {
                    $scope.subcategoria = resposta.dados;
                }
            }).error(function(resposta){
                dialog({
                    mensagem: Constants.errorMsg
                });
            });
        };

        listarTutoriaisSubcategoria();

        $scope.aprender = function(id) {
            $location.path('/tutorial/visualizacao/' + id);
        };

    }

})();