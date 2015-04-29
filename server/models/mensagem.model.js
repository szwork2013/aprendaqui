var mongoose = require('mongoose');

var MensagemSchema = new mongoose.Schema({
    texto: { type: String, minlength: 5, maxlength: 1000, required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    leitor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    data: { type: Date, default: Date.now, required: true }
}, {collection: 'mensagem'});

mongoose.model('Mensagem', MensagemSchema);