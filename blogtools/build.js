var fs = require('fs');

var template = fs.readFileSync(__dirname + '/template.html','utf8');

var index = fs.readFileSync(__dirname + '/indexTemplate.html','utf8');

var posts = {};

function metaToHTML(metadata, active){
  var fin = '<div class="title' + ((active)?' current':'') + '"><a href="' + metadata.path + '">' + metadata.title + '</a></div>';
      fin += '<div class="description">' + metadata.description + '</div>';
      fin += '<div class="date">' + metadata.date + '</div>';
      fin += '<div class="split"></div>';                                                                           
  return fin;
}

function buildPostHTML(file, cb){
  var post = fs.readFileSync(file, 'utf8');
  metadataEnd = post.indexOf('}') + 1;
  var metadata = JSON.parse(post.substr(0, metadataEnd).trim()); 
  posts[metadata.path] = metadata;
  var fin = metaToHTML(metadata, true);
  fin += '<div class="full">';
  var txt = post.substring(metadataEnd, post.length);
  txt = txt.replace(/\r\n\r\n/g, '<p>')
           .replace(/\n\n/g, '<p>')
           .replace(/&</g, '&lt;')
           .replace(/&>/g, '&gt;')
           .replace(/<a href/g, '<a target="_blank" href');
  fin += txt;
  fin += '</div>';
  try {
    fs.mkdirSync(__dirname + '/blog/' + metadata.path);
  } catch (e){
   console.log('Post Already Exists');
  }
  fs.writeFileSync(__dirname + '/blog/' + metadata.path + '/index.html', 
    template.replace('{{POST}}', fin).replace('{{DESCRIPTION}}', metadata.description).replace('{{TITLE}}', metadata.title));
  cb(metadata.path);
}

fs.readdirSync(__dirname + '/posts').forEach(function(folder){
  path = __dirname + '/posts/' + folder;
  buildPostHTML(path + '/post.jst', function(npath){
    var files = fs.readdirSync(path);
    files.forEach(function(file){
      fs.createReadStream(path + '/' + file).pipe(fs.createWriteStream(__dirname + '/blog/' + npath + '/' + file));
    })
  });
})

var orderedPosts = Object.keys(posts).sort(function(a,b){
  return ((new Date(posts[a].date.replace(/(nd|th|st|rd)/, ''))).getTime() >= (new Date(posts[b].date.replace(/(nd|th|st|rd)/,''))).getTime())
})

orderedPosts.forEach(function(post){
  console.log(post);
  index = index.replace('<post>', '<post><div class="post">' + metaToHTML(posts[post]) + '</div>');
})

fs.writeFileSync(__dirname + '/blog/index.html', index);

