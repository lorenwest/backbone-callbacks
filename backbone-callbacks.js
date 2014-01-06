// BackboneCallbacks.js (c) 2012-2014 Loren West and other contributors
// Node-monitor may be freely distributed under the MIT license.
// For all details and documentation:
// http://lorenwest.github.com/backbone-callbacks
(function(root){

  // Module dependencies
  var _ = root._ || require('underscore')._,
      Backbone = root.Backbone || require('backbone');

  /**
   * Anonymous callback style interface for Backbone.js async methods.
   *
   * Load this after Backbone.js to add an anonymous function callback style
   * interface for fetch(), save(), and destroy() in addition to the built-in
   * success/error style interface.
   *
   * This adds a shim to the existing interface, allowing either style to be
   * used.  If a callback function is provided as the last argument, it will
   * use that callback style.  Otherwise it will use the success/error style.
   *
   * Example:
   *
   *     customer.save(attrs, options, function(error, response) {
   *       if (error) {
   *         return console.log('Error saving customer', error);
   *       }
   *       console.log('Customer save successful.  Response:', response);
   *     });
   *
   * The callback gets two arguments - an error object and response object.
   * One or the other will be set based on an error condition.
   *
   * The motivation for this callback style is to offer Backbone.js clients a
   * common coding style for client-side and server-side applications.
   *
   * @class BackboneCallbacks
   */
  var BackboneCallbacks = function(methodName, method) {
    return function() {

      // Connect the success/error methods for callback style requests.
      // These style callbacks don't need the model or options arguments
      // because they're in the scope of the anonymous callback function.
      var args = _.toArray(arguments), callback = args[args.length - 1];
      if (typeof callback === 'function') {

        // Remove the last element (the callback)
        args.splice(-1, 1);

        // Place options if none were specified.
        if (args.length === 0) {
          args.push({});
        }

        // Place attributes if save and only options were specified
        if (args.length === 1 && methodName === 'save') {
          args.push({});
        }
        var options = args[args.length - 1];

        // Place the success and error methods
        options.success = function(model, response) {
          callback(null, response);
        };
        options.error = function(model, response) {
          // Provide the response as the error.
          callback(response, null);
        };
      }

      // Invoke the original method
      return method.apply(this, args);
    };
  };

  // Expose as the module for CommonJS, and globally for the browser.
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = BackboneCallbacks;
  } else {
    root.BackboneCallbacks = BackboneCallbacks;
  }

  /**
  * Attach the shims to a clean Backbone library
  *
  * Backbone-callbacks works automatically for the global Backbone.  If you have
  * a clean version of Backbone (via Backbone.noConflict()) you can manually
  * attach the backbone-callbacks functionality using this method.
  *
  *     var Backbone = require('backbone').noConflict();
  *     require('backbone-callbacks').attach(Backbone);
  *
  * @static
  * @method attach
  * @param library {Backbone} Backbone library to attach to
  */
  BackboneCallbacks.attach = function(library) {

    // Shim the original methods to allow the alternate calling style
    _.each(['save','destroy','fetch'], function(methodName) {
      library.Model.prototype[methodName] = new BackboneCallbacks(methodName, library.Model.prototype[methodName]);
    });
    _.each(['fetch'], function(methodName) {
      library.Collection.prototype[methodName] = new BackboneCallbacks(methodName, library.Collection.prototype[methodName]);
    });
  };

  // Automatically attach the shims to the global Backbone library
  BackboneCallbacks.attach(Backbone);

}(this));
