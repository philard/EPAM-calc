 // define(['underscore', 'backbone', 'backbone.localStorage'], 
// function(_, Backbone) {
define(function(require) {
    var Backbone = require('backbone');
    var _ = require('underscore');
    require('backbone.localStorage');
    

    var app = {}; // create namespace for our app

    //--------------
    // Models
    //--------------
    app.Todo = Backbone.Model.extend({
        defaults: {
            title: '',
            completed: false
        },
        toggle: function() {
            this.save({completed: !this.get('completed')});
        }
    });

    //--------------
    // Collections
    //--------------
    app.TodoList = Backbone.Collection.extend({
        model: app.Todo,
        localStorage: new Store("backbone-todo"),
        completed: function() {
            return this.filter(function(todo) {
                return todo.get('completed');
            });
        },
        remaining: function() {
            return this.without.apply(this, this.completed());
        }
    });
    app.todoList = new app.TodoList();
    //END MODEL

    //--------------
    // Views
    //--------------

    // renders individual todo items list (li)
    app.TodoView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#item-template').html()),
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.input = this.$('.edit');
            return this;
        },
        initialize: function() {
            this.model.on('change', this.render, this); //this must be this View, not the changed collection.
            this.model.on('destroy', this.remove, this);
        },
        events: {
            'dblclick label': 'edit',
            'keypress .edit': 'updateOnEnter',
            'blur .edit': 'close',
            'click .toggle': 'toggleCompleted',
            'click .destroy': 'destroy'
        },
        edit: function() {
            this.$el.addClass('editing');
            this.input.focus();
        },
        close: function() {
            var value = this.input.val().trim();
            if (value) {
                this.model.save({title: value});
            }
            this.$el.removeClass('editing');
        },
        updateOnEnter: function(e) {
            if (e.which == 13) {
                this.close();
            }
        },
        toggleCompleted: function() {
            this.model.toggle();
        },
        destroy: function() {
            this.model.destroy();
        }
    });
    
    
    
    app.AppView = Backbone.View.extend({
        el: '#todoapp',
        initialize: function() {
            this.input = this.$('#new-todo');
            app.todoList.on('add', this.addOne, this);
            app.todoList.on('reset', this.addAll, this);
            console.log('START fetch->')
            app.todoList.fetch();
            console.log('END fetch <-')
        },
        events: {
            'keypress #new-todo': 'createTodoOnEnter'
        },
        createTodoOnEnter: function(e) {
            if (e.which !== 13 || !this.input.val().trim()) {
                return;
            }
            app.todoList.create(this.newAttributes());
            this.input.val('');
        },
        addOne: function(todo) {
            console.log('here addOne')
            var view = new app.TodoView({model: todo});
            $('#todo-list').append(view.render().el);
        },
        addAll: function() {
            console.log('here addAll')
            this.$('#todo-list').html(''); // clean the todo list
            // filter todo item list
            switch (window.filter) {
                case 'pending':
                    _.each(app.todoList.remaining(), this.addOne);
                    break;
                case 'completed':
                    _.each(app.todoList.completed(), this.addOne);
                    break;
                default:
                    app.todoList.each(this.addOne, this);
                    break;
            }
        },
        newAttributes: function() {
            return {
                title: this.input.val().trim(),
                completed: false
            }
        }
    });
    //END VIEW

    //--------------
    // Routers
    //--------------
    
    app.Router = Backbone.Router.extend({
        routes: {
            '*filter': 'setFilter'
        },
        setFilter: function(params) {
            console.log('app.router.params = ' + params);
            window.filter = params? params.trim() : undefined;
//             if(window.filter) 
            app.todoList.trigger('reset');
        }
    });


    //--------------
    // Initializers
    //--------------   
    
    app.router = new app.Router();
    Backbone.history.start();//Hash url changes contribute to browser history 
    app.appView = new app.AppView();


   
});
