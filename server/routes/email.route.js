module.exports = function() {

    var express = require('express');
    var nodemailer = require("nodemailer");
    var router = express.Router();

    var config = require('./../config');
    var mongoose = require('mongoose');
    var Usuario = mongoose.model('Usuario');
    var utils = require('./../utils');

    var enviarEmail = function(novaSenha, email) {
        if (config.email.usuario !== '' && config.email.usuario !== '') {
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: config.email.usuario,
                    pass: config.email.senha
                }
            });
            var mailOptions = {
                from: 'APRENDAQUI' + '<' + config.email.usuario + '>',
                to: email,
                subject: 'Recuperação de Senha',
                text: 'A sua nova senha é: ' + novaSenha + ' altere-a assim que puder.'
            };
            transporter.sendMail(mailOptions, function(err, info) {
                if (err) {
                    console.log("Falha ao enviar o e-mail para " + email + ".");
                    console.log("\n" + err);
                }
            });
        }
    };

    /**
     * Enviar e-mail de recuperação de senha.
     */
    router.post('/recuperar/senha', function(req, res) {
        var email = req.body.email;
        Usuario.findOne({
            email: email
        }, function(err, usuario) {
            if (err) {
                res.json({
                    mensagem: err,
                    status: "n"
                });
            } else {
                if (usuario) {
                    if(config.email.usuario !== '' && config.email.usuario !== '') {
                        var senha = (Date.now() / 8) + 1 + '_psw_';
                        usuario.senha = utils.senhaHash.gerarHash(senha);
                        usuario.save(function(err) {
                            if (err) {
                                res.json({
                                    mensagem: err,
                                    status: "n"
                                });
                            } else {
                                var mensagem = "O e-mail com a nova senha será enviado dentro de alguns minutos para " + email + ".";
                                res.json({
                                    mensagem: mensagem,
                                    status: "s"
                                });
                                enviarEmail(senha, email);
                            }
                        });
                    } else {
                        var mensagem = "Opção de recuperação de senha desabilitada temporariamente.";
                        res.json({
                            mensagem: mensagem,
                            status: "s"
                        });
                    }
                } else {
                    res.json({
                        mensagem: "Não existe nenhum usuário com este e-mail.",
                        status: "n"
                    });
                }
            }
        });
    });

    return router;

};
