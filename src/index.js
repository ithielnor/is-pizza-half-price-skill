'use strict';
var Alexa = require('alexa-sdk');
const request = require("cheerio-req");

var APP_ID = "amzn1.ask.skill.0be12b2c-fd1a-4924-af28-5624bcc27deb";

var SKILL_NAME = "Is Pizza Half Price";
var GET_RESULT_MESSAGE = "Let me check... ";
var HELP_MESSAGE = "You can say is pizza half price, or, you can say exit...";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "Goodbye!";

var data = [
    "Yes, DC pizza is half price today. Use code NATS50.",
    "No, DC pizza is no half price today"
];

// CORE stuffs
exports.handler = function (event, context, callback)
{
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function ()
    {
        this.emit('GetNewFactIntent');
    },
    'GetNewFactIntent': function ()
    {
        request("http://ispizzahalfprice.com/dc", (err, $) =>
        {
            var result = $("section.verdict p").first().text().replace(".", ". ");

            this.emit(':tellWithCard', result, SKILL_NAME, result);
        });
    },
    'AMAZON.HelpIntent': function ()
    {
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function ()
    {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function ()
    {
        this.emit(':tell', STOP_MESSAGE);
    }
};