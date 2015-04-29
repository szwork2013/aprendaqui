(function () {

    'use strict';

    angular
        .module('app.principal')
        .controller('PrincipalPerguntasFrequentesController', PrincipalPerguntasFrequentesController);

    PrincipalPerguntasFrequentesController.$inject = ['$scope'];

    /* @ngInject */
    function PrincipalPerguntasFrequentesController($scope) {
        $scope.oneAtATime = false;

        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };

        $scope.perguntas = 
        [
            {
                titulo: 'Qual o propósito do sistema?',
                mensagem: 'Proporcionar um ambiente para o compartilhamento e visualização de conhecimentos na forma de tutoriais.',
                status: {
                    open: true
                }
            },
            {
                titulo: 'O que é um tutorial?',
                mensagem: 'Tutorial é uma forma de expor um conhecimento, podendo ser um texto (contendo imagens ou não) ou até mesmo' +
                ' um vídeo, mantendo sempre seu objetivo, que é expor passos para adquirir um determinado conhecimento ou realizar uma atividade.',
                status: {
                    open: true
                }
            },
            {
                titulo: 'Quando posso escrever um novo tutorial?',
                mensagem: 'A qualquer momento, desde que o tutorial a ser escrito agregue um novo conhecimento a plataforma.',
                status: {
                    open: true
                }
            },
            {
                titulo: 'Como funciona o Ranking de Tutoriais?',
                mensagem: 'O Ranking de Tutoriais lista os 10 melhores tutoriais no sistema. Para calcular estes tutoriais,' +
                ' o sistema multiplica a quantidade de classificações pela quantidade média de estrelas adquiridas' +
                ' nas classificações, ou seja se um tutorial recebeu 10 classificaçoes(10 usuários diferentes) e possuir' +
                ' uma média de 3 estrelas, ele terá o fator 30 na classificação.',
                status: {
                    open: true
                }
            },
            {
                titulo: 'Como classifico um Tutorial?',
                mensagem: 'Você pode classificar um tutorial no painel de classificação na página de visualização do Tutorial.' +
                ' Você pode dar de 1 a 5 estrelas para este tutorial.',
                status: {
                    open: true
                }
            }
        ];

    }

})();