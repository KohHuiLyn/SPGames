var jwt    = require('jsonwebtoken');
var config = require('../config');

function verifyToken(req, res, next) {
    console.log(req);

    var token = req.headers['authorization']; //retrieve authorization header’s content
    // console.log(token);

    if (!token || !token.includes('Bearer')) { //process the token
        res.status(403).type('application/json');
        res.json({ auth: false, message: 'Not authorized!' });
    } else {
        token = token.split(' ')[1]; //obtain the token’s value
        // console.log(token);
        jwt.verify(token, config.key, function (err, decoded) {//verify token
            if (err) {
                console.log("IN HERE");
                res.status(403).type('application/json');
                res.json({ auth: false, message: 'Not authorized!' });
            } else {
                //the userid of the LOGGED IN PERSON ie user 2 login, then req become 2 also
                req.userid = decoded.userid; //decode the userid and store in req for use
                req.role = decoded.role; //decode the role and store in req for use
                next();
            }
        });
    }
}

module.exports = verifyToken;
