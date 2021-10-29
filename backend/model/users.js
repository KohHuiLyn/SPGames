//Admission Number: P2021672
//Name: Koh Hui Lyn
//Class: 1B05

const db = require('./databaseConfig.js');
const jwt = require('jsonwebtoken');
const config = require('../config');


const users = {
    getUsers: (callback) =>{
        let conn = db.getConnection();
        conn.connect((err) => { 
            if (err) {
                return callback(err,null);
            } else {
                let sql = 'SELECT * FROM spgames.users'
                conn.query(sql, (err,result) => {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else {  
                        return callback(null,result);
                    }
                })
            }
        })
    },
    addUser : (username, email, type, password, profile_pic_url, callback)=>{
        let conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected!");
                let sql = 'Insert into spgames.users(username, email, type, password, profile_pic_url) values(?,?,?,?,?)';
                conn.query(sql, [username, email, type, password, profile_pic_url], (err, result) => {
                    conn.end();
                    if (err) {
                        console.log("Error Inserting Record!!"+err);
                        return callback(err, null);
                    } else {
                        console.log(result);
                        return callback(null, { id: result.insertId });
                    }
                });
            }
        });
    },
    getUser: (id, callback) => {
        let conn = db.getConnection();
        conn.connect((err) => { 
            if (err) {
                return callback(err,null);
            } else {
                let sql = 'SELECT * FROM users WHERE id = ?';
                conn.query(sql, [id], (err,result) => {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else {  
                        return callback(null,result);
                    } 
                });
            }
        });
    },
    loginUser: function (email, password, callback) { //callback function must correspond to the app.js one
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null, null);
            } else {
                console.log("Connected!");
                var sql = 'SELECT * FROM users WHERE email=? and password=?';
                conn.query(sql, [email, password], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null, null);
                    } else {
                        var token = "";
                        if (result.length == 1) { //its a match if there is a record that matches the login info
                            let payload = { id: result[0].userid, role: result[0].role };
                            token = jwt.sign(payload, config.key, {
                                expiresIn: 86400//expires in 24 hrs
                            });
                            return callback(null, token, result); //result = user info *
                        }
                        else { //if no records that match the login .. (ERROR)
                            let errObj = new Error("UserID/password does not match");
                            return callback(err,null,null)
                        }

                    }
                });
            }
        });
    }
}

module.exports = users;