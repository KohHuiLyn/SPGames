//Admission Number: P2021672
//Name: Koh Hui Lyn
//Class: 1B05

const db = require('./databaseConfig.js');

const category = {
    addCat : (catname, description, callback)=>{
        let conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                //console.log("Connected!");
                let sql = 'Insert into spgames.category(catname, description) values(?,?)';
                conn.query(sql, [catname, description], (err, result) => {
                    conn.end();
                    //console.log(err.errno)
                    if (err) {
                        if (err.errno==1062){
                            console.log("dupe!!")
                            err.statusCode = 422;
                            return callback(err,null);
                        }
                        console.log("Error Inserting Record!!");
                        err.statusCode = 500;
                        return callback(err, null);
                    } else {
                        console.log(result);
                        return callback(null, { id: result.insertId });
                    }
                });
            }
        });
    },
    updateCat : (catname, description, id, callback)=>{
        let conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected!");
                let sql = 'UPDATE spgames.category SET catname=?, description=? WHERE catid=?';
                conn.query(sql, [catname, description, id], (err, result) => {
                    conn.end();
                    if (err) { //error
                        if (err.errno==1062){ //if there's a duplicate
                            console.log("Dupe!!")
                            err.statusCode = 422;
                            return callback(err,null);
                        }
                        console.log("Error Inserting Record!!");
                        err.statusCode = 500;
                        return callback(err, null);
                    } else { //no error
                        console.log(result);
                        return callback(null, { id: result.insertId });
                    }
                });
            }
        });
    },
    getCatname: (catid, callback) => {
        let conn = db.getConnection();
        conn.connect((err) => { 
            if (err) { 
                return callback(err,null);
            } else { 
                let sql = `
                SELECT catname 
                FROM category 
                inner join games
                where catid=categoryid and categoryid=?;`
                conn.query(sql, [catid], (err,result) => {
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
    getCat: (callback) =>{
        let conn = db.getConnection();
        conn.connect((err) => { 
            if (err) {
                return callback(err,null);
            } else {
                let sql = 'SELECT * FROM spgames.category'
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
}

module.exports = category;