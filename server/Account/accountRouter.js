const express = require('express');
const router = express.Router();
const accountController = require('./accountController');
const { put } = require('../Customer/CustomerRouter');



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

    // verifyToken middleware sets `req.user_name` (decoded from token)
    res.send({ message: "Protected route", user_name: req.user_name });

});

// Route to retrieve customer_ID by user_ID or user_name (query param)
// Example: GET /customerID?user_name=dekJeff  OR  /customerID?user_ID=000123
// router.get("/customerID", accountController.getCustomerID);


router.get("/accountInfo", accountController.getUserProfile);

router.put("/updateProfile", accountController.verifyToken, accountController.updateUserProfile);

module.exports = router;