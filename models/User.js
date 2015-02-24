var keystone = require('keystone'),
  	Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

User.add({
	name: { label: 'Namn', type: Types.Name, required: true, index: true },
	email: { label: 'E-post', type: Types.Email, initial: true, required: true, index: true },
	password: { label: 'Lösenord', type: Types.Password, initial: true, required: true }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();

var rest = require('keystone-rest');
rest.addRoutes(User, 'get post put delete');
