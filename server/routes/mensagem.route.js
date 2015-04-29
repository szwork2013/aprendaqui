module.exports = function() {

    var express = require('express');
    var router = express.Router();

    var mongoose = require('mongoose');
    var Mensagem = mongoose.model('Mensagem');
    var utils = require('./../utils');

    /**
     * Enviar Mensagem.
     */
    router.post('/enviar', utils.sessao.verificarAutenticacaoUsuario, function(req, res){
        var mensagem = req.body.mensagem;
        Mensagem.create(mensagem, function(err, mensagem) {
            if(err) {
                res.json({mensagem:err, status:"n"});
            } else {
                res.json({mensagem:"Mensagem enviada com sucesso.", status:"s"});
            }
        });
    });

    /**
     * Exclui uma Mensagem.
     */
    router.post('/excluir', utils.sessao.verificarAutenticacaoUsuario, function(req, res){
        var mensagem = req.body.mensagem;
        Mensagem.findOneAndRemove({_id: mensagem.id}, function(err, mensagem) {
            if(err) {
                res.json({mensagem:err, status:"n"});
            } else {
                res.json({mensagem:"Mensagem excluida com sucesso.", status:"s"});
            }
        });
    });

    /**
     * Listar todas as mensagens de um usuário.
     */
    router.get('/listar', utils.sessao.verificarAutenticacaoUsuario, function(req, res){
        var usuarioId = req.user._id;
        Mensagem.find({leitor: usuarioId}).populate('autor', 'nome').sort({'data': -1}).exec(function(err, mensagens) {
            if(err) {
                res.json({mensagem:err, status:"n", dados: []});
            } else {
                res.json({mensagem:"Mensagens consultadas com sucesso.", status:"s", dados: mensagens});
            }
        });
    });

    return router;

};