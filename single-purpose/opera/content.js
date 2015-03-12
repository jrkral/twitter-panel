$(function() {

	if ($('#lst-ib').length > 0) {
		onSearch($('#lst-ib').val());
	}

	//catch when someone hits ENTER in search box
	$('#lst-ib').keydown(function(e) {
		if (e.which == 13) {
			onSearch($('#lst-ib').val());
		}
	});

	//catch when someone clicks the search button
	$('button[name="btnG"]').click(function() {
		onSearch($('#lst-ib').val());
	});

	function onSearch(query) {
		query = $.trim(query);
		if (query.length == 0) {
			return;
		}

		//console.log('you searched for ' + query);
		chrome.runtime.onMessage.addListener(function(message) {
			console.log('received message!');

			var consumer_key = message.consumer_key;
			var consumer_secret = message.consumer_secret;
			var access_key = message.access_key;
			var access_secret = message.access_secret;
			//console.log(consumer_key, consumer_secret, access_key, access_secret);

			cb = new Codebird;
			cb.setConsumerKey(consumer_key, consumer_secret);
			cb.setToken(access_key, access_secret);
			//cb.setBearerToken(access_key, access_secret);
			cb.__call(
				"statuses_update", { "status": query },
				function(reply) {
					console.log(reply);
				}
			);
		});

		chrome.runtime.sendMessage('getTokens');
	}

	function validateTokens(consumer_key, consumer_secret, access_token, access_secret) {

		var valid = true;
		if (typeof consumer_key != 'undefined' || consumer_key.length == 0) {
			console.log('consumer_key is blank.');
			valid = false;
		}
		if (typeof consumer_secret != 'undefined' || consumer_secret.length == 0) {
			console.log('consumer_secret is blank.');
			valid = false;
		}
		if (typeof access_key != 'undefined' || access_key.length == 0) {
			console.log('access_key is blank.');
			valid = false;
		}
		if (typeof access_secret != 'undefined' || access_secret.length == 0) {
			console.log('access_secret is blank.');
			valid = false;
		}

		return valid;
	}
});