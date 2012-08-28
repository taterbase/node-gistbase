var octOAuth = require('octoauth')
  , https = require('https')
  , util = require('util')
  , fs = require('fs')
  , config
  , Gist = require('./gist')
  , EventEmitter = require('events').EventEmitter
  ;

function Gistbase(options){
  //Constructing EventEmitter from whom I am inheriting from
  EventEmitter.call(this);

  var self = this;
  
  //Pulling in config file
  fs.readFile('config/gistbase.json', function(err, data){
    if(err){
      console.error(err);
    }
    
    config = data ? JSON.parse(data) : data;
  });

  //Set up values from config
  if(!options && config){
    for(var option in config){
      self[option] = config[option];
    }
  }

  //If options provided assign those (Options have final say on values)
  if(options){
    for(var option in options)
      self[option] = options[option];
  }

  if(self.token){
    self.init();
  }
  else if(self.username && self.password){
    getToken(self.username, self.password, function(err, token){
      if(err)
        return self.emit('error', err);
      
      self.token = token;
      self.init();
    });
  }
  else{
    process.nextTick(function(){
      self.emit('error', {message: 'No credentials provided'});
    });
  }
};

util.inherits(Gistbase, EventEmitter);

Gistbase.prototype.init = function(){
  var self = this;

  if(!self.id){
    createGB(self.token, function(err, gb){
      if(err)
        return self.emit('error', err);

      self.id = gb.id;

      if(!config){
        config = {
          token: self.token,
          id: self.id
        };

        //Write to config
        fs.writeFile('config/gistbase.json', JSON.stringify(config), function(err){
          if(err)
            return self.emit('error', err);

          self.emit('ready', gb);
        });
      }
      else
        self.emit('ready', gb);
    });
  }
  else{
    openGB(self.token, self.id, function(err, gb){
      if(err)
        return self.emit('error', err);

      self.emit('ready', gb);
    });
  }
};

Gistbase.prototype.destroy = function(cb){
  Gist.del(this.token, this.id, cb);
};

function openGB(token, id, cb){
  Gist.get(token, id, cb); 
}

function createGB(token, cb){
  //Create an empty gistbase
  var content = {
    message: "Welcome to gistbase. Create a collection to get started"
  };

  content = JSON.stringify(content);

  var gist = {
    description: 'Gist Database (gistbase)',
    files: {
      '_empty.json': {
        content: content
      }
    },
    public: false
  };

  Gist.create(token, gist, cb); 
}

function getToken(username, password, cb){
    var oa = new octOAuth({
      username: username,
      password: password,
      scopes: [ 'gist' ]
    });

    oa.getToken(cb);
}

module.exports = Gistbase;
