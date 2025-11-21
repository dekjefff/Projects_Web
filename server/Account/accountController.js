const DBcon = require('../Database/DBconnect');

const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

// exports.signIn = (req,res) => {

//     const {user_name, passwd} = req.body;
//     const user_ID = Date.now().toString();  
//     const hashPassword = bcrypt.hashSync(passwd, 8);

//     if(!user_name|| !passwd){
//         return res.status(400).send({error: true, message: error.message});
//     };

//     const sqlCheck = "SELECT * FROM UserAccount WHERE user_name = ?";
//     DBcon.query(sqlCheck, [user_name], (error, results) => {
//     if (error) return res.status(500).send({ error: true, message: error.message });

//     if (results.length > 0) {
//       return res.status(400).send({message: "user name is exists" });
//     }

//     DBcon.query("INSERT INTO UserAccount set ?", {user_ID, user_name, passwd: hashPassword} , function(error,results){
//     if (error) return res.status(500).send({ error: true, message: error.message });
//     return res.send({
//         error: false,
//         data: results,
//         user_ID,
//         message: "New account has been created succesfully"
//         });

//     });
// });
// }

exports.register = (req, res) => {
  const {firstName,lastName,email,user_name, passwd } = req.body;
  const user_ID = Date.now().toString();
  const hashPassword = bcrypt.hashSync(passwd, 8);

  if (!firstName || !lastName || !email || !user_name || !passwd) {
    return res.status(400).send({ error: true, message: "Missing fields" });
  }

  // 1. Insert Customer ก่อน
  const sqlCustomer = "INSERT INTO customer SET ?";
  DBcon.query(sqlCustomer, { firstName, lastName, email }, (error, customerResult) => {
    if (error) return res.status(500).send({ error: true, message: error.message });

    const customer_ID = customerResult.insertId;

    // 2. Insert UserAccount โดยผูกกับ customer_ID
    const sqlAccount = "INSERT INTO UserAccount SET ?";
    DBcon.query(sqlAccount, { user_ID, user_name, passwd: hashPassword, customer_ID }, (error, accountResult) => {
      if (error) return res.status(500).send({ error: true, message: error.message });

      return res.send({
        error: false,
        user_ID,
        customer_ID,
        message: "Customer and Account created successfully"
      });
    });
  });
};

exports.logIn = (req,res) => {

    const {user_ID , user_name , passwd} = req.body;

    DBcon.query("SELECT * FROM UserAccount WHERE user_ID = ?  OR user_name = ?", [user_ID , user_name] , (error,results) => {


        if (error) return res.status(500).send({ error: true, message: error.message });
        if(results.length === 0) return res.status(404).send({message: "User Acount Not Found"});

        const user = results[0];
        const passwdIsvalid = bcrypt.compareSync(passwd, user.passwd);

        if(!passwdIsvalid) return res.status(401).send({message: "Invalid password"});

        const token = jwt.sign({user_name: user.user_name}, process.env.JWT_SECRET, {expiresIn: "1d"});

        res.send({message: "Login Sucessful", token})
        });

};

exports.verifyToken = (req,res,next) => {

    const authHeader = req.headers["authorization"];
    if(!authHeader) return res.status(403).send({message: "No token provided"});

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (error,decoded) => {

        if(error) return res.status(401).send({message: "Unauthorization"});
        req.user_name = decoded.user_name;
        next();
        
    });

};

exports.getUserProfile = (req,res) => {

    const user_name = req.user_name;
    DBcon.query("SELECT ua.user_ID, ua.user_name, c.firstName, c.lastName, c.email FROM UserAccount ua JOIN customer c ON ua.customer_ID = c.customer_ID WHERE ua.user_name = ?", [user_name], (error,results) => {

        if (error) return res.status(500).send({ error: true, message: error.message });
        if(results.length === 0) return res.status(404).send({message: "User Acount Not Found"});
        res.send({data: results[0]});

    });

};

exports.updateUserProfile = (req,res) => {    
    const user_name = req.user_name;
    const {firstName, lastName, email} = req.body;
    DBcon.query("UPDATE customer c JOIN UserAccount ua ON c.customer_ID = ua.customer_ID SET c.firstName = ?, c.lastName = ?, c.email = ? WHERE ua.user_name = ?", [firstName, lastName, email, user_name], (error,results) => {

        if (error) return res.status(500).send({ error: true, message: error.message });  
        return res.send({
            error: false,
            data: results,
            message: "User profile has been updated successfully"
        });
    });
};

// // Get customer_ID by user_ID or user_name (query parameters)
// exports.getCustomerID = (req, res) => {
//   const { user_ID, user_name } = req.query;

//   if (!user_ID && !user_name) {
//     return res.status(400).send({ error: true, message: 'Provide user_ID or user_name as query parameter' });
//   }

//   const sql = `SELECT customer_ID FROM UserAccount WHERE ${user_ID ? 'user_ID = ?' : 'user_name = ?'} LIMIT 1`;
//   const param = user_ID || user_name;

//   DBcon.query(sql, [param], (error, results) => {
//     if (error) return res.status(500).send({ error: true, message: error.message });
//     if (!results || results.length === 0) return res.status(404).send({ error: true, message: 'Customer not found' });

//     return res.send({ error: false, customer_ID: results[0].customer_ID });
//   });
// };


