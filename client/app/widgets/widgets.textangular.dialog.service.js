(function () {

    'use strict';

    angular
        .module('app.widgets')
        .service('textAngularDialog', dialog);

    dialog.$inject = ['$modal'];

    function dialog($modal) {
        var service = function(configuracoes) {
            return $modal.open({
                templateUrl: 'app/widgets/widgets.textangular.dialog.html',
                controller: 'TextAngularDialogController',
                windowClass: 'modal-message',
                resolve: {
                    configuracoes: function() {
                        return configuracoes;
                    }
                }
            });
        };
        return service;
    }

})();
