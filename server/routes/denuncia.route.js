module.exports = function() {

    var express = require('express');
    var router = express.Router();

    var mongoose = require('mongoose');
    var Denuncia = mongoose.model('Denuncia');
    var utils = require('./../utils');

    /**
     * Cadastrar Denúncia.
     */
    router.post('/cadastrar', utils.sessao.verificarAutenticacaoUsuario, function(req, res){
        var denuncia = req.body.denuncia;
        Denuncia.create(denuncia, function(err, denuncia) {
            if(err) {
                res.json({mensagem:err, status:"n"});
            } else {
                res.json({mensagem:"Sua denúncia foi enviada com sucesso. Obrigado por colaborar.", status:"s"});
            }
        });
    });

    /**
     * Exclui uma Denúncia.
     */
    router.post('/excluir', utils.sessao.verificarAutenticacaoAdmin, function(req, res){
        var denuncia = req.body.denuncia;
        Denuncia.findOneAndRemove({_id: denuncia.id}, function(err, denuncia) {
            if(err) {
                res.json({mensagem:err, status:"n"});
            } else {
                res.json({mensagem:"Denúncia removida com sucesso.", status:"s"});
            }
        });
    });

    /**
     * Listar todas as denúncias.
     */
    router.get('/listar', utils.sessao.verificarAutenticacaoAdmin, function(req, res){
        var tutorialId = req.params.id;
        Denuncia.find({}).populate('tutorial', 'titulo').populate('denunciante', 'nome').exec(function(err, denuncias) {
            if(err) {
                res.json({mensagem:err, status:"n", dados: []});
            } else {
                res.json({mensagem:"Denúncias consultadas com sucesso.", status:"s", dados: denuncias});
            }
        });
    });

    return router;

};