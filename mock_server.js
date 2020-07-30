const express = require('express')
const bodyParser = require('body-parser');
const cjs = require("crypto-js")

const app = express()
app.use(bodyParser.json());
   
const port = 3001
//Make sure this is the same secret you provided in the webhook creation
const secret = "secret"


app.get('/', (req, res) => res.send('Hello World!'))
app.post('/webhook-endpoint', (req, res, next) => {

    const key = cjs.enc.Utf8.parse(secret)
    const message = cjs.enc.Utf8.parse(req.headers['x-loopr-event'])
    const computed_signature = cjs.enc.Hex.stringify(cjs.HmacSHA1(message, key))

    console.log(computed_signature)
    console.log(req.headers['x-loopr-signature'])
    if(req.headers['x-loopr-signature'] != 'sha1='+computed_signature){
        console.log('Error: computed_signature does not match signature provided in the headers')
        throw new Error('Error')
        
    }                            
    
    console.log('=========== New Webook Delivery ============')
    console.log("Event: " ,req.headers['x-loopr-event'])
    console.log("Payload: ",req.body)
    res.send("Success")
})
app.use(function(err, req, res, next) {
    res.status(400);
    res.send("Error")
 });

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))