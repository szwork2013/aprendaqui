/**
 * Este script possui rotas de categoria e subcategoria.
 */

module.exports = function() {

    var express = require('express');
    var router = express.Router();

    var mongoose = require('mongoose');
    var Categoria = mongoose.model('Categoria');
    var Subcategoria = mongoose.model('Subcategoria');
    var utils = require('./../utils');

    /**
     * Cadastrar Categorias.
     */
    router.post('/cadastrar', utils.sessao.verificarAutenticacaoAdmin, function(req, res){
        var categoria = req.body.categoria;
        categoria.criador = req.user._id;
        Categoria.findOne({nome:categoria.nome}, function(err, categoriaExiste){
            if(err) {
                res.json({mensagem:err, status:"n"});
            } else if(categoriaExiste) {
                res.json({status:"n", mensagem:"Já existe uma categoria com este nome."});
            } else {
                Categoria.create(categoria, function(err, categoria) {
                    if(err) {
                        res.json({mensagem:err, status:"n"});
                    } else {
                        res.json({mensagem:"Categoria cadastrada com sucesso.", status:"s"});
                    }
                });
            }
        });
    });

    /**
    * Cadastrar Subcategorias.
    */
    router.post('/cadastrar/sub', utils.sessao.verificarAutenticacaoAdmin, function(req, res){
        var subcategoria = req.body.subcategoria;
        subcategoria.criador = req.user._id;
        Subcategoria.findOne({nome:subcategoria.nome}, function(err, subcategoriaExiste){
            if(err) {
                res.json({mensagem:err, status:"n"});
            } else if(subcategoriaExiste) {
                res.json({status:"n", mensagem:"Já existe uma subcategoria com este nome."});
            } else {
                Subcategoria.create(subcategoria, function(err, subcategoria) {
                    if(err) {
                        res.json({mensagem:err, status:"n"});
                    } else {
                        res.json({mensagem:"Subcategoria cadastrada com sucesso.", status:"s"});
                    }
                });
            }
        });
    });

    /**
     * Listar todas as categorias e subcategorias.
     */
    router.get('/listar/grupo', function(req, res){
        Categoria.find({ativa: true}).sort({'nome': 1}).exec(function(err, categorias){
            if(err) {
                res.json({mensagem:err, status:"n", dados: []});
            } else {
                if(categorias.length === 0) {
                    res.json({mensagem:"Não existem categorias cadastradas.", status:"s", dados: []});
                }
                var dados = [], _subCategorias = [];
                categorias.forEach(function(categoria, index){
                    Subcategoria.find({categoria: categoria._id}).sort({'nome': 1}).exec(function(err, subcategorias){
                        if(err) {
                            res.json({mensagem:err, status:"n", dados: []});
                        } else {
                            _subCategorias = [];
                            subcategorias.forEach(function(subcategoria){
                                if(subcategoria.ativa) {                  
                                    _subCategorias.push({
                                        _id: subcategoria._id,
                                        nome: subcategoria.nome
                                    });
                                }
                            });
                            dados.push({
                                _id: categoria._id,
                                nome: categoria.nome,
                                subcategorias: _subCategorias
                            });
                        }
                        if(categorias.length == index+1) {
                            res.json({mensagem:"Categorias consultadas com sucesso.", status:"s", dados: dados});
                        }
                    });
                });
            }
        });
    });

    /**
     * Listar todas as categorias.
     */
    router.get('/listar', utils.sessao.verificarAutenticacaoAdmin, function(req, res){
        Categoria.find({}).populate('criador', 'nome').sort({ativa: -1}).exec(function(err, categorias){
            if(err) {
                res.json({mensagem:err, status:"n", dados: []});
            } else {
                res.json({mensagem:"Categorias consultadas com sucesso.", status:"s", dados: categorias});
            }
        });
    });

    /**
     * Listar todas as subcategorias.
     */
    router.get('/listar/sub', utils.sessao.verificarAutenticacaoAdmin, function(req, res){
        Subcategoria.find({}).populate('criador', 'nome').populate('categoria').sort({ativa: -1}).exec(function(err, categorias){
            if(err) {
                res.json({mensagem:err, status:"n", dados: []});
            } else {
                res.json({mensagem:"Subcategorias consultadas com sucesso.", status:"s", dados: categorias});
            }
        });
    });

    /**
     * Desativa uma categoria.
     */
    router.post('/desativar', utils.sessao.verificarAutenticacaoAdmin, function(req, res){
        var categoriaId = req.body.categoria.id;
        Categoria.findByIdAndUpdate(categoriaId, {ativa: false}, function(err, categoria){
            if(err) {
                res.json({status:"n", mensagem:err});
            }
            res.json({status:"s", mensagem:"A categoria foi desativada com sucesso."});
        });
    });

    /**
     * Ativa uma categoria.
     */
    router.post('/ativar', utils.sessao.verificarAutenticacaoAdmin, function(req, res){
        var categoriaId = req.body.categoria.id;
        Categoria.findByIdAndUpdate(categoriaId, {ativa: true}, function(err, categoria){
            if(err) {
                res.json({status:"n", mensagem:err});
            }
            res.json({status:"s", mensagem:"A categoria foi ativada com sucesso."});
        });
    });

    /**
     * Desativa uma subcategoria.
     */
    router.post('/desativar/sub', utils.sessao.verificarAutenticacaoAdmin, function(req, res){
        var subcategoriaId = req.body.subcategoria.id;
        Subcategoria.findByIdAndUpdate(subcategoriaId, {ativa: false}, function(err, subcategoria){
            if(err) {
                res.json({status:"n", mensagem:err});
            }
            res.json({status:"s", mensagem:"A subcategoria foi desativada com sucesso."});
        });
    });

    /**
     * Ativa uma subcategoria.
     */
    router.post('/ativar/sub', utils.sessao.verificarAutenticacaoAdmin, function(req, res){
        var subcategoriaId = req.body.subcategoria.id;
        Subcategoria.findByIdAndUpdate(subcategoriaId, {ativa: true}, function(err, subcategoria){
            if(err) {
                res.json({status:"n", mensagem:err});
            }
            res.json({status:"s", mensagem:"A subcategoria foi ativada com sucesso."});
        });
    });

    return router;

};