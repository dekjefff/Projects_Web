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

// Get list of users (paginated). Query params: page, limit, q, status, role


exports.getUsers = (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const q = req.query.q ? `%${req.query.q}%` : null;

    const offset = (page - 1) * limit;

    // build WHERE clause for search
    const where = [];
    const params = [];

    if (q) {
        where.push(`(ua.user_name LIKE ? OR c.firstName LIKE ? OR c.lastName LIKE ? OR c.email LIKE ?)`);
        params.push(q, q, q, q);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    // Count total
    const countSql = `SELECT COUNT(*) as total 
                      FROM UserAccount ua 
                      JOIN customer c ON ua.customer_ID = c.customer_ID
                      ${whereSql}`;
    
    DBcon.query(countSql, params, (err, countRes) => {
        if (err) return res.status(500).send({ error: true, message: err.message });
        const total = (countRes[0] && countRes[0].total) || 0;

        // Fetch users with pagination
        const listSql = `SELECT ua.user_ID, ua.user_name, c.firstName, c.lastName, c.gender, c.email 
                         FROM UserAccount ua 
                         JOIN customer c ON ua.customer_ID = c.customer_ID
                         ${whereSql}
                         ORDER BY ua.user_ID DESC
                         LIMIT ? OFFSET ?`;
        const listParams = params.concat([limit, offset]);

        DBcon.query(listSql, listParams, (err2, rows) => {
            if (err2) return res.status(500).send({ error: true, message: err2.message });

            const items = rows.map(r => ({
                id: r.user_ID,
                user_ID: r.user_ID,
                user_name: r.user_name,
                firstName: r.firstName,
                lastName: r.lastName,
                gender: r.gender,
                email: r.email
            }));

            res.send({ items, total });
        });
    });
};

// http://localhost:3030/users/:customerId  => get user by customer_ID


// GET /users/:customerId => get user by customer_ID
exports.getUserByCustomerId = (req, res) => {
  const paramId = req.params.customerId; // may be customer_ID or user_ID
  if (!paramId) return res.status(400).send({ error: true, message: "Missing id" });

  // Helper query: try to find by customer_ID first
  const sqlByCustomer = `
    SELECT ua.user_ID, ua.user_name, c.customer_ID, c.firstName, c.lastName, c.gender, c.email, c.phone, c.membership_status
    FROM UserAccount ua
    JOIN customer c ON ua.customer_ID = c.customer_ID
    WHERE c.customer_ID = ? LIMIT 1
  `;

  DBcon.query(sqlByCustomer, [paramId], (err, rows) => {
    if (err) return res.status(500).send({ error: true, message: err.message });
    if (rows && rows.length > 0) return res.send(rows[0]);

    // not found by customer_ID, try by user_ID
    const sqlByUser = `
      SELECT ua.user_ID, ua.user_name, c.customer_ID, c.firstName, c.lastName, c.gender, c.email, c.phone, c.membership_status
      FROM UserAccount ua
      JOIN customer c ON ua.customer_ID = c.customer_ID
      WHERE ua.user_ID = ? LIMIT 1
    `;

    DBcon.query(sqlByUser, [paramId], (err2, rows2) => {
      if (err2) return res.status(500).send({ error: true, message: err2.message });
      if (!rows2 || rows2.length === 0) return res.status(404).send({ error: true, message: "User not found" });
      res.send(rows2[0]);
    });
  });
};

// PUT /users/:customerId => update customer + username
exports.updateUserByCustomerId = (req, res) => {
  const paramId = req.params.customerId; // may be customer_ID or user_ID
  const { firstName, lastName, gender, email, phone, user_name, membership_status } = req.body;

  if (!paramId) return res.status(400).send({ error: true, message: "Missing id" });

  // Resolve to a canonical customerId and userId (if available)
  const resolveIds = (id, cb) => {
    // try find by customer_ID
    DBcon.query('SELECT customer_ID FROM customer WHERE customer_ID = ? LIMIT 1', [id], (err, rows) => {
      if (err) return cb(err);
      if (rows && rows.length > 0) return cb(null, rows[0].customer_ID, null);

      // try find by user_ID
      DBcon.query('SELECT user_ID, customer_ID FROM UserAccount WHERE user_ID = ? LIMIT 1', [id], (err2, rows2) => {
        if (err2) return cb(err2);
        if (!rows2 || rows2.length === 0) return cb(null, null, null);
        return cb(null, rows2[0].customer_ID, rows2[0].user_ID);
      });
    });
  };

  resolveIds(paramId, (err, customerId, userId) => {
    if (err) return res.status(500).send({ error: true, message: err.message });
    if (!customerId) return res.status(404).send({ error: true, message: 'User not found' });

    const customerFields = [];
    const customerParams = [];

    if (firstName !== undefined) { customerFields.push("firstName = ?"); customerParams.push(firstName); }
    if (lastName !== undefined) { customerFields.push("lastName = ?"); customerParams.push(lastName); }
    if (gender !== undefined) { customerFields.push("gender = ?"); customerParams.push(gender); }
    if (email !== undefined) { customerFields.push("email = ?"); customerParams.push(email); }
    if (phone !== undefined) { customerFields.push("phone = ?"); customerParams.push(phone); }
    if (membership_status !== undefined) { customerFields.push("membership_status = ?"); customerParams.push(membership_status); }

    if (customerFields.length === 0 && user_name === undefined) {
      return res.status(400).send({ error: true, message: "No fields provided to update" });
    }

    const updateCustomerSql = `UPDATE customer SET ${customerFields.join(", ")} WHERE customer_ID = ?`;
    customerParams.push(customerId);

    const runUpdateCustomer = (cb) => {
      if (customerFields.length === 0) return cb(null);
      DBcon.query(updateCustomerSql, customerParams, (err3, result) => {
        if (err3) return cb(err3);
        cb(null, result);
      });
    };

    runUpdateCustomer((errRun) => {
      if (errRun) return res.status(500).send({ error: true, message: errRun.message });

      if (user_name !== undefined) {
        // if we don't have a userId (because param was customerId), find it
        const ensureUserId = (next) => {
          if (userId) return next(null, userId);
          DBcon.query('SELECT user_ID FROM UserAccount WHERE customer_ID = ? LIMIT 1', [customerId], (err4, rows4) => {
            if (err4) return next(err4);
            if (!rows4 || rows4.length === 0) return next(new Error('User not found for customer'));
            return next(null, rows4[0].user_ID);
          });
        };

        ensureUserId((errU, finalUserId) => {
          if (errU) return res.status(500).send({ error: true, message: errU.message });

          const checkSql = `SELECT user_ID FROM UserAccount WHERE user_name = ? AND user_ID <> ? LIMIT 1`;
          DBcon.query(checkSql, [user_name, finalUserId], (errCheck, rowsCheck) => {
            if (errCheck) return res.status(500).send({ error: true, message: errCheck.message });
            if (rowsCheck.length > 0) return res.status(409).send({ error: true, message: "user_name already in use" });

            const updateUserSql = `UPDATE UserAccount SET user_name = ? WHERE user_ID = ?`;
            DBcon.query(updateUserSql, [user_name, finalUserId], (err5) => {
              if (err5) return res.status(500).send({ error: true, message: err5.message });
              return res.send({ error: false, message: "User updated (customer + username)" });
            });
          });
        });
      } else {
        return res.send({ error: false, message: "User updated (customer)" });
      }
    });
  });
};
