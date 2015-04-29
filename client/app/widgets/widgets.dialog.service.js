(function () {

    'use strict';

    angular
        .module('app.widgets')
        .service('dialog', dialog);

    dialog.$inject = ['$modal'];

    function dialog($modal) {
        var service = function(configuracoes) {
            return $modal.open({
                templateUrl: 'app/widgets/widgets.dialog.html',
                controller: 'DialogController',
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
