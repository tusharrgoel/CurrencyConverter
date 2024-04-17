const express = require('express');
const rateLimit = require('express-rate-limit')
const PORT = process.env.PORT||5000;
require("dotenv").config();
const app  =  express()
const axios = require("axios");
const cors = require("cors");

const apiLimiter = rateLimit({
    windowMs: 15*60*1000,
    max:100 // each ip to 100 requests
})

const API_URL = "https://v6.exchangerate-api.com/v6";
const API_KEY = process.env.EXCHANGE_RATE_API_KEY;

const corsOptions = {
    origin:['http://localhost:5173']
}

//Middlewares
app.use(express.json());
app.use(apiLimiter);
app.use(cors(corsOptions));

//routes
app.post('/api/convert',async(req,res)=> {
       try{
        const {from,to,amount} = req.body;
        const url = `${API_URL}/${API_KEY}/pair/${from}/${to}/${amount}`
        console.log(url);
        const response = await axios.get(url);
        if(response.data && response.data.result === "success"){
            res.json({
                base:from,
                target:to,
                conversionRate:response.data.conversion_rate,
                convertedAmount:response.data.conversion_result,
            })
        }else{
            res.json({message:"Error converting currency",details :response.data})
        }
    }
    catch(err){
        res.json({message:"Error converting currency",details :err.message})

    }
})

//Start the Server
app.listen(PORT,console.log(`Server is running on port ${PORT}`));