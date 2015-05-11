define(function(require) {
    var Backbone = require('backbone');
    var _ = require('underscore');
    require('backbone.localStorage');
    
    var calcApp = {};
    
    //--------------
    // Models
    //--------------
    calcApp.DisplayModel = Backbone.Model.extend({
		defaults:{
			evalExp:'',
			evaledValue:0,
			nextOp: '',
			digits: '0',
			digitsUsers: false
		},
		pushChonsenExpStage: function(newDigits) {
		    this.evalExp = this.evalExp + ' ' + this.nextOp + ' ' + newDigits;
            this.digits = mod.evaledValue;//eval(mod.evalExp);
            this.digitsUsers = false;
		},
		
	});
    calcApp.displayModel = new calcApp.DisplayModel({});
	
    //--------------
    // Views
    //--------------
    calcApp.DisplayView = Backbone.View.extend({
        tagName: 'div',
		template: _.template($('#display-template').html()),
      	render: function(){
      	    var html = this.template(this.model.toJSON());
			this.$el.html(html);
			return this;
      	},
		initialize: function(){
		    this.model.on('change', this.render, this);
			this.render();
		},		

      
    });

    calcApp.AppView = Backbone.View.extend({
    
		el: '#calc',
        initialize: function() {
            var displayView = new calcApp.DisplayView({model: calcApp.displayModel});
            $('#calc-display').html(displayView.$el);
        },
        events: {
		    'click button.number': 'numberClick',
		    'click button.operator': 'operatorClick',
		    'click button.funct': 'functionClick'
		},
		numberClick: function(e) {
		    var digit = e.target.innerHTML;
		    var mod = calcApp.displayModel.toJSON();
		    if(mod.digitsUsers) {
                mod.digits = ''+ mod.digits + digit;
                mod.digitsUsers = true;
		    } else {
                mod.digits = digit;
                mod.digitsUsers = true;
		    }
            calcApp.displayModel.set(mod);
		},
		operatorClick: function(e) {
		    var op = e.target.innerHTML;
		    var mod = calcApp.displayModel.toJSON();
		    if(mod.digitsUsers) {
		        calcApp.displayModel.pushChonsenExpStage(mod.digit);
                calcApp.displayModel.set('nextOp', op);
            } else {
                mod.nextOp = op;
                mod.evalExp = mod.digits;
            }
            calcApp.displayModel.set(mod);
            
		},
		functionClick: function(e) {
            var funct = e.target.innerHTML;
		    var mod = calcApp.displayModel.toJSON();
		    switch(funct) {
                case '%':
                    mod.digits = eval(mod.evalExp) * (mod.digits / 100);
                    mod.digitsUsers = false;
                    mod.evalExp = mod.evalExp + ' ' + mod.nextOp + ' ' + mod.digits;
                    mod.nextOp = '';
                    break;
		        case '1/x':
                    break;
                case '=':
                    mod.digits = eval(mod.evalExp + mod.nextOp + mod.digits);
                    mod.digitsUsers = false;
                    mod.evalExp = mod.digits;
                    mod.nextOp = '';
                    break;
		    }
		    calcApp.displayModel.set(mod);
		}
    });
    
    calcApp.appView = new calcApp.AppView();



   
});
