var keystone = require('keystone');

exports = module.exports = function (req, res) {
  if (typeof req.query.all === 'undefined' && (typeof req.query.text === 'undefined' || !req.query.text.length)) {
    res.send([]);
    return;
  }else if(typeof req.query.all !== 'undefined' && typeof req.query.limit === 'undefined'){
    req.query.limit = 0;
  }
  var model = keystone.list(req.params.model);
  model.model.search(req.query.text)
    .populate('createdBy updatedBy specialty')
    .sort('-updatedAt')
    .limit((typeof req.query.limit === 'undefined') ? 10 : req.query.limit)
    .exec(function (err, data) {
      if (err) {
        res.status(500).send(err);  
        return;
      }
      res.send(data);
    });
};
