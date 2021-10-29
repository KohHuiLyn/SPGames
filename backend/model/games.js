//Admission Number: P2021672
//Name: Koh Hui Lyn
//Class: 1B05

const db = require('./databaseConfig.js');

const games = {
    addGame : (title, description, price, platform, categoryid, year, callback)=>{
        let conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                //console.log("Connected!");
                let sql = 'Insert into spgames.games(title, description, price, platform, categoryid, year) values(?,?,?,?,?,?)';
                conn.query(sql, [title, description, price, platform, categoryid, year], (err, result) => {
                    conn.end();
                    if (err) {
                        if (err.errno==1062){
                            console.log("dupe!!")
                            err.statusCode = 422;
                            return callback(err,null);
                        }
                    } else {
                        console.log(result);
                        return callback(null, { gameid: result.insertId });
                    }
                });
            }
        });
    },
    getPlatform: (platform, callback) => {
        let conn = db.getConnection();
        conn.connect((err) => { 
            if (err) { 
                return callback(err,null);
            } else { 
                let sql = `select category.catname, games.* from category, games
                where games.categoryid = category.catid and games.platform = ?`
                conn.query(sql, [platform], (err,result) => {
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
    delGame : (gameid, callback) => {
        let conn = db.getConnection();
        conn.connect((err) => { 
            if (err) {
                return callback(err,null);
            } else { 
                let sql = 'DELETE from games WHERE gameid = ?'
                conn.query(sql, [gameid], (err,result) => {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } 
                    else {   
                        return callback(null,result);
                    }
                });  
            }
        });
    },
    updateGame : (title, description, price, platform, categoryid, year, gameid, callback)=>{
        let conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected!");
                let sql = 'UPDATE games SET title=?, description=?, price=?, platform=?, categoryid=?, year=? WHERE gameid=?';
                conn.query(sql, [title, description, price, platform, categoryid, year, gameid], (err, result) => {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        console.log(result);
                        return callback(null, result);
                    }
                });
            }
        });
    },
    getGames: (callback) =>{
        let conn = db.getConnection();
        conn.connect((err) => { 
            if (err) {
                return callback(err,null);
            } else {
                let sql = 'SELECT * FROM games ORDER BY title asc'
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

    getGameID: (id, callback) => {
        let conn = db.getConnection();
        conn.connect((err) => { 
            if (err) {
                return callback(err,null);
            } else {
                let sql = 'SELECT * FROM games WHERE gameid = ?';
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
    //(extra) Add picture to a game listing
    addPic : (gameid, pic, callback) => {
        let conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected!");
                console.log(pic.filename)
                let sql = "update games set pic_url = ? where gameid = ? "
                conn.query(sql, ['http://localhost:8081/uploads/'+pic.filename, gameid], (err, result) => {
                    conn.end();
                    if (err) {
                        console.log("error:" +err);
                        err.statusCode = 500;
                        return callback(err, null);
                    } else {
                        console.log(result);
                        return callback(null, { pic_url: 'http://localhost:8081/uploads/'+pic.filename});
                    }
                });
            }
        });
    },
    //find picture of a game
    showPic : (gameid, callback)=>{
        let conn = db.getConnection();
        conn.connect((err) => { 
            if (err) {
                return callback(err,null);
            } else {
                let sql = 'SELECT pic_url FROM games WHERE gameid = ?';
                conn.query(sql, [gameid], (err,result) => {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else {  
                        // result = (result[0].pic_url)
                        return callback(null,result);
                    } 
                });
            }
        });
    },
    // (extra) SEARCH FOR A GAME BY WORDS
    search: (search, maxPrice, callback)=>{
        var search = "%"+search+"%";
        var maxPrice = parseFloat(maxPrice).toFixed(2); 
        let conn = db.getConnection();
        conn.connect((err) => { 
            if (err) { 
                return callback(err,null);
            } else { 
                let sql = 'select * from games where title like ?  and price < ? order by title asc'
                conn.query(sql, [search, maxPrice], (err,result) => {
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
    searchPrice : (maxPrice, callback)=>{
        var maxPrice = parseFloat(maxPrice).toFixed(2); 
        let conn = db.getConnection();
        conn.connect((err) => { 
            if (err) { 
                return callback(err,null);
            } else { 
                let sql = 'select * from games where price < ? order by title asc'
                conn.query(sql, [maxPrice], (err,result) => {
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
    //(extra) FIND ALL GAMES CATID
    findbyID : (catid, callback)=>{
        let conn = db.getConnection();
        console.log("asd")
        conn.connect((err) => { 
            if (err) { 
                return callback(err,null);
            } else { 
                const sql = `SELECT category.catname, games.* FROM category, games
                WHERE games.categoryid = category.catid AND games.categoryid = ?`
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
    getPlatforms: (callback) =>{
        let conn = db.getConnection();
        conn.connect((err) => { 
            if (err) {
                return callback(err,null);
            } else {
                let sql = 'SELECT distinct platform FROM spgames.games;'
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
    }
}

module.exports = games;