//Admission Number: P2021672
//Name: Koh Hui Lyn
//Class: 1B05

const app = require('./controller/app');

const hostname = 'localhost';
const port = 8081;

let server = app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});