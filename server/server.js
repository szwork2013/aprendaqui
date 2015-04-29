/* APRENDAQUI SERVER CONFIG */

/* Constantes */

var KEY = 'sessao';
var SECRET = 'secret';
var PORTA = 8600;

/* Bibliotecas */

var argv = require('yargs').argv;

var express = require('express');
var app = express();
var passport = require('passport');

var multer = require('multer');
var path = require('path');

var http = require('http').Server(app);
var io = require('socket.io')(http);

var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passportSocketIo = require("passport.socketio");

var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var store = new MongoStore({
    mongooseConnection: mongoose.connection
});

var config = require('./config');

/* Models */

require('./models/usuario.model.js');
require('./models/categoria.model.js');
require('./models/subcategoria.model.js');
require('./models/tutorial.model.js');
require('./models/comentario.model.js');
require('./models/classificacao.model.js');
require('./models/mensagem.model.js');
require('./models/denuncia.model.js');

/* Conexão com o banco de dados MongoDB */

mongoose.connect(config.database.mongodb_url);

/* Configurações da resposta */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/* Upload de Arquivos */

app.use(multer({
    dest: './uploads/',
    rename: function(fieldname, filename) {
        return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
    },
    onFileUploadStart: function(file, req, res) {
        if(file.mimetype.split("/")[0] != 'image') {
            return false;
        }
    }
}));

/* Sessão e Cookie */

app.use(cookieParser());
app.use(methodOverride());
app.use(session({
    store: store,
    secret: SECRET,
    name: KEY,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge:3600000 }
}));
app.use(passport.initialize());
app.use(passport.session());

/* Arquivos Estáticos */

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if(argv.dev) {
    app.use(express.static(path.join(__dirname, '/../client')));
} else {
    app.use(express.static(path.join(__dirname, '/../client/dist')));
}

/* Routes Instances */

var principal = require('./routes/principal.route.js')();
var usuario = require('./routes/usuario.route.js')(passport);
var categoria = require('./routes/categoria.route.js')();
var tutorial = require('./routes/tutorial.route.js')();
var comentario = require('./routes/comentario.route.js')();
var ranking = require('./routes/ranking.route.js')();
var email = require('./routes/email.route.js')();
var mensagem = require('./routes/mensagem.route.js')();
var denuncia = require('./routes/denuncia.route.js')();

/* Routes */

app.use('/principal', principal);
app.use('/usuario', usuario);
app.use('/categoria', categoria);
app.use('/tutorial', tutorial);
app.use('/comentario', comentario);
app.use('/ranking', ranking);
app.use('/email', email);
app.use('/mensagem', mensagem);
app.use('/denuncia', denuncia);

/* Web Sockets */

io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: KEY,
    secret: SECRET,
    store: store,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
}));

function onAuthorizeSuccess(data, accept) {
    accept();
}

function onAuthorizeFail(data, message, error, accept) {
    if (error) {
        throw new Error(message);
    }
    return accept(new Error(message));
}

require('./sockets/conexao.js')(io);

/* Inicialização */

http.listen(PORTA, function() {
    console.log('APRENDAQUI rodando na PORTA: ' + PORTA);
});
