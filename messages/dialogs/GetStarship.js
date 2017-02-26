/* Dialog for GetStarship intent */
let builder = require('botbuilder');
let helper = require('./helper.js').helper;

let GetStarship = (function () {
    return [
        (session, results, next) => {
            session.dialogData.entities = results.entities;
            // let response = builder.EntityRecognizer.findEntity(results.entities, 'starship');
            if (results.entities[0]) {
                next();
            } else {
                session.send("No search criteria detected.")
                builder.Prompts.text(session, "Which starship are you looking for?")
            }
        },
        (session, results, next) => {
            let searchObj = {};
            if(results.response) {
                // User provided a name, which is passed to this second step in the waterfall.
                if(!session.dialogData.entities[0]) {
                    // No results.entities exist.
                    session.send("Preparing query using search criteria:", results.response);
                    searchObj.type = "starships";
                    searchObj.entity = results.response;
                }
            } else if(session.dialogData.entities[0]){
                searchObj = session.dialogData.entities[0];
            }

            if(searchObj.entity) {
                let callResults = {};
                helper.SWAPICall(searchObj)
                .then(res => {
                    callResults = JSON.parse(res);
                    if(!callResults.results[0]["name"]) {
                        session.send("Error, no valid results.")
                    } else {

                        starship = callResults.results[0];
                        session.send("Here are the results:");
                        session.send(`Common Basic name: ${starship.name}`);
                        session.send(`Model: ${starship.model}`);
                        session.send(`Manufacturer: ${starship.manufacturer}`);
                        session.send(`Cost in Imperial Credits: ${starship.cost_in_credits}`);
                    }
                }).catch(function(e) {
                    console.log(e);
                })
                while(!callResults) {
                    SetTimeout(() => {
                        session.sendTyping();
                        SetTimeout(() => {
                            session.sendTyping();
                        }, 1000);
                    }, 2000);
                }
            }
            session.endDialog();
        },
        (session, results) => {
            // Placeholder for next step(s)
            session.send("You should not be here.")
            session.endDialog();
        },
    ];
})();

exports.GetStarship = GetStarship;

// { score: 0.9945942,
//   intent: 'FindPerson',
//   intents: [ { intent: 'FindPerson', score: 0.9945942 } ],
//   entities:
//    [ { entity: 'han solo',
//        type: 'person.name',
//        startIndex: 16,
//        endIndex: 23,
//        score: 0.5053315 } ] }
