var express = require('express');
var router = express.Router();

/* GET feeding schedule. */
router.get('/schedule', function(req, res) {
	req.db.Schedule
		.findAll()
		.success(function(schedules) {
			res.send(200, {
				schedules: schedules
			});
		});
});

/* POST to add feeding time */
router.post('/addschedule', function(req, res) {
	var schedule = req.db.Schedule.build({
		hour: req.body.hour,
		minute: req.body.minute,
		ampm: req.body.ampm
	});
	schedule.save()
		.success(function() {
			res.send(200, { 
				msg: ''
			});
		})
		.error(function(err) {
			res.send(200, {
				msg: err.toString()
			});
		});
});

/* DELETE to deleteschedule */
router.delete('/deleteschedule/:id', function(req, res) {
	var scheduleToDelete = req.params.id;
	req.db.Schedule.find({
		where: {
			id: scheduleToDelete
		}
	}).success(function(schedule) {
		if (schedule) {
			schedule.destroy().success(function() {
				res.send(200, {
					msg: ''
				});
			}).error(function(err) {
				res.send(500, {
					msg: err
				});
			});
		}
	});
});

module.exports = router;
