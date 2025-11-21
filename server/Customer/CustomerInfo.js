const DBcon = require('../Database/DBconnect');

const dotenv = require('dotenv');
dotenv.config();

exports.customerAssdress = () => {

    let address = req.body.shipping_address;
    
    if(!address){
        return res.status(404).send({error:true});
    };

    DBcon.query("INSERT INTO product shipping_address ?", address, function (error, results){
        if(error) throw error;
        return res.send({
            error: false,
            data: results,
            message: "new Address has been created successfully"
        });
    });
};

exports.customerProfile = () => {

    let Fname = req.body.customer.firstname;
    let Lname = req.body.customer.lasttname;
    let email = req.body.customer.email;
    let phone = req.body.customer.Phone;
    let gender = req.body.customer.gender;
    
    if(!Fname || !Lname || !email || !phone || !gender){
        return res.status(404).send({error:true, error: message});
    };

    DBcon.query("INSERT INTO product customer SET ?", [Fname, Lname, email, phone, gender], function (error, results){
        if(error) throw error;
        return res.send({
            error: false,
            data: results,
            message: "new Address has been created successfully"
        });
    });
};


exports.customerProfile = () => {

    DBcon.query("SELECT * FROM customer SET ?", [Fname, Lname, email, phone, gender], function (error, results){
        if(error) throw error;
        return res.send({
            error: false,
            data: results,
            message: "new Address has been created successfully"
        });
    });
}