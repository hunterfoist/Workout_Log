var express = require('express');
var router = express.Router();

let validateSession = require('../middleware/validate-session');
var sequelize = require('../db');
var Log = sequelize.import('../models/log');


router.post('/', validateSession, (req, res) => {
  const createLog = {
    description: req.body.log.description,
    definition: req.body.log.definition,
    result: req.body.log.result,
    owner_id: req.user.id
  } 
  Log.create(createLog)
  .then(log => res.status(200).json(log))
  .catch(err => res.status(500).json({error: err}))
  
});

router.get("/", validateSession, (req, res) => {
  Log.findAll()
  .then(logs => res.status(200).json(logs))
  .catch(err => res.status(500).json({error: err}))
});

router.get("/:id", validateSession, (req, res) => {
  let id = req.params.id
  Log.findAll({
    where: {id: id}
})
  .then(logs => res.status(200).json(logs))
  .catch(err => res.status(500).json({error: err}))
});

router.put('/:id', validateSession, function(req, res) {
  const updateLogs = {
    description: req.body.log.description,
    definition: req.body.log.definition,
    result: req.body.log.result,
    owner_id: req.user.id
  };
  const query = { where: {id: req.params.id}};

  Log.update(updateLogs, query)
  .then((logs) => res.status(200).json(logs))
  .catch((err) => res.status(500).json({error: err}));
})


router.delete('/:id', validateSession, function(req, res) {
const query = { where: { id: req.params.id, owner_id: req.user.id}};
Log.destroy(query)
.then((response) =>
res.status(200).json({
  message: "Log Has Been Deleted",
})
)
.catch((err) => res.status(500).json({ error: err }));
});
module.exports = router;






