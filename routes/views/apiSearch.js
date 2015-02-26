var keystone = require('keystone');

exports = module.exports = function (req, res) {
  
  if(typeof req.query.text === 'undefined' || req.query.text == ''){
    res.status(500).send('Text is empty');
    return;
  }
  
  var model = keystone.list(req.params.model);
  model.model.search(req.query.text)
    .populate('createdBy updatedBy specialty')
    .sort('-updatedAt')
    .limit((typeof req.query.limit === 'undefined') ? 10 : reg.query.limit)
    .exec(function (err, data) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.send(data);
    });
};
