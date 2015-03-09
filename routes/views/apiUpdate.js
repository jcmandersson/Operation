var keystone = require('keystone');

exports = module.exports = function (req, res) {
  var model = keystone.list(req.params.model);
  model.model.findOne(req.params.slug)
    .exec(function (err, data) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      
      for(var key in req.query){
        data[key] = req.query[key];
      }
      data.save(function(err, data){
        res.send(data);
      });
    });
};
