class ServiceCaller {

	static post(servicePath, data, callback) {

		$.extend(data, { "_token": $('meta[name="csrf-token"]').attr('content') });

		var request = $.ajax({
			url: servicePath,
			dataType: "json",
			type: 'POST',
			data: data,
			cache: false,
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			},
			success: function(response) {
				if (callback) {
					if (typeof response.state !== "undefined" && response.state == "error") {
						console.error(JSON.stringify(response));
					}

					callback(response);
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				if (xhr.readyState !== 0) {
					console.error("ERROR calling Service: " + servicePath);
					console.error(xhr.readyState);
				}

				if (typeof xhr.responseJSON !== "undefined") {
					console.error(xhr.responseJSON);

					if (xhr.responseJSON.message && xhr.responseJSON.message.indexOf('CSRF token mismatch') > -1) {
						//window.location.reload();
					} else {
						if (GLOBAL_ENVIRONMENT != "local") {
							ServiceCaller.post("/sendErrorMail", { "body": xhr.responseJSON, "subject": xhr.responseJSON.message }, function(response) {
								if (typeof response.state !== "success") {
									console.log(response);
								}
							});
						}
					}
				}

				if (callback) {
					callback({ state: "error", message: (typeof xhr.responseJSON !== "undefined") ? xhr.responseJSON.message : xhr });
				}
			}
		});

		return request;
	}


	static get(servicePath, data, callback) {

		$.extend(data, { "_token": $('meta[name="csrf-token"]').attr('content') });

		var request = $.ajax({
			url: servicePath,
			dataType: "json",
			type: 'GET',
			data: data,
			cache: false,
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			},
			success: function(response) {
				if (callback) {
					if (typeof response.state !== "undefined" && response.state == "error") {
						//$("#base-message-box").html(createMessageBox("danger",JSON.stringify(response)));
						console.error(JSON.stringify(response));
					}
					callback(response);
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				if (xhr.readyState !== 0) {
					console.error("ERROR calling Service: " + servicePath);
					console.error(xhr.readyState);
				}

				if (typeof xhr.responseJSON !== "undefined") {
					console.error(xhr.responseJSON);

					if (xhr.responseJSON.message && xhr.responseJSON.message.indexOf('CSRF token mismatch') > -1) {
						//window.location.reload();
					} else {
						if (GLOBAL_ENVIRONMENT != "local") {
							ServiceCaller.post("/sendErrorMail", { "body": xhr.responseJSON, "subject": xhr.responseJSON.message }, function(response) {
								if (typeof response.state !== "success") {
									console.log(response);
								}
							});
						}
					}
				}

				if (callback) {
					callback({ state: "error", message: (typeof xhr.responseJSON !== "undefined") ? xhr.responseJSON.message : xhr });
				}
			}
		});

		return request;
	}

}