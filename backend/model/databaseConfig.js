//Admission Number: P2021672
//Name: Koh Hui Lyn
//Class: 1B05

var mysql=require('mysql');

var dbConnect={

    getConnection:function(){
        var conn=mysql.createConnection({
            host:"localhost",
            //not using root acc
            user:"BEDuser", 
            password:"bed123",
            database:"spgames",
            dateStrings: true
        }

        );

        return conn;

    }
}
module.exports=dbConnect;