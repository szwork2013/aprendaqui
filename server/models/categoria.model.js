var mongoose = require('mongoose');

var CategoriaSchema = new mongoose.Schema({
    nome: { type: String, minlength: 1, maxlength: 40, required: true },
    data: { type: Date, default: Date.now, required: true },
    ativa: { type: Boolean, default: true, required: true },
    criador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, {collection: 'categoria'});

mongoose.model('Categoria', CategoriaSchema);