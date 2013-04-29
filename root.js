var util = require('util');
_ = require('underscore');

// From Eloquent Javascript p115
// Returns an object using the supplied object as its prototype
var clone = function(object) {
	function OneShotConstructor(){};
	OneShotConstructor.prototype = object;
	return new OneShotConstructor();
}

// From Eloquent Javascript p109
// Binds a method to an object 
var bind = function (object, name) {
	return function () {
		object[name].apply(object, arguments);
	};
}

// From Eloquent Javascript p 124
// Adds a 'create' method to all objects using the caller as the prototype.
// create executes a 'construct' method of the prototype, if it exists
Object.prototype.create = function () {
	var object = clone(this);
	
	if (typeof object.construct !== 'undefined') {
		object.construct.apply(this, arguments);
	}
	return object;
};


inspect = function (o) {
	return util.inspect(o, {'showHidden': true, 'depth': 2});
};
