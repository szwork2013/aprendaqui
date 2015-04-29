var mongoose = require('mongoose');

var SubcategoriaSchema = new mongoose.Schema({
    nome: { type: String, minlength: 1, maxlength: 40, required: true },
    data: { type: Date, default: Date.now, required: true },
    ativa: { type: Boolean, default: true, required: true },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
    criador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, {collection: 'subcategoria'});

mongoose.model('Subcategoria', SubcategoriaSchema);