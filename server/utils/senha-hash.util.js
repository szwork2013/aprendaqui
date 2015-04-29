var bcrypt = require('bcrypt');

var senhaHash = {};

senhaHash.gerarHash = function(senha) {
    return bcrypt.hashSync(senha, 8, null);
};

senhaHash.validarSenha = function(senhaEnviada, senhaUsuario) {
    return bcrypt.compareSync(senhaEnviada, senhaUsuario);
};

module.exports = senhaHash;