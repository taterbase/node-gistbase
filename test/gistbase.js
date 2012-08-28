var config = require('../config')
  , Gistbase = require('../lib/index')
  , octOAuth = require('octoauth')
  ;

describe('gistbase', function(){
  
  describe('authentication', function(){
    
    it("should authorize and retrieve a user's gist with their oauth2 access token", function(done){
      this.timeout(3000);  
      //Get oauth token
      var oa = new octOAuth(config);    
  
      oa.scopes = [ 'gist' ];

      oa.getToken(function(err, token){
        if(err)
          return done(err);

        var gb = new Gistbase({token: token});

        gb.on('ready', function(){
          gb.destroy(done);
        });

        gb.on('error', done);

      });
    });

    it("should authorize and retieve a user's gists with just their username and password", function(done){
      this.timeout(3000);

      var gb = new Gistbase(config);

      gb.on('ready', function(){
        gb.destroy(done);
      });

      gb.on('err', done);
    });
  });

  describe('setup', function(){


    it("should create a new database if one is not provided", function(done){
      this.timeout(3000);

      var gb = new Gistbase(config);

      gb.on('ready', function(result){
        gb.should.have.property('id');
        result.should.have.property('description');
        
        gb.destroy(done);
      });

      gb.on('error', done);
    });
  });
});
