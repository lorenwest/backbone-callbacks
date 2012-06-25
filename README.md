## Anonymous callback interface for Backbone.js async methods

[Backbone.js](http://documentcloud.github.com/backbone>Backbone.js) exposes a ```success/error``` style callback interface to the asynchronous methods ```fetch```, ```save```, and ```destroy```.  Example:

    myModel.fetch({success: function(model, response) {
        ...
      },
      error: function(model, response) {
        ...
      }
    });

If you're using Node.js and use your Backbone models on the client as well as the server,
you may want to interact with your models in more of a Node.js async callback style:

    myModel.fetch(function(error, response) {
     ...
    });

This library adds to the existing interface for ```fetch```, ```save```, and ```destroy```, allowing you to choose the style you prefer.

If a callback function is provided as the last argument, it uses that style.  Otherwise it will use the default ```success/error``` style.

To use this libary:

1) Download from github, or ```npm install backbone-callbacks```

2) Include the library in your application.  Load it after Backbone.js on the browser, or require('backbone-callbacks') in Node.js

