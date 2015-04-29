module.exports = function(passport) {

    var express = require('express');
    var router = express.Router();
    var fs = require('fs');

    var config = require('./../config');

    var FacebookStrategy = require('passport-facebook').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var LocalStrategy = require('passport-local').Strategy;

    var mongoose = require('mongoose');
    var Usuario = mongoose.model('Usuario');
    var utils = require('./../utils');

    // =====================================
    // SERIALIZADOR ========================
    // =====================================

    /**
     * Serializa um usuário para o passport.
     */
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    /**
     * Deserializa um usuário para o passport.
     */
    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================

    /**
     * Autentica e/ou cadastra usuário pelo facebook.
     */
    passport.use(new FacebookStrategy({
            clientID: config.oauth.facebook.api_key,
            clientSecret: config.oauth.facebook.api_secret,
            callbackURL: config.oauth.facebook.callback_url
        },
        function(accessToken, refreshToken, profile, done) {
            Usuario.findOne({ oauthID: profile.id }, function(err, usuario) {
                if (!err && usuario !== null && usuario !== undefined) {
                    if(usuario.nome != profile.name.givenName) {
                        usuario.nome = profile.name.givenName;
                    }
                    usuario.save();
                    done(null, usuario);
                } else {
                    var _usuario = new Usuario({
                        nome: profile.name.givenName,
                        oauthID: profile.id,
                        fotoPath: 'https://graph.facebook.com/' + profile.id + '/picture?type=large',
                        isSocial: true,
                        socialType: 'facebook'
                    });
                    _usuario.save(function (err, usuario) {
                        if (!err) {
                            done(null, usuario);
                        }
                    });
                }
            });
        }
    ));

    /**
     * Autentica um usuário pelo facebook.
     */
    router.get('/autenticar/facebook', passport.authenticate('facebook'));

    /**
     * Callback que será chamado após o usuário ser autenticado.
     */
    router.get('/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/autenticar/facebook'
    }));

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================

    /**
     * Autentica e/ou cadastra usuário pelo Google.
     */
    passport.use(new GoogleStrategy({
            clientID        : config.oauth.google.clientID,
            clientSecret    : config.oauth.google.clientSecret,
            callbackURL     : config.oauth.google.callbackURL
        },
        function(token, refreshToken, profile, done) {
            Usuario.findOne({ oauthID: profile.id }, function(err, usuario) {
                if (!err && usuario !== null && usuario !== undefined) {
                    if(usuario.fotoPath != profile._json.image.url.split('?')[0]) {
                        usuario.fotoPath = profile._json.image.url.split('?')[0];
                    }
                    usuario.save();
                    done(null, usuario);
                } else {
                    var _usuario = new Usuario({
                        nome: profile.name.givenName,
                        oauthID: profile.id,
                        isSocial: true,
                        fotoPath: profile._json.image.url.split('?')[0],
                        socialType: 'google'
                    });
                    _usuario.save(function (err, usuario) {
                        if (!err) {
                            done(null, usuario);
                        }
                    });
                }
            });

        }
    ));

    /**
     * Autentica um usuário pelo Google.
     */
    router.get('/autenticar/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    /**
     * Callback que será chamado após o usuário ser autenticado.
     */
    router.get('/google/callback', passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/autenticar/google'
    }));

    // =====================================
    // LOCAL ROUTES ========================
    // =====================================

    /**
     * Passport local strategy para autenticar usuário.
     */
    passport.use(new LocalStrategy({
        usernameField : 'email',
        passwordField : 'senha'
    },
        function(email, senha, done) {
            Usuario.findOne({email:email, isSocial: false}, function(err, usuario){
                if(err) {
                    return done(null, false, {mensagem:err, status:"n"});
                } else if(!usuario) {
                    return done(null, false, {mensagem:"O usuário não existe.", status:"n"});
                } else if(!utils.senhaHash.validarSenha(senha, usuario.senha)) {
                    return done(null, false, {mensagem:"A senha está incorreta.", status:"n"});
                } else {
                    return done(null, usuario);
                }
            });
        }
    ));

    /**
     * Autenticar usuário locamente.
     */
    router.post('/autenticar', function(req, res, next) {
        passport.authenticate('local', function(err, usuario, resposta) {
            if (err) {
                return next(err);
            }
            if (!usuario) {
                res.json(resposta);
            } else {
                req.logIn(usuario, function(err) {
                    if (err) {
                        return next(err);
                    }
                    return res.json(usuario);
                });
            }
        })(req, res, next);
    });

    /**
     * Cadastrar usuário localmente.
     */
    router.post('/cadastrar', function(req, res){
        if(!req.body.senha || !req.body.email || !req.files.file) {
            res.json({status:"n", mensagem:"Existem campos que não estão sendo enviados."});
        } else {
            var usuario = {
                email: req.body.email,
                nome: req.body.nome,
                senha: utils.senhaHash.gerarHash(req.body.senha),
                isSocial: false,
                fotoPath: "/uploads/" + req.files.file.name
            };
            if(req.files.file) {
                Usuario.findOne({email:usuario.email}, function(err, usuarioExiste){
                    if(err) {
                        res.json({mensagem:err, status:"n"});
                    } else if(usuarioExiste) {
                        res.json({status:"n", mensagem:"O e-mail já está sendo utilizado por outro usuário."});
                    } else {
                        Usuario.create(usuario, function(err, usuario) {
                            if(err) {
                                res.json({mensagem:err, status:"n"});
                            } else {
                                res.json({status:"s", mensagem:"Usuário cadastrado com sucesso."});
                            }
                        });
                    }
                });   
            } else {
                res.json({status:"n", mensagem:"O cadastro não foi efetuado, o arquivo enviado deve ser uma imagem.", dados:{}});
            }
        }
    });
    
    /**
     * Alterar senha do usuário.
     */
    router.post('/senha/alterar', utils.sessao.verificarAutenticacaoUsuario, function(req, res){
        var usuario = req.user;
        var senha = req.body.senha;
        Usuario.findById(usuario._id, function(err, usuarioExiste){
            if(err) {
                res.json({mensagem:err, status:"n"});
            } else if(usuarioExiste && !utils.senhaHash.validarSenha(senha.antiga, usuarioExiste.senha)) {
                res.json({status:"n", mensagem:"A senha antiga está incorreta."});
            } else if(usuarioExiste) {
                usuarioExiste.senha = utils.senhaHash.gerarHash(senha.nova);
                usuarioExiste.save(function(err, usuario) {
                    if(err) {
                        res.json({mensagem:err, status:"n"});
                    } else {
                        res.json({status:"s", mensagem:"A senha foi alterada com sucesso."});
                    }
                });
            } else {
                res.json({status:"n", mensagem:"Autentique novamente e tente de novo."});
            }
        });
    });

    /**
     * Alterar foto do usuário.
     */
    router.post('/foto/alterar', utils.sessao.verificarAutenticacaoUsuario, function(req, res){
        var fotoPath = req.user.fotoPath.substring(1);
        var novoFotoPath = "/uploads/" + req.files.file.name;
        var usuarioId = req.user._id;
        if(req.files.file) {
            fs.unlink(fotoPath, function(err) {
                if(err) {
                    res.json({status:"n", mensagem:err});
                }
                Usuario.findByIdAndUpdate(usuarioId, {fotoPath: novoFotoPath}, function(err, usuario){
                    if(err) {
                        res.json({status:"n", mensagem:err});
                    }
                    req.user.fotoPath = novoFotoPath;
                    res.json({status:"s", mensagem:"A foto foi alterada com sucesso.", dados:{fotoPath: novoFotoPath}});
                });
            });
        } else {
            res.json({status:"n", mensagem:"A foto não foi alterada, o arquivo enviado deve ser uma imagem.", dados:{}});
        }
    });

    // =====================================
    // GERAL ROUTES ========================
    // =====================================

    /**
     * Verificar se um usuário está autenticado.
     */
    router.get('/autenticado', function(req, res){
        if(req.user) {
            if(req.user.senha) {
                delete req.user.senha;
            }
            res.json({
                usuario: req.user,
                autenticado: true
            });
        } else {
            res.json({
                usuario: {},
                autenticado: false
            });
        }
    });

    /**
     * Deslogar usuário.
     */
    router.post('/sair', function(req, res){
        req.logout();
        res.redirect('/');
    });

    return router;

};
