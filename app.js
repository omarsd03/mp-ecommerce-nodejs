const express = require('express');
const exphbs  = require('express-handlebars');
const morgan = require('morgan');
 
 const app = express();

app.use(morgan("dev"));

app.set('port', process.env.PORT || 3000);
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
 
// starting the server
app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
});