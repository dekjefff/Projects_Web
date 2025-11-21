const express = require('express');
const router = express.Router();
const accountController = require('./accountController');



// method: post
// http://localhost:3030/signin
// Body
// {
//   "firstName": "First",
//   "lastName": "Last",
//   "email": "user@example.com",
//   "user_name": "username123",
//   "passwd": "secret123"
// }
//
// {
//  "firstName":"name2",
//  "lastName":"lastname2",
//  "email":"user2@example.com",
//  "user_name":"username123",
//  "passwd":"secret123"
//}

router.post("/signin", accountController.register);


// method: post
// - URL: http://localhost:3030/login
// Body
// {
//   "user_name": "admin1",
//   "passwd": "1234"
// } ต้องloginในwebsite

router.post("/login", accountController.logIn);





//method: get
// URL: http://localhost:3030/users
router.get("/users", accountController.getUsers);


// Return account info for the authenticated user
// URL: http://localhost:3030/accountInfo
// router.get("/accountInfo", accountController.verifyToken, accountController.getUserProfile);

// router.put("/updateProfile", accountController.verifyToken, accountController.updateUserProfile);


//method: get
// http://localhost:3030/users/1
router.get("/users/:customerId", accountController.getUserByCustomerId);




// - URL: http://localhost:3030/users/1
// {
//   "firstName": "Jaffrey",
//   "lastName": "Smith",
//   "gender": "M",
//   "email": "jaffrey@example.com",
//   "phone": "0812345678",
//   "membership_status": "VIP"
// }

router.put("/users/:customerId", accountController.updateUserByCustomerId);

module.exports = router;