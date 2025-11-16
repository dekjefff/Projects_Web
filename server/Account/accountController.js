const DBcon = require('../Database/DBconnect');

const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

exports.signIn = (req,res) => {

    const {user_name, passwd} = req.body;
    const user_ID = Date.now().toString();  
    const hashPassword = bcrypt.hashSync(passwd, 8);

    if(!user_name|| !passwd){
        return res.status(400).send({error: true, message: error.message});
    };

    const sqlCheck = "SELECT * FROM UserAccount WHERE user_name = ?";
    DBcon.query(sqlCheck, [user_name], (error, results) => {
    if (error) return res.status(500).send({ error: true, message: error.message });

    if (results.length > 0) {
      return res.status(400).send({message: "user name is exists" });
    }

    DBcon.query("INSERT INTO UserAccount set ?", {user_ID, user_name, passwd: hashPassword} , function(error,results){
    if (error) return res.status(500).send({ error: true, message: error.message });
    return res.send({
        error: false,
        data: results,
        user_ID,
        message: "New account has been created succesfully"
        });

    });
});
}

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