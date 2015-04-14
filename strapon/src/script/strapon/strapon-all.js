;(function(){

	Array.prototype.includes = function(value){
		for(var i = 0; i < this.length; i++){
			if(value === this[i]){
				return trie;
			}
		}
		return false;
	}

	var win = this;
	var controllerBuilds = Object.create(null);
	var strapon = Object.create(null);
	var defaultName = '$';
	var started = false;
	strapon.windowkey = defaultName;

	var conflict = win[defaultName];

	var _fn = function(v) { return typeof v === 'function' };	
	var _ud = function(v) { return typeof v === 'undefined' };
	var _bind = function() { console.log('StrapOn bind called'); };

	strapon.noConflict = function(value){
		this.rename(value);
		win[defaultName] = conflict;
	}

	strapon.rename = function(value){
		delete win[this.windowkey];
		this.windowkey = value || this.windowkey;
		win[this.windowkey] = this;		
	}

	strapon.argsToArray = function(values){
		var res = [];
		for(var i = 0; i < values.length; i++){
			res[i] = values[i];
		}
		return res;
	}

	strapon.proxy = function(context, ctFn){
		return function(){
			var ag = strapon.argsToArray(arguments);
			ctFn.apply(context, ag);
		}
	}

	/*
		App Controllers
	*/

	var appControllers = {
		stack: Object.create(null),
		add: function(name, controller, el){
			if(this.exists(name)){
				this.stack[name].push({
					controller: controller,
					element: el
				});
			}
			else{
				this.stack[name] = [{
					controller: controller,
					element: el
				}]
			}
		},

		exists: function(name){
			return !_ud(this.stack[name]);
		},
	}

	var generateController = function(name){
		var n = Object.create(controllerBuilds[name]);
		n.bindafter = Object.create(null);

		for(var i in n){
			if(_fn(n[i])){
				n.bindafter[i] = bindingProxy(n, n[i]);
			}
		}	

		n._bind = _bind;

		if(_fn(n.initialize)){
			n.bindafter.initialize();
		}

		return n;
	}

	var bindingProxy = function(context, ctFn){
		return function(){
			var ag = strapon.argsToArray(arguments);
			ctFn.apply(context, ag);
			context._bind();
		}
	};

	strapon.controller = function(name, o, options){
		controllerBuilds[name] = o
		return true;
	}

	/* 
		Parser functionality
	*/

	var parseDocument = function(){
		var cnt = document.querySelectorAll('[strapon]');
		for(var i = 0; i < cnt.length; i++){
			parseController(cnt[i]);
		}
	}

	var parseController = function(c){
		var cName = c.getAttribute('strapon');
		var attributeBindings = parseAttributes(c);
		var cController = generateController(cName, attributeBindings);

		appControllers.add(cName, cController, c);
	}

	var parseAttributes = function(el){
		var attr = {
			handlers: {},
			values: {}
		};

		var excl = ['strapon'];
		var evnt = ['click', 'mouseup', 'mousedown', 'mouseover', 'mouseout', 'keyup','keydown','keypress','focus','blur'];

		for(var i = 0; i < el.attributes.length; i++){
			if(excl.includes(el.attributes[i].name)){
				continue;
			}

			if(evnt.includes(el.attributes[i].name)){
				attr.handlers[el.attributes[i].name] = parseEventAttribute(el.attributes[i]);
			}
			else{
				var vAttr = parseValueAttribute(el.attributes[i]);
				if(!_ud(vAttr)){
					attr.values[el.attributes[i].name] = vAttr;
				}
			}
		}

		return attr;
	}

	var parseEventAttribute = function(key, attribute){

	}

	var parseValueAttribute = function(key, attribute){

	}

	/*
		Start functionality 
	*/

	strapon.start = function(debug){
		if(started){
			return;
		}

		parseDocument();

		if(debug){
			strapon._private = {
				appControllers: appControllers,
				controllerBuilds: controllerBuilds
			};
		}

		started = true;
	}

	strapon.rename();

}).call(this);