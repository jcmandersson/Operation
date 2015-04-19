var keystone = require('keystone');

exports = module.exports = function (req, res) {
  if (typeof req.query.all === 'undefined' && (typeof req.query.text === 'undefined' || !req.query.text.length)) {
    res.send([]);
    return;
  }else if(typeof req.query.all !== 'undefined' && typeof req.query.limit === 'undefined'){
    req.query.limit = 0;
  }
  req.query.skip = typeof req.query.skip !== 'undefined' ? req.query.skip : 0;
  req.query.sort = typeof req.query.sort !== 'undefined' ? req.query.sort : '-updatedAt';
  
  var model = keystone.list(req.params.model);
  model.model.search(req.query.text)
    .populate('createdBy updatedBy specialty')
    .sort(req.query.sort)
    .skip(req.query.skip)
    .limit((typeof req.query.limit === 'undefined') ? 10 : req.query.limit)
    .exec(function (err, data) {
      if (err) {
        res.status(500).send(err);  
        return;
      }
      res.send(data);
    });
};
