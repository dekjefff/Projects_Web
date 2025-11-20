const express = require('express');
const router = express.Router();
const accountController = require('./accountController');

router.use(express.json());
router.use(express.urlencoded({extended: true}));


// URL for register:  http://localhost:3030/signin
// Body
// {
//   "user_ID": "0006787095",
//   "user_name": "dekJeff",
//   "passwd": "123456"
// }
router.post("/signin", accountController.register);
router.post("/login", accountController.logIn);

router.get("/profile", accountController.verifyToken, (req,res) => {

    res.send({message: "Protected route", user_ID: req.user_ID})

})

module.exports = router;
