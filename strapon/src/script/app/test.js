$.controller('SuperController', {
	initialize: function(){
		this.value = 0;
	},

	getValue: function(){
		this.value = Math.random();
	}
});