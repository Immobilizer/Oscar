var express = require('express');
var router = express.Router();

/* GET feeding schedule. */
router.get('/schedule', function(req, res) {
	var db = req.db;
	db.collection('feedingschedule').find().toArray(function (err, items) {
		res.json(items);
	});
});

/* POST to add feeding time */
router.post('/addschedule', function(req, res) {
	var db = req.db;
	db.collection('feedingschedule').insert(req.body, function(err, result) {
		res.send(
			(err === null) ? {msg: ''} : {msg: err}
		);
	});
});

/* DELETE to deleteschedule */
router.delete('/deleteschedule/:id', function(req, res) {
	var db = req.db;
	var scheduleToDelete = req.params.id;
	db.collection('feedingschedule').removeById(scheduleToDelete, function(err, result) {
		res.send((result === 1) ? {msg: ''} : {msg:'error: ' + err});
	});
});

module.exports = router;
