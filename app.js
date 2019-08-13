'use strict';

const {WebhookClient, Suggestion} = require('dialogflow-fulfillment');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');



// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-east-1'});

var ses = new AWS.SES();

//var nodemailer = require("nodemailer");

var express = require('express');
const app = express();
const router = express.Router();

router.use(compression());
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(awsServerlessExpressMiddleware.eventContext());

router.post('/', (request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    function welcome(agent) {
      agent.add(`Welcome to my agent on AWS Lambda!`);
    }

//Run the proper function handler based on the matched Dialogflow intent name for Amazon SES
    function enviaEmail(agent) {
      agent.add(`Obrigado, compra efetuada com sucesso. Você receberá um email de confirmação!`);

      var eParams = {
        Destination: {
            ToAddresses: ["email@email.com"]
        },
        Message: {
            Body: {
                Text: {
                    Data: "Obrigado.Compra de Minions efetuada com sucesso."
                }
            },
            Subject: {
                Data: "Confirmação de compra na Loja de Minions"
            }
        },
        Source: "email@email.com"
      };
      var email = ses.sendEmail(eParams, function(err, data){
        if(err){
          console.log("Funcionou");
          console.log(err);
        }
        else {
          console.log("===EMAIL SENT===");
          console.log(data);
        }
      });

    }

    function fallback(agent) {
      agent.add(`I didn't understand`);
      agent.add(`I'm sorry, can you try again?`);
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    //Run the proper function handler based on the matched Dialogflow intent name for Amazon SES
    intentMap.set('Email', enviaEmail);
    intentMap.set('enviaEmail', enviaEmail);
    agent.handleRequest(intentMap);
});

app.use('/', router);

module.exports = app;
