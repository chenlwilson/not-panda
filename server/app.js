const express = require('express');
const path = require('path');
const parser = require('body-parser');
const predictor = require('../data/predictor.js');
// const tester = require('../data/tester.js');
const getAsync = require('../data/helper/getDrawing.js');
const getRandom = require('../data/helper/getRandom.js');

const app = express();

app.use(express.static(path.join(__dirname, '../dist')));
app.use(parser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/predict', (req, res) => {
  const coordinates = req.body;
  if (coordinates.length === 0) {
    res.send({ name: 'others' });
  } else {
    predictor(coordinates)
      .then((name) => {
        console.log(`app post: ${name}`);
        res.send({ name });
      });
  }
});

app.get('/random', (req, res) => {
  getRandom('panda')
    .then((data) => {
      const result = [];
      data.forEach((d) => {
        const single = [];
        d.drawing.forEach((stroke) => {
          const newStroke = [];
          for (let i = 0; i < stroke[0].length; i += 1) {
            const tuple = [];
            tuple.push(stroke[0][i]);
            tuple.push(stroke[1][i]);
            newStroke.push(tuple);
          }
          single.push(newStroke);
        });
        result.push(single);
      });
      res.send({ result });
    });
});

app.get('/test', (req, res) => {
  getAsync('draw_10', Math.floor(Math.random() * 11000), 10)
    .then((data) => {
      const draw = data[4].drawing;
      const single = [];
      draw.forEach((stroke) => {
        const newStroke = [];
        for (let i = 0; i < stroke[0].length; i += 1) {
          const tuple = [];
          tuple.push(stroke[0][i]);
          tuple.push(stroke[1][i]);
          newStroke.push(tuple);
        }
        single.push(newStroke);
      });
      console.log(data[4].word);
      res.send({ single });
    });
});

module.exports = app;
