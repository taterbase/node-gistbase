var octOAuth = require('octoauth')
  , https = require('https')
  ;

var Gistbase = function(options){
  var self = this;

  if(options){
    for(var option in options)
      self[option] = options[option];
  }
  
  self.getGists = function(cb){
    if(!self.token){
      getToken(self.username, self.password, function(err, token){
        if(err)
          return cb(err);

        self.token = token;
        getGistsForUser(self.token, function(err, gists){
          cb(err, gists);
        });
      });
    }
    else{
      getGistsForUser(self.token, function(err, gists){
        cb(err, gists);
      });
    }
  }
}

function getToken(username, password, cb){
    if(!username || !password)
      return cb(new Error('No credentials provided'));

    var oa = new octOAuth({
      username: username,
      password: password,
      scopes: [ 'gist' ]
    });

    oa.getToken(cb);
}

function getGistsForUser(token, cb){
  var response = '';

  var options = {
    host: 'api.github.com',
    method: 'GET',
    headers: {
      'Authorization': 'token ' + token
    },
    path: '/gists'
  };

  var req = https.request(options, function(res){
    res.setEncoding('utf8');

    res.on('data', function(d){
      response += d;
    });

    res.on('error', function(e){
      return cb(e);
    });

    res.on('end', function(){
      response = JSON.parse(response);

      if(response.message)
        return cb(response.message);
      else
        return cb(null, response);
    });
  });

  req.end();
}

module.exports = Gistbase;
