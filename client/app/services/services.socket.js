(function () {

    'use strict';

    angular
        .module('app.services')
        .service('SocketService', SocketService);

    SocketService.$inject = ['$rootScope'];

    /* @ngInject */
    function SocketService ($rootScope) {

        var socket;
        var connected = false;

        var service = {
            connect: function() {
                socket = io.connect({'forceNew':true });
                connected = true;
            },
            disconnect: function() {
                socket.disconnect();
                connected = false;
                socket = undefined;
            },
            connected: function() {
                return connected;
            },
            on: function(eventName, callback) {
                if(socket) {                    
                    socket.on(eventName, function() {
                        var args = arguments;
                        $rootScope.$apply(function() {
                            callback.apply(socket, args);
                        });
                    });
                }
            },
            emit: function(eventName, data, callback) {
                if(socket) {
                    socket.emit(eventName, data, function() {
                        var args = arguments;
                        $rootScope.$apply(function() {
                            if (callback) {
                                callback.apply(socket, args);
                            }
                        });
                    });
                }
            },
            getSocket: function() {
                return socket;
            }
        };

        return service;

    }

})();