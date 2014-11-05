var Space = {
		addDeleteEvents: function() {
			$(".dz-delete").on("click", function (e) {
				e.preventDefault();
				e.stopPropagation();

				var fileName = $(this).parent().find(".dz-filename > span").text();
				var filesId = $(this).parent().find(".dz-files-id > span").text();
				$.ajax({
					url: "/space/file/remove",
					data: { 
						filesId: filesId,
						fileName: fileName 
					},
					type: 'POST',
					success: function (data) {
						toastr.success('Successfully removed file: ' + fileName);
					},
					error: function (data) {
						toastr.error('Unable to remove file: ' + fileName);
					}
				});
			});
		},
		addDeleteEvent: function(element) {
			$(element).find(".dz-delete").on("click", function (e) {
				var fileName = $(element).find(".dz-filename > span").text();
				var filesId = $(element).find(".dz-files-id > span").text();
				$.ajax({
					url: "/space/file/remove",
					data: { 
						filesId: filesId,
						fileName: fileName 
					},
					type: 'POST',
					success: function (data) {
						toastr.success('Successfully removed file: ' + fileName);
					},
					error: function (data) {
						toastr.error('Unable to remove file: ' + fileName);
					}
				});
			});
		},
		initDropzone: function(files) {
			// myDropzone is the configuration for the element that has an id attribute
			// with the value my-dropzone (or myDropzone)
			Dropzone.options.myDropzone = {
					addRemoveLinks: true,
					addDownloadLinks: true,
					dictRemoveFile: "Remove",
					createImageThumbnails: false,

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
							if (this.options.addDownloadLinks) {
								file._downloadLink = Dropzone.createElement('<a class="dz-download btn btn-primary btn-xs btnSpacing" href="/space/file/download/' + json._id + '"><span class="glyphicon glyphicon-download-alt"></span></a>');
								file.previewElement.appendChild(file._downloadLink);
							}
							file.previewTemplate.appendChild(Dropzone.createElement('<div hidden class="dz-files-id"><span data-dz-files-id>' + json._id + '</span></div>'));
							Space.addDeleteEvent(file.previewTemplate);
						});

						//add existing files, once
						for (var i = 0; i < files.length; i++) {
							var mockFile = {
									files_id: files[i]._id,
									name: files[i].filename,
									size: files[i].length,
									type: files[i].contentType,
									downloadLink: '/space/file/download/'+files[i]._id 
							};
							// Call the default addedfile event handler
							self.options.addedfile.call(self, mockFile);
							self.options.success.call(self, mockFile);
						};
						Space.addDeleteEvents();
					}
			};
		},
		copyUrlToClipboard: function() {
			window.prompt("Copy to clipboard: Ctrl+C, Enter", window.location.href);
		}
}