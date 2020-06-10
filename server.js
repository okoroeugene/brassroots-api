var express = require('express');
var app = express();
require('dotenv').config();
var morgan = require('morgan');
var cors = require('cors');
const socket = require('./src/services/SocketService');
const firestore = require('./config');
const uri = process.env.NODE_ENV == 'production' ? process.env.DB_PROD : process.env.DB_DEV;
const port = process.env.PORT || 8082;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

var server = app.listen(port, () => console.log(`app listening at ${port}`));
const io = require('socket.io')(server);

app.get('/', async (req, res) => {
    // const id = "ne8e7eh481jm1zodya5uvkbbb";
    // let batch = await firestore.batch();
    // const userRef = await firestore.collection('users').doc(id);
    // batch.update(userRef, {
    //     displayName: 'Ultrasound 1',
    // })
    // await batch.commit();
    // var userRef = (await firestore.collection('users').get()).docs;
    // userRef.map(e => console.log(e.data()))
    res.send("Welcome to brassroots!");
})

socket.init(server);