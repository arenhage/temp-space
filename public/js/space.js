var Space = {
		addDownloadEvent: function() {
			$(".dz-download").on("click", function (e) {
				e.preventDefault();
				e.stopPropagation();

				var filename = $(this).parent().find(".dz-filename > span").text();
				var filesId = $(this).parent().find(".dz-files-id > span").text();

				console.log(filename);
				console.log(filesId);
//				$.ajax({
//				url: "Your url here",
//				data: { imageId: imageId },
//				type: 'POST',
//				success: function (data) {
//				if (data.NotificationType === "Error") {
//				toastr.error(data.Message);
//				} else {
//				toastr.success(data.Message);                          
//				}
//				},
//				error: function (data) {
//				toastr.error(data.Message);
//				}
//				})
			});
		},
		addDeleteEvent: function() {
			$(".dz-delete").on("click", function (e) {
				e.preventDefault();
				e.stopPropagation();

				var filename = $(this).parent().find(".dz-filename > span").text();
				var filesId = $(this).parent().find(".dz-files-id > span").text();

				console.log(filename);
				console.log(filesId);
//				$.ajax({
//				url: "Your url here",
//				data: { imageId: imageId },
//				type: 'POST',
//				success: function (data) {
//				if (data.NotificationType === "Error") {
//				toastr.error(data.Message);
//				} else {
//				toastr.success(data.Message);                          
//				}
//				},
//				error: function (data) {
//				toastr.error(data.Message);
//				}
//				})
			});
		},
		initDropzone: function(files) {
			// myDropzone is the configuration for the element that has an id attribute
			// with the value my-dropzone (or myDropzone)
			Dropzone.options.myDropzone = {
					addRemoveLinks: true,
					addDownloadLinks: true,
					dictRemoveFile: "Remove",

					init: function() {
						var self = this;

						//File is added
						self.on("addedfile", function(file) {
						});

						// Send file starts
						self.on("sending", function(file) {
						});

						// File upload Progress
						self.on("totaluploadprogress", function(progress) {
						});

						//When upload queue complete
						self.on("queuecomplete", function(progress) {
						});

						// On removing file
						self.on("removedfile", function(file) {
						});

						//Upload complete
						self.on("complete", function() {
						});

						//Upload successfull
						self.on("success", function(file) {
							var xhr = file.xhr;
							var json = JSON.parse(xhr.response);
							file.previewTemplate.appendChild(Dropzone.createElement('<div hidden class="dz-files-id"><span data-dz-files-id>' + json._id + '</span></div>'));
						});

						//add existing files
						for (var i = 0; i < files.length; i++) {
							var mockFile = {
									files_id: files[i]._id,
									name: files[i].filename,
									size: files[i].length,
									type: files[i].contentType
							};
							// Call the default addedfile event handler
							self.options.addedfile.call(self, mockFile);
							self.options.success.call(self, mockFile);
						};
					}
			};
		}
}