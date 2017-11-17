var http = require('http'),
    zlib = require('zlib'),
    fs = require('fs'),
    path = require('path');

var base = './blog';

var map = {};

var statics = [
    '/404.html',
    '/about.html',
    '/css/all.css',
    '/js/all.js',
    '/favicon.ico'
]

var staticFiles = (function buildStatics(files){
    var stat = {};
    files.forEach(function(f){
        stat[f] = fs.readFileSync(base + f);
    })
    return stat;
})(statics);

function handleRequest(req, res){
    var fullpath = map[req.url] || req.url;
    if (path.parse(fullpath).ext == '') fullpath += '/index.html'; // a folder
    try {
        if (req.headers['accept-encoding'] &&  /\bgzip\b/.test(req.headers['accept-encoding'])) {
            res.writeHead(200, {'Content-Encoding': 'gzip'});
            zlib.gzip(staticFiles[fullpath] || fs.readFileSync(base + fullpath), function (err, result){
                res.end(result);
            });
        } else {
            res.end(staticFiles[fullpath] || fs.readFileSync(base + fullpath));
        }
    } catch (e){
        console.log(e)
        res.writeHead(404);
        res.end(staticFiles['/404.html']);
    }
}

var server = http.createServer(handleRequest);

server.listen(process.env.PORT || 8080, function(){ console.log('Server listening on port ', process.env.port || 8080)});
