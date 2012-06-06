// CallbackTest.js (c) 2012 Loren West and other contributors
// Node-monitor may be freely distributed under the MIT license.
// For further details and documentation:
// http://lorenwest.github.com/node-monitor
(function(root){

  // Dependencies
  var Backbone = root.Backbone || require('backbone'),
      _ = root._ || require('underscore'),
      BackboneCallbacks = root.BackboneCallbacks || require('../backbone-callbacks');

  // Build a mock sync for testing.  This just returns the
  // method name into the result parameter to verify the call.
  // For error testing, it returns an error if the method is 'read'.
  Backbone.sync = function(method, model, options) {
    if (method === 'read') {
      return options.error({msg: 'Error test'});
    }
    return options.success({method: method});
  };

  /**
  * Unit tests for the <a href="BackboneCallbacks.html">BackboneCallbacks</a> functions.
  * @class CallbackTest
  */

  /**
  * Test group for callback functionality
  *
  * @method Callback
  */
  module.exports['Callback'] = {

    /**
    * Test that method injection works
    * @method Callback-Injection
    */
    Injection: function(test) {
      var oldFetch = Backbone.Model.prototype.fetch;
      test.ok(Backbone.Model.prototype.fetch === oldFetch, 'Test for function equality passes');
      BackboneCallbacks.attach(Backbone);
      test.ok(Backbone.Model.prototype.fetch !== oldFetch, 'Method injection produced a different method');
      test.done();
    },

    /**
    * Test backwards compatibility
    * @method Callback-Compatibility
    */
    Compatibility: function(test) {
      var onSuccess = function(model, response) {
        test.ok(model.get('method') === 'create', 'Success returned proper data');
        var onFail = function(model, response) {
          test.ok(response.msg === 'Error test', 'Failure returned proper data');
          test.done();
        };
        model.fetch({success: onSuccess, error: onFail});
      };
      var model = new Backbone.Model({});
      model.save(null, {success:onSuccess});
    },

    /**
    * Test the new anonymous callback functionality
    * @method Callback-Anonymous
    */
    Anonymous: function(test) {
      var model = new Backbone.Model({id:'test'});
      model.save({a:'b'}, function(error, response) {
        test.ok(!error, 'Save callback successful');
        model.fetch(function(error, response) {
          test.ok(error, 'Error callback successful.');
          test.ok(!response, 'Isnt this nice?');
          test.done();
        });
      });
    }

  };

}(this));
