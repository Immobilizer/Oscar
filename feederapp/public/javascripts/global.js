// FeedingSchedule data array for filling in info box
var feedingScheduleData = [];

// DOM ready ==========================================
$(document).ready(function() {

	console.log('the document is ready');
	// Populate the schedule table on initial page load
	populateTable();

	// Submit schedule button listener
	$('#btnAddFeedingTime').on('click', addFeedingTime);

	// Delete schedule link click
	$('#feedingTimes table tbody').on('click', 'td a.linkdeleteschedule', deleteSchedule);

});

// Functions ==========================================

// Fill table with data
function populateTable() {

	// Empty content string
	var tableContent = '';

	// jQuery AJAX call for JSON
	$.getJSON('/schedules/schedule', function(data) {

		// Stick our schedule data array into a schedule variable in the global object
		feedingScheduleData = data;

		// For each item in our JSON, add a table row and cells to the content string
		$.each(data, function() {
			tableContent += '<tr>';
			tableContent += '<td>' + this.hour + '</td>';
			tableContent += '<td>' + this.minute + '</td>';
			tableContent += '<td>' + this.ampm  + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteschedule" rel="' + this._id + '">delete</a></td>';
			tableContent += '</tr>';
		});
		// Inject the whole content string into our existing HTML table
		$('#feedingTimes table tbody').html(tableContent);
	});
}

// Add Feeding Time
function addFeedingTime(event) {
	event.preventDefault();

	// Basic validation - increase errorCount variable if any fields are blank
	var errorCount = 0;
	$('#addFeedingTime input').each(function(index, val) {
		if($(this).val() === '') {errorCount++}
	});

	// Check and make sure errCount is still at zero
	if(errorCount === 0) {

		// If it is, compile all feeding schedule info into one object
		var newSchedule = {
			'hour': $('#addFeedingTime fieldset input#hour').val(),
			'minute': $('#addFeedingTime fieldset input#minute').val(),
			'ampm': $('#addFeedingTime fieldset select#ampm').val()
		}

		// Use AJAX to post the object to our adduser service
		$.ajax({
			type: 'POST',
			data: newSchedule,
			url: '/schedules/addschedule',
			dataType: 'JSON'
		}).done(function(response) {

			// Check for successful (blank) response
			if (response.msg === '') {

				// Clear the form inputs
				$('#addFeedingTime fieldset input').val('');

				// Update the table
				populateTable();

			}
			else {

				// If something goes wrong, alert the error message that our service returned
				alert('Error: ' + response.msg);

			}
		});
	}
	else {

		// If errorCount is more than 0, error out
		alert('Please fill in all fields');
		return false;
	}

}

// Delete Feeding Schedule
function deleteSchedule(event) {

	event.preventDefault();

	// Pop up a confirmation dialog
	var confirmation = confirm('Are you sure you want to delete this feeding schedule?');

	// Check and make sure the user confirmed
	if (confirmation === true) {

		// If they did, do the delete
		$.ajax({
			type: 'DELETE',
			url: '/schedules/deleteschedule/' + $(this).attr('rel')
		}).done(function(response) {

			// Check for a successful (blank) response
			if (response.msg === '') {

			}
			else {
				alert('Error: ' + response.msg);
			}

			// Update the table
			populateTable();

		});
	}
	else {

		// If they said no to the confim, do nothing
		return false;
	}
}
