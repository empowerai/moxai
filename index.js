/*

 _ _   _      _  o 
) ) ) (_) \) (_( ( 
          (\       

*/

//*******************************************************************

'use strict';

//*******************************************************************
// required modules

var path = require('path');
var matchstick = require('matchstick');
var traverse = require('traverse');
var RandExp = require('randexp');

//*******************************************************************
// moxai

/**
 * Creates JSON response for any error, given a message. Also logs the error.
 * @param  {Object} req     - User request object
 * @param  {String} message - Error message to output
 */
function logging(req, message){

	var attemptedRoute = req.originalUrl;
	var browser = req.get('user-agent');
	var referer = req.get('referer');

	var errorLog = {};
	errorLog.route = attemptedRoute;
	errorLog.browser = browser;
	errorLog.referer = referer;
	errorLog.errorMessage = message;

	console.error(errorLog);
}

/**
 * Returns error message, and any error objects to user
 * @param  {Object} req     - User request object
 * @param  {Object} res     - Response object
 * @param  {integer} status	- HTTP status code to return
 * @param  {String} message	- Error message to return
 */
var error = function(req, res, status, message){

	var output = {
		'response': {
			'success' : false,
			'message': message
		}
	};

	logging(req, message);

	return res.status(status).json(output);

};

/**
 * Matches input path from request to paths object in OAI JSON file
 * @param  {Object} reqPath     - Path of request object from req.path
 * @param  {Object} objectPaths	- Paths in OAI JSON file from [object].paths
 */
var getPath = function(reqPath, objectPaths){

	for (var k in objectPaths) {
		if (objectPaths.hasOwnProperty(k)) {

			var ms = matchstick(k, 'template');
			ms.match(reqPath);

			if ( ms.match(reqPath) ) { 
				return k;
			}
		}
	}
};

/**
 * Randomizes output from JSON where value is regex.
 * @param  {Object} obj     - Object (JSON) of output to be randomized.
 */
var randomizeOutput = function(obj){
	
	var output = obj;
	
	traverse(output).forEach(function (x) {		
		//console.log('x : ' +  x );
		
		//console.log('typeof : ' +  (typeof x) );		
		if (typeof x === 'string') {
			
			//console.log('indexOf : ' +  (x.indexOf('/')) );
			//console.log('lastIndexOf : ' +  (x.lastIndexOf('/')) );
			//console.log('length : ' +  x.length);			
			if ( (x.indexOf('/') === 0) && (x.lastIndexOf('/') === (x.length - 1)) ) {
				
				var regs = x.substring(1, (x.length - 1) );				
				console.log('regs : ' +  regs);
			
				try {						
					
					var regx = new RegExp(regs);					
					console.log('regx : ' +  regx );

					//console.log('instanceof : ' +  (regx instanceof RegExp) );			
					if (regx instanceof RegExp) {
						
						var randx = new RandExp(regx).gen();						
						//console.log('randx : ' +  randx );
						
						this.update(randx);
					}					
				}
				catch (e) {
					//console.log('e : ' +  e);
				}			
			}
		}		
	});
	return output;
};

/**
 * Route mock API requests using Open API Initiative (OAI) [fka Swagger]
 * 
 * @param {Object} [options]
 * @param {string} [options.dir=mocks] - The directory location of OAI files relative to parent directory.
 * @param {string} [options.file=api] - The name of OAI JSON file. Must be located within directory.
 * @param {boolean} [options.random=false] - Use random output for regex values in OAI JSON file.
 * @return {Function}	- Returns Express middleware function
 * @public
 */
function moxai(options) {
	
	var opts = options || {};
	
	var moxDir = opts.dir || 'mocks';
	var moxFile = opts.file || 'api';
	var moxRand = opts.random || false;
	var moxObject, moxOutput;

	return function (req, res) {
		
		var moxInclude = path.join(path.dirname(module.parent.filename), moxDir, moxFile + '.json');
			
		try {
			moxObject = require(moxInclude);	
		}
		catch (e) {
			return error(req, res, 500, 'No mock API JSON file found in directory.');
		}
		
		var reqPath = req.path;
		var reqMethod = req.method.toLowerCase();
		
		var moxPath;
	
		if (moxObject.paths) {			
			moxPath = getPath(reqPath, moxObject.paths);
		}
		else {
			return error(req, res, 500, 'Invalid mock API JSON paths.');
		}

		if (!moxPath) {
			return error(req, res, 404, 'No endpoint path found.');
		}
		else {
			if (!moxObject.paths[moxPath][reqMethod]) {
				return error(req, res, 405, 'No endpoint method found.');
			}
			else {
				if (!moxObject.paths[moxPath][reqMethod].responses) {
					return error(req, res, 500, 'No endpoint responses found.');
				}
				else {
					if (!moxObject.paths[moxPath][reqMethod].responses['200']) {
						return error(req, res, 500, 'No endpoint success found.');
					}
					else {
						if (!moxObject.paths[moxPath][reqMethod].responses['200'].examples) {
							return error(req, res, 500, 'No endpoint examples found.');
						}
						else {
							if (!moxObject.paths[moxPath][reqMethod].responses['200'].examples['application/json']) {
								return error(req, res, 500, 'No endpoint json found.');
							}
							else {
								moxOutput = moxObject.paths[moxPath][reqMethod].responses['200'].examples['application/json'];
								if (moxRand) {
									moxOutput = randomizeOutput(moxOutput);
									console.log('moxOutput : ' +  JSON.stringify(moxOutput) );
								}
								return res.json(moxOutput);
							}
						}
					}
				}
			}
		}		
	};
}

//*******************************************************************
//exports

module.exports = moxai;
