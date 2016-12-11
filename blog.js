var http = require('http'),
    fs = require('fs'),
    path = require('path');

var base = './blog';

var map = {};

var statics = [
    '/404.html',
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
        res.end(staticFiles[fullpath] || fs.readFileSync(base + fullpath));
    } catch (e){
        res.writeHead(404);
        res.end(staticFiles['/404.html']);
    }
}

var server = http.createServer(handleRequest);

server.listen(80, function(){ console.log('Server listening on port 8080')});
