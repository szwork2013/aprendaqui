var mongoose = require('mongoose');

var UsuarioSchema = new mongoose.Schema({
    email: { type: String, minlength: 5, maxlength: 100 },
    nome: { type: String, minlength: 3, maxlength: 100, required: true },
    senha: { type: String, minlength: 5, maxlength: 100 },
    fotoPath: { type: String, minlength: 1, maxlength: 1000 },
    oauthID: { type: Number },
    isSocial: { type: Boolean, required: true },
    socialType: { type: String, enum: ['google', 'facebook'] },
    admin: { type: Boolean, default: false, required: true },
    data: { type: Date, default: Date.now, required: true }
}, {collection: 'usuario'});

mongoose.model('Usuario', UsuarioSchema);