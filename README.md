# APRENDAQUI

O objetivo do presente trabalho, é desenvolver uma plataforma colaborativa para aprendizagem a distância, onde os usuários irão compartilhar conhecimento, avaliar o conhecimento gerado e interagir entre si trocando experiências e aprendizados. Este projeto visa organizar o conhecimento em um só local, separando o conhecimento em categorias.

### Foram utilizadas as seguintes tecnologias para o desenvolvimento do trabalho:

* **Back-end:** Node.JS(Express, Mongoose, Socket.io);
* **Front-End:** HTML5(Jade), CSS3(Less), JavaScript(AngularJs, Gulp, Bower, Socket.io);
* **Banco de Dados:** MongoDB.

### Aplicativos necessários para a execução da aplicação:

- [Node.js](http://nodejs.org);
- [MongoDB](http://www.mongodb.org);
- [Gulp.js](http://gulpjs.com);
- [Jade](http://jade-lang.com);
- [Less](http://lesscss.org).

## 6 passos para a execução do back-end da aplicação:

1. Ir para a pasta server;
2. Executar o comando npm install, aguardar a instalação das depedências necessárias para execução da aplicação;
3. Configurar string de conexão do banco de dados no arquivo config/database.js;
4. Configurar e-mail no arquivo config/email.js para envio de recuperação de senhas;
5. Configurar credenciais OAuth para autenticação utilizando redes sociais;
6. Executar o script server.js com o Node.js.

## 4 passos para a execução do front-end da aplicação:

1. Ir para a pasta client;
2. Executar o comando bower install, aguradar a instalação das dependências do front-end;
3. Executar o comando npm install, aguardar a instalação das dependências do gulp;
4. Executar a tarefa do gulp, inicializar a aplicação através do comando 'gulp' para desenvolvimento ou 'gulp build' para produção.

## Dependências utilizadas no back-end ([NPM](https://www.npmjs.org)):

- bcrypt;
- body-parser;
- connect-mongo;
- cookie-parser;
- express
- express-session;
- method-override;
- mongoose;
- multer;
- nodemailer;
- passport;
- passport-facebook;
- passport-google-oauth;
- passport-local;
- passport.socketio;
- socket.io;
- underscore;
- yargs.

## Componentes utilizados no front-end ([Bower](http://bower.io)):

- jquery;
- bootstrap;
- angular-bootstrap;
- underscore;
- angular;
- angular-route;
- fontawesome;
- ng-file-upload;
- textAngular;
- socket.io;
- ng-table;
- angular-animate;
- angular-loading-bar.

## Dependências utilizadas no front-end ([NPM](https://www.npmjs.org)):

- gulp;
- gulp-clean;
- gulp-concat;
- gulp-html-replace;
- gulp-if;
- gulp-jade;
- gulp-less;
- gulp-livereload;
- gulp-minify-css;
- gulp-ng-annotate;
- gulp-uglify;
- gulp-util;
- yargs.