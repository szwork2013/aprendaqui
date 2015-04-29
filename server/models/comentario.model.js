var mongoose = require('mongoose');

var ComentarioSchema = new mongoose.Schema({
    texto: { type: String, minlength: 5, maxlength: 100, required: true },
    tutorial: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutorial', required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    data: { type: Date, default: Date.now, required: true }
}, {collection: 'comentario'});

mongoose.model('Comentario', ComentarioSchema);