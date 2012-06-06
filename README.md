## Anonymous callback interface for Backbone.js async methods

[Backbone.js](http://documentcloud.github.com/backbone>Backbone.js) exposes a ```success/error``` style callback interface to the asynchronous methods ```fetch```, ```save```, and ```destroy```.  Example:

    myModel.fetch({success: function() {
        ...
      },
      error: function() {
        ...
      }
    });

This library adds a simpler node.js style callback interface for these methods:

    myModel.fetch(function(error) {
     ...
    });

To use this libary:

1) Download from github, or ```npm install backbone-callbacks```

2) Attach the interfaces to Backbone in your initialization script:

    // In a browser...
    BackboneCallbacks.attach(Backbone);

    // In node.js...
    var Backbone = require('backbone');
    require('backbone-callbacks').attach(Backbone);

This small library (under 1k) adds to the existing interface, allowing either style to be used.  If a callback function is provided as the last argument, it will use the simpler style.  Otherwise it will use the original success/error style.
