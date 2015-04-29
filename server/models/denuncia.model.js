var mongoose = require('mongoose');

var DenunciaSchema = new mongoose.Schema({
    motivo: { type: String, minlength: 5, maxlength: 400, required: true },
    denunciante: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    tutorial: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutorial', required: true },
    data: { type: Date, default: Date.now, required: true }
}, {collection: 'denuncia'});

mongoose.model('Denuncia', DenunciaSchema);