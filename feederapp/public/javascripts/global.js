// Socket communication with server
/*var socket = io.connect(document.location.href);*/

// DOM ready ==========================================
$(document).ready(function() {

	// Populate the schedule table on initial page load
	populateTable();

	// Submit schedule button listener
	$('#btnAddFeedingTime').on('click', addFeedingTime);

	// Feed the cats immediately
	/*$('#btnFeedNow').on('click', feedNow);*/

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

		var schedules = data.schedules;

		// For each item in our JSON, add a table row and cells to the content string
		$.each(schedules, function() {
			tableContent += '<tr>';
			tableContent += '<td>' + this.hour + '</td>';
			tableContent += '<td>' + this.minute + '</td>';
			tableContent += '<td>' + this.ampm  + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteschedule" rel="' + this.id + '">delete</a></td>';
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
			'hour': $('#addFeedingTime input#hour').val(),
			'minute': $('#addFeedingTime input#minute').val(),
			'ampm': $('#addFeedingTime select#ampm').val()
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
				$('#addFeedingTime input').val('');

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
			url: '/schedules/deleteschedule/' + $(this).prop('rel')
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

// Feed the cats now
/*function feedNow() {
	socket.emit('feed now');
}*/