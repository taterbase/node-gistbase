#gistbase

A noSQL database for Node.js composed of gists. This has a different structure than [gistdb](http://github.com/LouisT/gistdb) and intends to use gist's files functionality as documents.

##Testing

gistbase relies on a config folder in the root (not stored in the repo) that holds a username and password for basic auth, as well as an access token for oauth. The structure is like so:

```
gistbase
|
|--config
|   |
|   |--index.js
|
|--lib
|   |
|   |--gistbase.js
|
|--package.json
|--index.js
```

Inside config/index.js you will need to export an object with a username, password, and access token like so:

```javascript
module.exports = {
  username: 'taterbase',
  password: '123Fake',
  access: '1MH34Tga79DdfahPbDzoX'
};
```

With mocha installed you should be able to run tests now.
---
MIT License
