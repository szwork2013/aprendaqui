var mongoose = require('mongoose');

var TutorialSchema = new mongoose.Schema({
    titulo: { type: String, minlength: 5, maxlength: 50, required: true },
    descricao: { type: String, minlength: 5, maxlength: 100, required: true },
    texto: { type: String, minlength: 10, maxlength: 100000, required: true },
    data: { type: Date, default: Date.now, required: true },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
    subcategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategoria', required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    ativo: { type: Boolean, default: true, required: true },
    suspensao: {
    	suspenso: { type: Boolean, default: false, required: true },
    	motivo: { type: String, minlength: 5, maxlength: 400 }
    },
    preRequisitos: [String],
    posRequisitos: [String]
}, {collection: 'tutorial'});

mongoose.model('Tutorial', TutorialSchema);