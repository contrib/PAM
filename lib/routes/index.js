var Index = {};

Index.get = function(req, res, next){
  res.status(200).send({ hello: 'world' });
};

module.exports = Index;
