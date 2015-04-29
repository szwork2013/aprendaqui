/* CONFIGURAÇÕES */

var database = require('./database');
var oauth = require('./oauth');
var email = require('./email');

module.exports = {
    database: database,
    oauth: oauth,
    email: email
};