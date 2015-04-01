var keystone = require('keystone');

exports = module.exports = function (req, res) {
  try {
  var model = keystone.list(req.params.model);
  model.model.findOne({slug: req.params.slug})
    .exec(function (err, data) {
      if(!data || typeof data === 'undefined'){
        err = 'Ingen operation med slug: '+req.params.slug;
      }
      if (err) {
        res.status(500).send(err);
        return;
      }
      for(var key in req.query){
        if(typeof req.query[key] === 'string' || req.query[key] instanceof String){
          data[key] = req.query[key];
        }
      }
      data.save(function(err, data){
        res.send(data);
      });
    });
  }
  catch(err) {
    res.status(500).send('Hittade inte modellen: ' + req.params.model);
  }
};
