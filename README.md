## Anonymous callback style interface for Backbone.js async methods

Load this after Backbone.js to add an anonymous function callback style interface for fetch(), save(), and destroy() in addition to the built-in success/error style interface.

This adds a shim to the existing interface, allowing either style to be used.  If a callback function is provided as the last argument, it will use that callback style.  Otherwise it will use the success/error style.

Example:

    customer.save(attrs, options, function(error, response) {
      if (error) {
        return console.log('Error saving customer', error);
      }
      console.log('Customer save successful.  Response:', response);
    });

The callback gets two arguments - an error object and response object.  One or the other will be set based on an error condition.

The motivation for this callback style is to offer Backbone.js clients a common coding style for client-side and server-side applications.
