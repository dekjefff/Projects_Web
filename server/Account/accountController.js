const DBcon = require('../Database/DBconnect');

const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

exports.signIn = (req,res) => {

    const {user_ID , user_name, passwd} = req.body;
    const hashPassword = bcrypt.hashSync(passwd, 8);

    if(!user_ID || !user_name|| !passwd){
        return res.status(404).send({error: true});
    };

    DBcon.query("INSERT INTO UserAccount set ?", {user_ID, user_name, passwd: hashPassword} , function(error,results){
        if(error) throw error;
        return res.send({
            error: false,
            data: results,
            message: "New account has been created succesfully"
        });

    });

};

exports.logIn = (req,res) => {

    const {user_ID , user_name , passwd} = req.body;

    DBcon.query("SELECT * FROM UserAccount WHERE user_ID = ?  OR user_name = ?", [user_ID , user_name] , (error,results) => {

        if(error) throw error;
        if(results.length === 0) return res.status(404).send({message: "User Acount Not Found"});

        const user = results[0];
        const passwdIsvalid = bcrypt.compareSync(passwd, user.passwd);

        if(!passwdIsvalid) return res.status(401).send({message: "Invalid password"});

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "1d"});

        res.send({message: "Login Sucessful", token})
        });

};

exports.verifyToken = (req,res,next) => {

    const token = req.headers["authorization"];
    if(!token) return res.status(403).send({message: "No token provided"});

    jwt.verify(token, process.env.JWT_SECRET, (error,decoded) => {

        if(error) return res.status(401).send({message: "Unauthorization"});
        req.user_ID = decoded.user_ID;
        next();
        
    });

};