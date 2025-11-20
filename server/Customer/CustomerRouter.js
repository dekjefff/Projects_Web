const express = require('express');
const router = express.Router();
const CustomerInfo = require('./CustomerInfo');

router.use(express.json());
router.use(express.urlencoded({extended: true}));


router.post("/AddUser", CustomerInfo.customerProfile);

// router.get("/profile", CustomerInfo.verifyToken, (req,res) => {

//     res.send({message: "Protected route", user_ID: req.user_ID})

// })

module.exports = router;
