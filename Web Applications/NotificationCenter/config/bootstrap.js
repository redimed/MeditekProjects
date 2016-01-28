/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
	/**
	 * Overide Error Object
	 * add function pushErrors
	 */
	Error.prototype.pushErrors=function(errors){
		this.errors=errors;
	}
	Error.prototype.pushError=function(err)
	{
		if(this.errors)
		{
			this.errors.push(err);
		}
		else
		{
			this.errors=[];
			this.errors.push(err);
		}
	}
	Error.prototype.getErrors=function()
	{
		if(this.errors)
			return this.errors;
		else
			return [];
	}
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
