module.exports = function(socket) {

	socket.on('chat:mensagem', function(mensagem) {
		var resposta = {
			mensagem: mensagem,
			usuario: {
				id: socket.request.user._id,
				nome: socket.request.user.nome,
				foto: socket.request.user.fotoPath
			}
		};
		socket.emit('chat:mensagem', resposta);
		socket.broadcast.emit('chat:mensagem', resposta);
	});

	return socket;

};