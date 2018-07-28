const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

const fs = require('fs');

var imgDir = `${__dirname}/img`;
var logsDir = `${__dirname}/logs`;

app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
	res.redirect('index.html');
});  

app.get('/index', (req, res) => {
	res.redirect('index.html');
});

app.get('/logs.txt', (req, res) => {
	res.sendFile(`${logsDir}/logs.txt`);
});

app.get('/img/ftax.png', (req, res) => {
	res.sendFile(`${imgDir}/ftax.png`);
});

io.on('connection', (socket) => {
	socket.on('start', (fechaHora) => {
		io.emit('start', {response : 'ok', fechaHora : fechaHora});
		fs.appendFile('./logs.txt', '[' + fechaHora + '] Inicio de conexión con el servidor');
		//io.broadcast.emit('start', {response : 'ok', fechaHora : fechaHora});
	});

	socket.on('sinInternet', (fechaHora) => {
		io.emit('sinInternet', {response : 'ok', fechaHora : fechaHora});
		fs.appendFile('./logs.txt', '[' + fechaHora + '] Celular sin conexión');
	});

	socket.on('reconexion', (fechaHora) => {
		io.emit('reconexion', {response : 'ok', fechaHora : fechaHora});
		fs.appendFile('./logs.txt', '[' + fechaHora + '] El celular se ha reconectado');
	});

	socket.on('stop', (fechaHora) => {
		io.emit('stop', {response : 'ok', fechaHora : fechaHora});
		fs.appendFile('./logs.txt', '[' + fechaHora + '] Fin de la prueba\n');
		//io.broadcast.emit('stop', {response : 'ok', fechaHora : fechaHora});
	});
});

http.listen(port, () => {
	console.log("Servidor escuchando en el puerto " + port + "!");
});