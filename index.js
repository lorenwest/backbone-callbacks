// BackboneCallbacks.js (c) 2012 Loren West and other contributors
// Node-monitor may be freely distributed under the MIT license.
// For all details and documentation:
// http://lorenwest.github.com/node-monitor
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
  var BackboneCallbacks = function(method) {
    return function() {

      // Connect the success/error methods for callback style requests.
      // These style callbacks don't need the model or options arguments
      // because they're in the scope of the anonymous callback function.
      var args = _.toArray(arguments), callback = args[args.length - 1];
      if (typeof callback === 'function') {

        // Rewrite args if no options were passed
        if (args.length === 1) {
          args = [{}, callback];
        }
        var options = args[args.length - 2];
        if (!options) {
          options = args[args.length - 2] = {};
        }
        options.success = function(model, response) {callback(null, response);};
        options.error = function(model, response) {callback(response, null);};
      }

      // Invoke the original method
      method.apply(this, args);
    };
  };

  // Shim the original methods to allow the alternate calling style
  _.each(['save','destroy','fetch'], function(method) {
    Backbone.Model.prototype[method] = new BackboneCallbacks(Backbone.Model.prototype[method]);
  });
  _.each(['fetch'], function(method) {
    Backbone.Collection.prototype[method] = new BackboneCallbacks(Backbone.Collection.prototype[method]);
  });

}(this));

