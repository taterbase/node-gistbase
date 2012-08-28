//Library for gist calls
var https = require('https')
  ;

var get = function(token, id, cb){
  request(token, '/gists/' + id, 'GET', null, function(err, result){
    if(err)
      return cb(err);

    if(result.message)
      return cb(new Error(JSON.stringify(result)));

    cb(null, result);
  });
};

var create = function(token, gist, cb){
  request(token, '/gists', 'POST', gist, function(err, result){
    if(err)
      return cb(err);

    if(result.message) //Github sends a message when there was an error
      return cb(new Error(JSON.stringify(result)));

    cb(null, result);
  });
};

var del = function(token, id, cb){
  request(token, '/gists/' + id, 'DELETE', null, function(err, result){
    if(err)
      return cb(err);

    if(result.message)
      return cb(new Error(JSON.stringify(result)));

    cb(null, result);
  });
}

function request(token, path, method, data, cb){
  var response = '';
  data = data ? JSON.stringify(data) : null;

  var options = {
    host: 'api.github.com',
    path: path,
    method: method,
    headers: {
      'Authorization': 'token ' + token,
      'Content-Length': data ? data.length : 0,
      'Content-Type': 'application/json'
    }
  };

  var req = https.request(options, function(res){
    res.setEncoding('utf8');

    res.on('data', function(d){
      response += d;
    });

    res.on('end', function(){
      response = response ? JSON.parse(response) : {};
      return cb(null, response);
    });

    res.on('error', function(err){
      return cb(err);
    });
  });

  if(data)
    req.write(data);

  req.end();
}

module.exports.create = create;
module.exports.get = get;
module.exports.del = del;
