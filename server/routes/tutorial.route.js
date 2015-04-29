module.exports = function() {

    var express = require('express');
    var router = express.Router();

    var mongoose = require('mongoose');
    var Tutorial = mongoose.model('Tutorial');
    var Categoria = mongoose.model('Categoria');
    var Subcategoria = mongoose.model('Subcategoria');
    var Classificacao = mongoose.model('Classificacao');
    var utils = require('./../utils');

    var LIMITE_GRID_PRINCIPAL = 6;

    /**
     * Cadastra um tutorial.
     */
    router.post('/cadastrar', utils.sessao.verificarAutenticacaoUsuario, function(req, res){
        var tutorial = req.body.tutorial;
        tutorial.categoria = tutorial.categoria._id;
        tutorial.subcategoria = tutorial.subcategoria._id;
        Tutorial.findOne({titulo:tutorial.titulo}, function(err, tutorialExiste){
            if(err) {
                res.json({mensagem:err, status:"n"});
            } else if(tutorialExiste) {
                res.json({status:"n", mensagem:"Já existe um tutorial com este título."});
            } else {
                Tutorial.create(tutorial, function(err, tutorial) {
                    if(err) {
                        res.json({mensagem:err, status:"n"});
                    } else {
                        res.json({status:"s", mensagem:"Tutorial cadastrado com sucesso.", dados: tutorial});
                    }
                });
            }
        });
    });

    /**
     * Desativa um tutorial.
     */
    router.post('/desativar', utils.sessao.verificarAutenticacaoUsuario, function(req, res){
        var tutorialId = req.body.tutorial.id;
        var usuarioId = req.user._id;
        Tutorial.findOneAndUpdate({_id: tutorialId, autor: usuarioId}, {ativo: false}, function(err, tutorial){
            if(err) {
                res.json({status:"n", mensagem:err});
            }
            if(tutorial) {
                res.json({status:"s", mensagem:"O tutorial foi desativado com sucesso."});
            } else {
                res.json({status:"n", mensagem:"Você não possui nenhum tutorial com estes dados."});
            }
        });
    });

    /**
     * Ativa um tutorial.
     */
    router.post('/ativar', utils.sessao.verificarAutenticacaoUsuario, function(req, res){
        var tutorialId = req.body.tutorial.id;
        var usuarioId = req.user._id;
        Tutorial.findOneAndUpdate({_id: tutorialId, autor: usuarioId}, {ativo: true}, function(err, tutorial){
            if(err) {
                res.json({status:"n", mensagem:err});
            }
            if(tutorial) {
                res.json({status:"s", mensagem:"O tutorial foi ativado com sucesso."});
            } else {
                res.json({status:"n", mensagem:"Você não possui nenhum tutorial com estes dados."});
            }
        });
    });

    /**
     * Suspende um tutorial.
     */
    router.post('/suspender', utils.sessao.verificarAutenticacaoAdmin, function(req, res){
        var tutorial = req.body.tutorial;
        Tutorial.findByIdAndUpdate(tutorial.id, {"suspensao.suspenso": true, "suspensao.motivo": tutorial.motivo}, function(err, tutorial){
            if(err) {
                res.json({status:"n", mensagem:err});
            }
            res.json({status:"s", mensagem:"O tutorial foi suspenso com sucesso."});
        });
    });

    /**
     * Desuspende um tutorial.
     */
    router.post('/desuspender', utils.sessao.verificarAutenticacaoAdmin, function(req, res){
        var tutorial = req.body.tutorial;
        Tutorial.findByIdAndUpdate(tutorial.id, {"suspensao.suspenso": false, "suspensao.motivo": ""}, function(err, tutorial){
            if(err) {
                res.json({status:"n", mensagem:err});
            }
            res.json({status:"s", mensagem:"O tutorial foi desuspenso com sucesso."});
        });
    });

    /**
     * Atualizar Tutorial.
     */
    router.post('/atualizar', utils.sessao.verificarAutenticacaoUsuario, function(req, res){
        var tutorial = req.body.tutorial;
        var usuarioId = req.user._id;
        Tutorial.findOneAndUpdate({_id: tutorial.id, autor: usuarioId}, {texto: tutorial.texto}, function(err, tutorial){
            if(err) {
                res.json({status:"n", mensagem:err});
            }
            if(tutorial) {
                res.json({status:"s", mensagem:"O tutorial foi atualizado com sucesso."});
            } else {
                res.json({status:"n", mensagem:"Você não possui nenhum tutorial com estes dados."});
            }
        });
    });

    /**
     * Alterar Tutorial.
     */
    router.post('/alterar', utils.sessao.verificarAutenticacaoAdmin, function(req, res){
        var tutorial = req.body.tutorial;
        var alteracao = {
            titulo: req.body.tutorial.titulo,
            descricao: req.body.tutorial.descricao,
            categoria: req.body.tutorial.categoria,
            subcategoria: req.body.tutorial.subcategoria,
            texto: req.body.tutorial.texto
        };
        Tutorial.findByIdAndUpdate(tutorial.id, alteracao, function(err, tutorial){
            if(err) {
                res.json({status:"n", mensagem:err});
            }
            res.json({status:"s", mensagem:"O tutorial foi alterado com sucesso."});
        });
    });

    /**
     * Lista todos os tutoriais cadastrados.
     */
    router.get('/listar', utils.sessao.verificarAutenticacaoAdmin, function(req, res){
        Tutorial.find({}, 'titulo categoria subcategoria suspensao ativo').populate('categoria', 'nome').populate('subcategoria', 'nome').exec(function(err, tutoriais) {
            if(err) {
                res.json({mensagem:err, status:"n", dados: []});
            } else {
                res.json({mensagem:"Tutoriais consultados com sucesso.", status:"s", dados: tutoriais});
            }
        });
    });

    /**
     * Lista todos os tutoriais recém cadastrados.
     */
    router.get('/listar/recentes', function(req, res){
        Tutorial.find({ativo: true, "suspensao.suspenso": false}, 'titulo descricao').sort({'data': -1}).limit(LIMITE_GRID_PRINCIPAL).exec(function(err, tutoriais) {
            if(err) {
                res.json({mensagem:err, status:"n", dados: []});
            } else {
                res.json({mensagem:"Tutoriais consultados com sucesso.", status:"s", dados: tutoriais});
            }
        });
    });

    /**
     * Lista todos os tutoriais do usuário autenticado.
     */
    router.get('/listar/autenticado', utils.sessao.verificarAutenticacaoUsuario, function(req, res){
        var usuarioId = req.user._id;
        Tutorial.find({autor: usuarioId}, 'titulo categoria subcategoria suspensao ativo').populate('categoria', 'nome').populate('subcategoria', 'nome').exec(function(err, tutoriais) {
            if(err) {
                res.json({mensagem:err, status:"n", dados: []});
            } else {
                res.json({mensagem:"Tutoriais consultados com sucesso.", status:"s", dados: tutoriais});
            }
        });
    });

    /**
     * Lista todos os tutoriais de uma determinada categoria.
     */
    router.get('/listar/:categoria', function(req, res){
        var categoria = req.params.categoria;
        Tutorial.find({categoria: categoria, ativo: true, "suspensao.suspenso": false}, 'titulo descricao', function(err, tutoriais) {
            if(err) {
                res.json({mensagem:err, status:"n", dados: []});
            } else {
                Categoria.findById(categoria, function(err, categoria){
                   if(err) {
                        res.json({mensagem:err, status:"n", dados: []});
                    } else {
                        var dados = {
                            nome: categoria.nome,
                            tutoriais: tutoriais
                        };
                        res.json({mensagem:"Tutoriais consultados com sucesso.", status:"s", dados: dados});
                    }
                });
            }
        });
    });

    /**
     * Lista todos os tutoriais de uma determinada subcategoria.
     */
    router.get('/listar/sub/:subcategoria', function(req, res){
        var subcategoria = req.params.subcategoria;
        Tutorial.find({subcategoria: subcategoria, ativo: true, "suspensao.suspenso": false}, 'titulo descricao', function(err, tutoriais) {
            if(err) {
                res.json({mensagem:err, status:"n", dados: []});
            } else {
                Subcategoria.findById(subcategoria).populate('categoria').exec(function(err, subcategoria){
                   if(err) {
                        res.json({mensagem:err, status:"n", dados: []});
                    } else {
                        var dados = {
                            nome: subcategoria.nome,
                            tutoriais: tutoriais,
                            categoria: {
                                id: subcategoria.categoria._id,
                                nome: subcategoria.categoria.nome
                            }
                        };
                        res.json({mensagem:"Tutoriais consultados com sucesso.", status:"s", dados: dados});
                    }
                });
            }
        });
    });

    /**
     * Consulta um determinado tutorial pelo seu ID.
     */
    router.post('/consultar', function(req, res){
        var tutorialId = req.body.tutorial;
        var usuarioId = req.body.usuario;
        var filtro = {_id: tutorialId, ativo: true, "suspensao.suspenso": false};
        if(req.user && req.user.admin) {
            filtro = {_id: tutorialId};
        }
        Tutorial.findOne(filtro).populate('autor', 'nome fotoPath').populate('categoria', 'nome').populate('subcategoria', 'nome').exec(function(err, tutorial) {
            if(!tutorial) {
                res.json({mensagem:"Não existe um tutorial com este identificador.", erro:err, status:"n", dados: {}});
            } else {
                Classificacao.find({tutorial: tutorialId}, function(err, classificacoes) {
                    var totalNotas = 0;
                    var mediaNotas = 0;
                    if(classificacoes.length > 0) {
                        classificacoes.forEach(function(classificacao){
                            totalNotas += classificacao.nota;
                        });
                        mediaNotas = totalNotas / classificacoes.length;
                    }
                    var dados = JSON.parse(JSON.stringify(tutorial));
                    dados.mediaNotas = mediaNotas;
                    if(usuarioId && tutorial) {
                        Classificacao.findOne({tutorial: tutorialId, classificador: usuarioId}, function(err, classificacao){
                           if(err) {
                                res.json({mensagem:err, status:"n", dados: {}});
                            } else {
                                if(classificacao) {
                                    dados.nota = classificacao.nota;
                                }
                                res.json({mensagem:"Tutorial consultado com sucesso.", status:"s", dados: dados});
                            }
                        });
                    } else {
                        if(tutorial) {
                            res.json({mensagem:"Tutorial consultado com sucesso.", status:"s", dados: dados});
                        } else {
                            res.json({mensagem:"O tutorial com este identificador está desativado ou suspenso.", status:"n", dados: {}});
                        }
                    }
                });
            }
        });
    });

    /**
     * Consulta um determinado tutorial pelo seu ID e retorna o seu texto.
     */
    router.post('/consultar/texto', utils.sessao.verificarAutenticacaoUsuario, function(req, res){
        var tutorialId = req.body.tutorial;
        var usuarioId = req.body.usuario;
        Tutorial.findOne({_id: tutorialId, autor: usuarioId}, 'titulo texto', function(err, tutorial) {
            if(err) {
                res.json({mensagem:err, status:"n", dados: {}});
            }
            if(!tutorial) {
                res.json({mensagem:"Não existe um tutorial com este identificador.", erro:err, status:"n", dados: {}});
            } else {
                res.json({mensagem:"Tutorial consultado com sucesso.", status:"s", dados: tutorial});
            }
        });
    });

    /**
     * Consulta tutoriais pelo titulo e estrelas.
     */
    router.get('/consultar/:filtro', function(req, res){
        var filtro = req.params.filtro;
        if(filtro.indexOf('*') === 0) {
            var estrelas = filtro.split('*')[1]; 
            Classificacao.find({nota: estrelas}).populate('tutorial', 'titulo descricao').exec(function(err, tutoriais){
               if(err) {
                    res.json({mensagem:err, status:"n", dados: {}});
                } else {
                    res.json({mensagem:"Tutoriais consultados com sucesso.", status:"s", dados: {tutoriais: tutoriais, tipo: 'estrelas'}});
                }
            });
        } else {
            Tutorial.find({ $or: [ {titulo: new RegExp(filtro, 'i')}, {descricao: new RegExp(filtro, 'i')}], ativo: true, "suspensao.suspenso": false }, 'titulo descricao', function(err, tutoriais) {
                if(err) {
                    res.json({mensagem:err, status:"n", dados: []});
                } else {
                    res.json({mensagem:"Tutoriais consultados com sucesso.", status:"s", dados: {tutoriais: tutoriais, tipo: 'nome'}});
                }
            });
        }
    });

    /**
     * Classifica um determinado tutorial.
     */
    router.post('/classificar', utils.sessao.verificarAutenticacaoUsuario, function(req, res){
        var classificacao = req.body.classificacao;
        classificacao.classificador = req.user._id;
        Classificacao.findOne({classificador:classificacao.classificador, tutorial:classificacao.tutorial}, function(err, classificacaoExiste){
            if(err) {
                res.json({mensagem:err, status:"n"});
            } else if(classificacaoExiste) {
                classificacaoExiste.nota = classificacao.nota;
                classificacaoExiste.save();
                res.json({status:"s", mensagem:"Classificação atualizada com sucesso."});
            } else {
                Classificacao.create(classificacao, function(err, classificacao) {
                    if(err) {
                        res.json({mensagem:err, status:"n"});
                    } else {
                        res.json({status:"s", mensagem:"Classificação cadastrada com sucesso."});
                    }
                });
            }
        });
    });

    return router;

};