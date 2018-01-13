// to run this server, use the command `npm run start`

const cookieKey = 'login';
const correct = {
    user: 'hilarious',
    pass: 'ch33secake'
};
const loginPage = '/public/login.html';

const ip = require('ip');
const colors = require('colors');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
const urlencodedParser = bodyParser.urlencoded({ extended: false });


app.get('/', function (req, res) {
    let target = req.cookies.login ? 'user/page/already.html' : loginPage;
    res.redirect(target);
    output(req, colors.dim(`redirect to ${target}`), res.statusCode);
});

//check POST message, gives cookie then serves content
app.post('/user/page/:file', urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    if (req.body.username === correct.user && req.body.pass === correct.pass) {
        res.cookie(cookieKey, true);
        res.sendFile(req.params.file, {root: `${__dirname}/user/page/`});
        output(req, colors.cyan('gave cookie'), res.statusCode);
    }
    else
        res.redirect('public/loginfailed.html');
});

//check cookie then serves content
app.get('/user/page/:file', function (req, res) {

    if (!req.cookies.login) {
        res.status(403).end();
        return;
    }
    
    res.sendFile(req.params.file, {root: `${__dirname}/user/page/`});
    if (req.params.file.endsWith('.html'))
        output(req, colors.cyan('allowed'), res.statusCode);
});

app.all('/user/logout*', function (req, res) {
    res.clearCookie(cookieKey);
    res.redirect(loginPage);
});

app.use('/public', express.static('public'));
app.use('/lib', express.static('lib'));

app.use(function (req, res) {
    res.status(404).end();
    output(req, colors.dim('not found'), res.statusCode);
});

const port = process.env.PORT || 3000;
app.listen(port);
let url = (`http://${colors.bold(ip.address())}:${colors.cyan(port.toString())}/`);
console.log(`Server running at ${colors.underline(url)}`);

// output(req, `message`, res.statusCode);
function output(req, info, statusCode) {

    let request;
    switch (req.method) {
    case 'GET':
        request = `${colors.green(req.method)} ${info}`;
        break;
    case 'POST':
        request = `${colors.blue(req.method)} ${colors.bold(info.magenta)}`;
        break;
    case false:
        request = 'invalid';
    default:
        request = colors.red(req.method);
    }
    let date = new Date();
    console.log(colors.dim(`[  ${date.getHours()}:${date.getMinutes()} ${date.getSeconds()} ]`)
        + ` ${req.ip} ${colors.italic(req.originalUrl)}: ${request} ${colors.magenta(statusCode)}`);
}
