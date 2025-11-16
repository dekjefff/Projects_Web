const express = require('express');
const router = express.Router();
const accountController = require('./accountController');

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.post("/signin", accountController.signIn);
router.post("/login", accountController.logIn);

router.get("/profile", accountController.verifyToken, (req,res) => {

    res.send({message: "Protected route", user_ID: req.user_ID})

})

module.exports = router;
