module.exports = function(io) {

	var _ = require('underscore');
	var usuariosOnline = [];

	io.on('connection', function(socket){

		require('./chat-geral.js')(socket);

		if(socket.request.user) {		
			var pushUsuario = true;
			usuariosOnline.forEach(function(usuario){
				if(usuario._id == socket.request.user._id) {
					pushUsuario = false;
				}
			});
			if(pushUsuario) {
				usuariosOnline.push(socket.request.user);
				socket.emit('usuarios:online', usuariosOnline);
				socket.broadcast.emit('usuarios:online', usuariosOnline);
			}
		}

		socket.on('disconnect', function () {
			usuariosOnline = _.reject(usuariosOnline, function(usuario){
				return usuario._id == socket.request.user._id
			});
			socket.emit('usuarios:online', usuariosOnline);
			socket.broadcast.emit('usuarios:online', usuariosOnline);
		});

		socket.on('usuarios:online', function(){
			socket.emit('usuarios:online', usuariosOnline);
			socket.broadcast.emit('usuarios:online', usuariosOnline);
		});

	});

};