var Space = {
}

$(document).ready(function() {
	// myDropzone is the configuration for the element that has an id attribute
	// with the value my-dropzone (or myDropzone)
	Dropzone.options.myDropzone = {
			init: function() {
				this.on("addedfile", function(file) {

					// Create the remove button
					var removeButton = Dropzone.createElement(
							'<button class="btn btn-danger btn-sm btnSpacing"><span class="glyphicon glyphicon-remove"></span></button>'
					);
					
					var downloadButton = Dropzone.createElement(
							'<button class="btn btn-primary btn-sm btnSpacing"><span class="glyphicon glyphicon-download-alt"></span></button>'
					); 

					// Capture the Dropzone instance as closure.
					var _this = this;

					// Listen to the click event
					removeButton.addEventListener("click", function(e) {
						// Make sure the button click doesn't submit the form:
						e.preventDefault();
						e.stopPropagation();

						// Remove the file preview.
						_this.removeFile(file);
						// If you want to the delete the file on the server as well,
						// you can do the AJAX request here.
					});
					
					downloadButton.addEventListener("click", function(e) {
						// Make sure the button click doesn't submit the form:
						e.preventDefault();
						e.stopPropagation();

						// TODO: download file
					});

					// Add the button to the file preview element.
					file.previewElement.appendChild(removeButton);
					file.previewElement.appendChild(downloadButton);
				});
			}
	};
});
