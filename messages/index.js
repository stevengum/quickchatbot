// Original Templaye from Azure Bot Service LUIS-type
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

var useEmulator = (process.env.NODE_ENV == 'development');
/* Uncomment below to make the bot deployable */

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});
/* end of deployable section */

/* This line allows the bot to be worked on without using Visual Studio, and only using the CLI  */
// var connector = new builder.ConsoleConnector().listen();

var bot = new builder.UniversalBot(connector);

/* LUIS variables for deployment */
// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;
/* End stock variables */

/* LUIS variables for debugging with CLI */
// var config = require('./config.js').config;
//
// var luisAppId = config.luisAppId;
// var luisAPIKey = config.luisAPIKey;
// var luisAPIHostName = 'westus.api.cognitive.microsoft.com';
//
// const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;
/* End debugging with CLI variables */

var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] })

bot.dialog('/', dialog);

dialog.matches('GetStarship', (session, results) => {
    session.beginDialog('/GetStarship', results);
})

bot.dialog('/GetStarship', require('./dialogs/GetStarship.js').GetStarship)
    .cancelAction('cancelQueryAction', "Query canceled.", {
        matches: /cancel/i,
        confirmPrompt: "Please confirm cancelling of query."
    })

dialog.onDefault((session) => {
    session.send('Sorry, I did not understand "%s".', session.message.text);
    session.sendTyping();
    session.send('I can assist you with researching a starship. You may initiate the search by saying statements such as, "Tell me about the Death Star", "I\'m looking for the Slave 1.", or "What do you know about the X-Wing?", etc.');
});


/* this code below is required, otherwise bot will not run on ABS */
/* While developing on a CLI, this area must be commented out otherwise your chatbot is operating with two listeners (double the fun) */
if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
} else {
    module.exports = { default: connector.listen() }
}
