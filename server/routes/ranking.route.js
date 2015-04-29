module.exports = function() {

    var express = require('express');
    var _ = require('underscore');
    var router = express.Router();

    var mongoose = require('mongoose');
    var Tutorial = mongoose.model('Tutorial');
    var Usuario = mongoose.model('Usuario');
    var Classificacao = mongoose.model('Classificacao');

    //Número de tutoriais por lista.
    var LIMITE_RANKING = 10;

    // =====================================
    // TUTORIAIS ===========================
    // =====================================

    /**
     * Lista os tutoriais com maior média de estrelas e classificações.
     */
    router.get('/tutoriais/melhores', function(req, res) {
        Classificacao.aggregate()
        .group({
            _id: "$tutorial",
            classificacoes:  { $sum: 1 },
            mediaNotas:  { $avg: '$nota' }
        })
        .limit(LIMITE_RANKING)
        .exec(function(err, ranking) {
            if(err) {
                res.json({mensagem:err, status:"n", dados: []});
            }
            Tutorial.populate(ranking, {path: "_id", select: "titulo descricao autor suspensao ativo"}, function(err, tutoriais){
                if(err) {
                    res.json({mensagem:err, status:"n", dados: []});
                }
                Usuario.populate(tutoriais, {path: "_id.autor", select:"nome _id"}, function(err, tutoriais){
                    if(err) {
                        res.json({mensagem:err, status:"n", dados: []});
                    }                
                    var resposta = [];
                    tutoriais.forEach(function(tutorial){
                        if(!tutorial._id.suspensao.suspenso && tutorial._id.ativo) {
                            resposta.push({
                                tutorial: tutorial._id,
                                classificacoes: tutorial.classificacoes,
                                mediaNotas: tutorial.mediaNotas
                            });
                        }
                    });
                    resposta = _.sortBy(resposta, function(tutorial) { 
                        return tutorial.classificacoes * tutorial.mediaNotas;
                    });
                    resposta.reverse();
                    res.json({mensagem:"Ranking de Tutoriais consultado com sucesso.", status:"s", dados: resposta});
                });
            });
        });
    });

    /**
     * Lista os tutoriais com maior média de estrelas
     */
    router.get('/tutoriais/estrelas/media', function(req, res) {
        Classificacao.aggregate()
        .group({
            _id: "$tutorial",
            mediaNotas:  { $avg: '$nota' } 
        })
        .sort({'mediaNotas': -1})
        .limit(LIMITE_RANKING)
        .exec(function(err, ranking) {
            if(err) {
                res.json({mensagem:err, status:"n", dados: []});
            }
            Tutorial.populate(ranking, {path: "_id", select: "titulo autor descricao suspensao ativo"}, function(err, tutoriais){
                if(err) {
                    res.json({mensagem:err, status:"n", dados: []});
                }
                Usuario.populate(tutoriais, {path: "_id.autor", select:"nome _id"}, function(err, tutoriais){
                    if(err) {
                        res.json({mensagem:err, status:"n", dados: []});
                    }                
                    var resposta = [];
                    tutoriais.forEach(function(tutorial){
                        if(!tutorial._id.suspensao.suspenso && tutorial._id.ativo) {
                            resposta.push({
                                tutorial: tutorial._id,
                                mediaNotas: tutorial.mediaNotas
                            });
                        }
                    });
                    res.json({mensagem:"Ranking de Tutoriais consultado com sucesso.", status:"s", dados: resposta});
                });
            });
        });
    });

    // =====================================
    // USUÁRIOS ============================
    // =====================================

    /**
     * Lista os usuários com maior número de estrelas e classifiações.
     */
    router.get('/usuarios/melhores', function(req, res) {
        Tutorial.find({ativo: true, "suspensao.suspenso": false}, '_id', function(err, resposta){
            var tutoriaisId = [];
            resposta.forEach(function(tutorial){
                tutoriaisId.push(tutorial._id);
            });
            Classificacao.aggregate({$match: {tutorial: {$in: tutoriaisId}}})
            .group({
                _id: "$autor",
                classificacoes:  { $sum: 1 },
                mediaNotas:  { $avg: '$nota' } 
            })
            .limit(LIMITE_RANKING)
            .exec(function(err, ranking) {
                if(err) {
                    res.json({mensagem:err, status:"n", dados: []});
                }
                Usuario.populate(ranking, {path: "_id", select:"nome _id"}, function(err, ranking){
                    if(err) {
                        res.json({mensagem:err, status:"n", dados: []});
                    }                
                    var resposta = [];
                    ranking.forEach(function(autor){
                        resposta.push({
                            autor: autor._id,
                            classificacoes: autor.classificacoes,
                            mediaNotas: autor.mediaNotas
                        });
                    });
                    resposta = _.sortBy(resposta, function(tutorial) { 
                        return tutorial.classificacoes * tutorial.mediaNotas;
                    });
                    resposta.reverse();
                    res.json({mensagem:"Ranking de Usuários consultado com sucesso.", status:"s", dados: resposta});
                });
            });
        });
    });

    /**
     * Lista os usuários com maior média de estrelas
     */
    router.get('/usuarios/estrelas/media', function(req, res) {
        Classificacao.aggregate()
        .group({
            _id: "$autor",
            mediaNotas:  { $avg: '$nota' } 
        })
        .sort({'mediaNotas': -1})
        .limit(LIMITE_RANKING)
        .exec(function(err, ranking) {
            if(err) {
                res.json({mensagem:err, status:"n", dados: []});
            }
            Usuario.populate(ranking, {path: "_id", select:"nome _id"}, function(err, ranking){
                if(err) {
                    res.json({mensagem:err, status:"n", dados: []});
                }                
                var resposta = [];
                ranking.forEach(function(autor){
                    resposta.push({
                        autor: autor._id,
                        mediaNotas: autor.mediaNotas
                    });
                });
                res.json({mensagem:"Ranking de Usuários consultado com sucesso.", status:"s", dados: resposta});
            });
        });
    });

    return router;

};
