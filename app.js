const express = require('express');
const exphbs  = require('express-handlebars');
const morgan = require('morgan');
const mercadopago = require('mercadopago');

const ACCESS_TOKEN = require('./config/config').ACCESS_TOKEN;
 
const app = express();

app.use(morgan("dev"));

app.set('port', process.env.PORT || 3000);
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

mercadopago.configure({
  access_token: ACCESS_TOKEN
});


const crearPreferencia = (producto) => {

    let preferencia = {
      items: [
        {
          title: producto.title,
          unit_price: parseFloat(producto.price),
          quantity: parseInt(producto.unit)
        },
      ],
    };

    return preferencia;

};

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', async function (req, res) {

    const preferencia = crearPreferencia(req.query);

    await mercadopago.preferences.create(preferencia).then(function (response) {

      // Este valor reemplazará el string "<%= global.id %>" en tu HTML
      let respuesta = req.query;
      global.id = response.body.id;

      respuesta.global_id = global.id
      res.render('detail', req.query);
      
    }).catch(function (error) {
      console.log(error);
    });

});

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
 
// starting the server
app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
});