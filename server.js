// to run this server, use the command `node server.js`
const ip = require('ip');
const colors = require('colors');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.get('/', function (req, res) {
    const redir = '/public/login.html';
    res.redirect(redir);
    output(req, colors.dim(`redirect to ${redir}`), res.statusCode);
});

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });
// POST /login gets urlencoded bodies
app.post('/login', urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const correct = {
        user: 'hilarious',
        pass: 'ch33secake'
    }

    if (req.body.username === correct.user && req.body.pass === correct.pass) {
        //TODO give them a login cookie
        res.redirect('user/page/index.html');
    }
    else {
        res.redirect('public/loginfailed.html');
    }
});

app.get('/user/page/:file', function (req, res) {
    res.sendFile(req.params.file, {root: `${__dirname}/user/page/`});
    if (req.params.file.endsWith('.html'))
        output(req, colors.cyan('allowed'), res.statusCode);
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
    const date = new Date();
    console.log(colors.dim(`[  ${date.getHours()}:${date.getMinutes()} ${date.getSeconds()} ]`)
        + ` ${req.ip} ${colors.italic(req.originalUrl)}: ${request} ${colors.magenta(statusCode)}`);
}
