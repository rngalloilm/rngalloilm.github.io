const path = require('path');
// Import our Express dependency
const express = require('express');
// Create a new server instance
const app = express();

//Configure handlebars tempalte engine
app.set('view engine', 'hbs')
app.set('views', 'templates')

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


const CountyDAO = require('./dao/CountyDAO');
const ParkDAO = require('./dao/ParkDAO');

app.get('/', (req, res) => {
  let data = {
    currentCounty: req.query.countyId //This is the selected county
  }
  CountyDAO.getCounties().then(counties => {
    data.counties = counties;
    return ParkDAO.getParksByCountyId(req.query.countyId);
  }).then(parks => {
    data.parks = parks;
    res.render('index', data);
  }).catch((error) => {
    console.log(error);
    res.status(404).render('error', {countyId: req.query.countyId});
  });
});

app.get('/park', (req, res) => {
  ParkDAO.getParkById(req.query.id).then(park => {
    res.render('park', {park: park});
  }).catch(() => {
    res.status(404).render('error', {id: req.query.id});
  })
});


// Port number we want to use on this server
const PORT = 3000;
// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));