(function() {

    'use strict';

    var errorMsg = "Ocorreu algum erro com conexão com o servidor, tente novamente mais tarde.";

    var tamanhoMaximoFoto = "O tamanho máximo da foto deve ser 1,4MB. Envie novamente.";

    angular
        .module('app.core')
        .constant('Constants', {
            "errorMsg": errorMsg,
            "tamanhoMaximoFoto": tamanhoMaximoFoto
        });

})();