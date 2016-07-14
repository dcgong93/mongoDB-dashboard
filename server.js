var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/animals')
var BeaverSchema = new mongoose.Schema({
  name: String,
  age: Number,
  weight: Number
})
mongoose.model('Beaver', BeaverSchema);
var Beaver = mongoose.model('Beaver');

app.use(bodyParser.urlencoded({extended:true}));
var path = require('path');
app.use(express.static(path.join(__dirname, './client')));
app.set('views', path.join(__dirname, './client/views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  Beaver.find({}, function(err, beavers){
    res.render('index', {beavers:beavers});
  });
});
// NEW BEAVER FORM
app.get('/mongooses/new', function(req, res){
  res.render('new');
});
// POST NEW BEAVER
app.post('/mongooses', function(req, res){
  console.log("POST DATA", req.body);
  var beaver = new Beaver({
    name: req.body.name,
    age: req.body.age,
    weight: req.body.weight
  });
  beaver.save(function(err){
    if(err){
      console.log('something went wrong');
    } else {
      console.log('Successfully added');
      res.redirect('/')
    };
  });
});
// SHOW SINGLE
app.get('/mongooses/:id', function(req, res){
  Beaver.findOne({ _id : req.params.id}, function(err, beaver){
    res.render('show', {beaver:beaver});
  })
});
// EDIT SINGLE FORM
app.get('/mongooses/:id/edit', function(req, res){
  Beaver.findOne({ _id : req.params.id}, function(err, beaver){
    res.render('edit', {beaver:beaver});
  })
});
// POST EDIT
app.post('/mongooses/:id', function(req, res){
  Beaver.findByIdAndUpdate({_id:req.params.id}, {name: req.body.name, age: req.body.age, weight: req.body.weight}, function(err, result){
    res.redirect('/')
  });
})
// DELETE
app.post('/mongooses/:id/destroy', function(req, res){
  Beaver.remove({_id:req.params.id}, function(err, result){
    res.redirect('/')
  });
})

app.listen(8000,function(){
  console.log("listening on port 8000")
})
