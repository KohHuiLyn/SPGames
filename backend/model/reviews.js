//Admission Number: P2021672
//Name: Koh Hui Lyn
//Class: 1B05

const db = require('./databaseConfig');

reviews = {
    addReview : (userid, gameid, content, rating, callback)=>{
        let conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                //console.log("Connected!");
                let sql = 'insert into reviews (reviewerid, gameid, content, rating) values (?,?,?,?);';
                conn.query(sql, [userid, gameid,content,rating], (err, result) => {
                    conn.end();
                    //console.log(err.errno)
                    if (err) {
                        console.log(err);
                        console.log("Error Inserting Record!!");
                        return callback(err, null);
                    } else {
                        console.log(result);
                        return callback(null, { reviewid: result.insertId });
                    }
                });
            }
        });
    },
    getReviews: (gameid, callback) => {
        let conn = db.getConnection();
        conn.connect((err) => { 
            if (err) { 
                return callback(err,null);
            } else { 
                let sql = `
                SELECT r.gameid, r.content, r.rating, r.created_at, users.username
                FROM reviews r
                INNER JOIN users
                ON users.id = r.reviewerid and r.gameid = ?;`
                conn.query(sql, [gameid], (err,result) => {
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
    }
}

module.exports = reviews;