/*
Script: Fx.Scroll.js
	Effect to smoothly scroll any element, including the window.

License:
	MIT-style license.

Note:
	Fx.Scroll requires an XHTML doctype.
*/

Fx.Scroll = new Class({

	Extends: Fx,

	options: {
		offset: {'x': 0, 'y': 0},
		wheelStops: true
	},

	initialize: function(element, options){
		this.element = this.pass = $(element);
		arguments.callee.parent(options);
		var cancel = this.cancel.bind(this, false);

		switch($type(this.element)){
			case 'window': this.element = this.element.document; break;
			case 'element': if (this.element.get('tag') == 'body') this.element = this.element.ownerDocument;
		}

		var stopper = this.element;

		if (this.options.wheelStops){
			this.addEvent('onStart', function(){
				stopper.addEvent('mousewheel', cancel);
			}, true);
			this.addEvent('onComplete', function(){
				stopper.removeEvent('mousewheel', cancel);
			}, true);
		}
	},

	set: function(){
		var now = Array.flatten(arguments);
		this.element.scrollTo(now[0], now[1]);
	},

	compute: function(from, to, delta){
		var now = [];
		(2).times(function(i){
			now.push(Fx.compute(from[i], to[i], delta));
		});
		return now;
	},

	start: function(x, y){
		if (!this.check(x, y)) return this;
		var offsetSize = this.element.getOffsetSize(), scrollSize = this.element.getScrollSize(), scroll = this.element.getScroll(), values = {'x': x, 'y': y};
		for (var z in values){
			var max = scrollSize[z] - offsetSize[z];
			if ($chk(values[z])) values[z] = ($type(values[z]) == 'number') ? values[z].limit(0, max) : max;
			else values[z] = scroll[z];
			values[z] += this.options.offset[z];
		}
		return arguments.callee.parent([scroll.x, scroll.y], [values.x, values.y]);
	},

	toTop: function(){
		return this.start(false, 0);
	},

	toLeft: function(){
		return this.start(0, false);
	},

	toRight: function(){
		return this.start('right', false);
	},

	toBottom: function(){
		return this.start(false, 'bottom');
	},

	toElement: function(el){
		var position = Element.getPosition($(el, true), this.element);
		var scroll = ($type(this.element) == 'element') ? this.element.getScroll() : {x: 0, y: 0};
		return this.start(position.x + scroll.x, position.y + scroll.y);
	}

});