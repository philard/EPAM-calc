define(['backbone', 'underscore'], 
function(Backbone) {
// define(function (require) {


    var app = {};
    app.Todo = Backbone.Model.extend({
		default:{
			title:'',
			complated: false
		}
	});

    app.TodoView2 = Backbone.View.extend({
      
		el: '#container',
		//template: _.template($('#item-template').html()),
		initialize: function(){
			//this.render();
		},		
      	render: function(){
			var title = this.model.toJSON();
			this.$el.html(this.template(title));
      	}
      
    });
    var todoMod = new app.Todo({title: 'Learn Backbone.js'});
//     var appView2 = new app.TodoView2({model: todoMod});

    
	
// 	var object = {},
//     	callback = function(msg) { console.log("Triggered " + msg); };
// 	_.extend(object, Backbone.Events);
// 	object.on("my_event", callback);
// 	object.trigger("my_event", "my custom event");


});