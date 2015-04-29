var sessao = {};

sessao.verificarAutenticacaoUsuario = verificarAutenticacaoUsuario;
sessao.verificarAutenticacaoAdmin = verificarAutenticacaoAdmin;

function verificarAutenticacaoUsuario(req, res, next) {
    if (req.isAuthenticated()) {
    	return next(); 
    }
    res.redirect('/');
}

function verificarAutenticacaoAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.admin) { 
    	return next(); 
    }
    res.redirect('/');
}

module.exports = sessao;