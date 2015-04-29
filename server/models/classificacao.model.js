var mongoose = require('mongoose');

var ClassificacaoSchema = new mongoose.Schema({
    nota: { type: Number, min: 1, max: 5, required: true },
    data: { type: Date, default: Date.now, required: true },
    tutorial: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutorial', required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    classificador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, {collection: 'classificacao'});

mongoose.model('Classificacao', ClassificacaoSchema);