module.exports = function() {

    var express = require('express');
    var router = express.Router();

    var mongoose = require('mongoose');
    var Comentario = mongoose.model('Comentario');
    var utils = require('./../utils');

    /**
     * Cadastrar Comentário.
     */
    router.post('/cadastrar', utils.sessao.verificarAutenticacaoUsuario, function(req, res){
        var comentario = req.body.comentario;
        Comentario.create(comentario, function(err, comentario) {
            if(err) {
                res.json({mensagem:err, status:"n"});
            } else {
                res.json({mensagem:"Comentário cadastrado com sucesso.", status:"s"});
            }
        });
    });

    /**
     * Listar todos os comentários de um tutorial.
     */
    router.get('/listar/:id', function(req, res){
        var tutorialId = req.params.id;
        Comentario.find({tutorial: tutorialId}).populate('autor', 'nome fotoPath').exec(function(err, comentarios) {
            if(err) {
                res.json({mensagem:"Não existem comentários a serem listados para este tutorial.", erro:err, status:"n", dados: []});
            } else {
                res.json({mensagem:"Comentários consultados com sucesso.", status:"s", dados: comentarios});
            }
        });
    });

    return router;

};