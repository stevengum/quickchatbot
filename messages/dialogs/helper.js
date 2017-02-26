/* Storage for helper functions */
let config = require('../config.js').config;


var helper = (function () {
    return {
        helperTest: true,
        LUISCall: function(request) {
        		let options = {
        			host: config.LuisAPIHostName,
        			path: '/luis/v2.0/apps/' + config.LuisAppId + '?subscription-key=' + config.LuisAPIKey + "&q=" + request.replace(/ /g, '%20')
        		};
                // let options = {
                //     host: luisAPIHostName,
                //     path: '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey + "&q=" + request.replace(/ /g, '%20')
                // }
        		let response = "";

        		return new Promise(function(resolve, reject){
        			let request = require("https").request(options, function(res){
        				res.setEncoding('utf8');
        				res.on('data', function(chunk) {
        					response += chunk;
        				});
        				res.on('error', function(err){
        					return reject(err);
        				});
        				res.on('end', function(){
        					if(!response) {
        						return resolve('');
        					}
        					return resolve(response);
        				});
        			}).end()
        		})
        },
        SWAPICall: function(requestObj) {
            // "requestObj.type" == "entity.type"
            // "requestObj.type.split.(".")[0]" == "entity.entity"
            let schema = requestObj.type.split(".")[0];
            let queryString = requestObj.entity;

    		let options = {
    			host: 'swapi.co',
    			path: '/api/' + schema + '/?search=' + queryString.replace(/ /g, '+'/*'%20'*/) + '&format=json'
    		};
    		let response = "";
    		return new Promise(function(resolve, reject){
    			let request = require("https").request(options, function(res){
    				res.setEncoding('utf8');
    				res.on('data', function(chunk) {
    					response += chunk;
    				});
    				res.on('error', function(err){
    					return reject(err);
    				});
    				res.on('end', function(){
    					if(!response) {
    						return resolve('');
    					}
                        // console.log(response);
    					return resolve(response);
    				});
    			}).end()
    		})
        },

    }
})();

exports.helper = helper;

/* Example LUIS Results:
{ score: 0.9945942,
  intent: 'FindPerson',
  intents: [ { intent: 'FindPerson', score: 0.9945942 } ],
  entities:
   [ { entity: 'han solo',
       type: 'person.name',
       startIndex: 16,
       endIndex: 23,
       score: 0.5053315 } ] }
*/




// .then(function(res) {
//             var json = JSON.parse(res);
//             var type = json.entities[0]['type'] ? json.entities[0]['type'] : null;
//             if(!type) {
//                 session.send("You didn't pick a valid Pokemon type, so I'll end the conversation!");
//                 builder.DialogAction.endDialog();
//             }
//             else if(type) {
//                 session.userData.PokemonType = type;
//                 session.beginDialog('/PickType', session);
//             }
//         })
