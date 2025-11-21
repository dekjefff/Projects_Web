const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();


const app = express();
const router = express.Router();
app.use(router);

router.use(express.json());
router.use(express.urlencoded({extended: true}));

app.use(cors());


//create option for cors that allowed get post put delete method
// const corsOption = {
//     origin: function (origin, callback){

//         if(!origin){
//             callback(null,true);
//         }else{
//             callback(new Error('Not allowed by CORS'))
//         }
//     },
//     methods: ['get','post','put','delete'],
//     credentials: true
// };

// app.use(cors(corsOption));

//Router to Product for controller
const productRouter = require('./Product/productRouter');
app.use(productRouter);

const accountRouter = require('./Account/accountRouter');
app.use(accountRouter);

<<<<<<<<< Temporary merge branch 1
const CustomerRouter = require('./Product/productRouter');
app.use(CustomerRouter);

=========
const customerRouter = require('./Customer/CustomerRouter');
app.use(customerRouter);
>>>>>>>>> Temporary merge branch 2


app.listen(process.env.port, () => {
    console.log(`Server is listening on ${process.env.port} port`);
});