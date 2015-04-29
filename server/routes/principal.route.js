module.exports = function() {

    var express = require('express');
    var router = express.Router();

    var mongoose = require('mongoose');
    
    var Usuario = mongoose.model('Usuario');
    var Tutorial = mongoose.model('Tutorial');
    var Comentario = mongoose.model('Comentario');
    var Classificacao = mongoose.model('Classificacao');

    /**
     * Estatística dos dados da aplicação.
     */
    router.get('/estatistica', function(req, res){
        var resposta = {
            usuarios: 0,
            tutoriais: 0,
            comentarios: 0,
            classificacoes: 0
        };
        numerosUsuarios(res, resposta);
    });

    var numerosUsuarios = function(res, resposta) {
        Usuario.find({}, '_id', function(err, usuarios){
            if(err) {
                res.json({mensagem:err, status:"n"});
            }
            resposta.usuarios = usuarios.length;
            numerosTutoriais(res, resposta);
        });
    };

    var numerosTutoriais = function(res, resposta) {
        Tutorial.find({ativo: true, "suspensao.suspenso": false}, '_id', function(err, tutoriais){
            if(err) {
                res.json({mensagem:err, status:"n"});
            }
            resposta.tutoriais = tutoriais ? tutoriais.length : 0;
            tutoriaisId = tutoriais;
            numerosComentarios(res, resposta, tutoriaisId);
        });
    };

    var numerosComentarios = function(res, resposta, tutoriaisId) {
        Comentario.find({tutorial: {$in: tutoriaisId}}, '_id', function(err, comentarios){
            if(err) {
                res.json({mensagem:err, status:"n"});
            }
            console.log(comentarios);
            resposta.comentarios = comentarios ? comentarios.length : 0;
            numerosClassificacoes(res, resposta, tutoriaisId);
        });
    };

    var numerosClassificacoes = function(res, resposta, tutoriaisId) {
        Classificacao.find({tutorial: {$in: tutoriaisId}}, '_id', function(err, classificacoes){
            if(err) {
                res.json({mensagem:err, status:"n"});
            }
            resposta.classificacoes = classificacoes ? classificacoes.length : 0;
            res.json({mensagem:"Estatísticas da aplicação consultadas com sucesso.", status:"s", dados: resposta});
        });
    };

    /**
     * Consulta informações e estatística do usuário.
     */
    router.get('/estatistica/usuario/:usuarioId', function(req, res){
        var resposta = {
            usuarioId: req.params.usuarioId,
            numeros: {
                tutoriais: 0,
                classificacoes: 0
            },
            classificacao: {
                notas: 0,
                mediaNotas: 0
            }
        };
        informacoesUsuario(res, resposta);
    });

    var informacoesUsuario = function(res, resposta) {
        Usuario.findById(resposta.usuarioId, function(err, usuario){
            if(err) {
                res.json({status:"n", mensagem:err});
            } else {
                resposta.usuario = usuario;
                informacoesTutoriais(res, resposta);
            }
        });
    };

    var informacoesTutoriais = function(res, resposta) {
        Tutorial.find({autor: resposta.usuarioId}, function(err, tutoriais){
            if(err) {
                res.json({status:"n", mensagem:err});
            } else {
                resposta.numeros.tutoriais = tutoriais.length; 
                informacoesClassificacoes(res, resposta);  
            }
        });
    };

    var informacoesClassificacoes = function(res, resposta) {
        Classificacao.find({classificador: resposta.usuarioId}, function(err, classificacoes){
            if(err) {
                res.json({status:"n", mensagem:err});
            } else {
                resposta.numeros.classificacoes = classificacoes.length;
                informacoesNotas(res, resposta);
            }
        });
    };

    var informacoesNotas = function(res, resposta) {
        Classificacao.find({autor: resposta.usuarioId}, function(err, classificacoes){
            if(err) {
                res.json({status:"n", mensagem:err});
            } else {
                var classificacoesTamanho = classificacoes.length;
                var notasTotal = 0;
                classificacoes.forEach(function(classificacao){
                    notasTotal += classificacao.nota;
                });
                resposta.classificacao = {
                    notas: notasTotal,
                    mediaNotas: notasTotal / classificacoesTamanho
                };
                res.json({mensagem:"Estatísticas e informações do usuário consultadas com sucesso.", status:"s", dados: resposta});
            }
        });
    };

    return router;

};