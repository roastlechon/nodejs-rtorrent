# nodejs-rtorrent
nodejs-rtorrent was created as a web gui for rtorrent. I wanted to create an alternative to rutorrent that used nodejs and this is the how far I got. The technologies used are NodeJS, Express, Handlebars, MongoDB, Mongoose, XMLRPC, FeedMe, Async, Passport, Socket.IO. For the front-end, I am using Backbone.js, Underscore, and Twitter Bootstrap. I may end up switching to Angular-JS on the front-end framework though.

There is some additional functionality that needs to be worked on and this file contains some notes/scratchpad work needed to be done to get some additional features working.

## Feature To-Do List
* Change frontend framework to Angular JS
* Add some frontend validation
* Refactor backend coding
* Add in settings page functionality to change rtorrent settings
* Add in search page functionality to web scrape torrent search results
* Add new user registration and admin management

## Installation
To install nodejs-rtorrent, checkout the source: `git clone https://github.com/roastlechon/nodejs-rtorrent.git` and install it yourself.

Make sure to run `npm install` in the root source folder (usually the folder with app.js) to get all the modules needed.

## Running the application
To run the application, navigate to the root source folder, and type in 'nodejs app.js'. You should seed some logs pop up. Before you continue any further though, make sure to configure/seed a user. Follow the steps in the configuration section to seed a user.

Assuming that a user is seeded and additional settings are changed, just navigate now to the the page. It is usually: http://hostname:3000

### Configuration
#### Creating a user
I haven't gotten as far as creating a settings.js file that can be used to change settings. First thing is to navigate to `config/db.js` and modify `mongoose.connect("mongodb://localhost/nodejs-rtorrent");` to be your MongoDB Database.

The next thing to do is seed a user into the database (I haven't gotten to the part of creating a registration page of some sort also). On first run of the application, put this code into `config/db.js`:

```
var UserModel = mongoose.model("User");

var userSeed = new UserModel({
	email: "user@domain.com",
	password: "password"
});

userSeed.save(function(errors, userSeed) {
	if (errors) {
		logger.error("errors occured while saving user");
	} else {
		logger.info("successfully saved user");
	}
});
```

To verify that the user was seeded into the database, open up your MongoDB console. On Linux, it is usually `mongo`. 

Next type in `show dbs` to show all the databases (in case you forgot what you named or created).

Then type 'use dbname' to use the database. As an example, mine is called "nodejs-rtorrent", so I enter in 'use nodejs-rtorrent'

Finally, type in 'db.users.find()' to get the users. You should be able to see one if it worked correctly. The above code also as a log statement in which you can check the console to make sure it worked correctly.

When it is confirmed that the database is seeded, you can go ahead and comment out the seeding code.

#### Changing port of the application
To change the port of the application, open up `app.js` in the root folder and modify the last lines regarding listening port. Default is 3000.

```
logger.info("listening on port 3000");
server.listen(3000);
```

#### Setting up connection between nodejs-rtorrent and rtorrent itself
To have nodejs-rtorrent communicate to rtorrent via xmlrpc, we need to modify the `lib/rtorrent.js` file. Look for these lines of code and modify as needed:

```
var client = xmlrpc.createClient({
  host: '127.0.0.1',
  port: '80',
  path: '/RPC2',
  headers: {
    'User-Agent'     : 'NodeJS XML-RPC Client',
    'Content-Type'   : 'text/xml',
    'Accept'         : 'text/xml',
    'Accept-Charset' : 'UTF8',
    'Connection'     : 'Close'
  }
});
```

Since rtorrent was running on the same box, it is using 127.0.0.1. Make sure to double check and connection issues. I have found that using xmlrpc tool on the console helps with debugging. Assuming xmlrpc is installed on the console, you can use this command to test to see if it connects: `xmlrpc 127.0.0.1/RPC2 d.multicall main d.name=`. An array of files will be returned (assuming rtorrent is running and has torrents in the list).

## Notes
```
References
https://code.google.com/p/gi-torrent/wiki/rTorrent_XMLRPC_reference
http://libtorrent.rakshasa.no/wiki/RTorrentXMLRPCGuide
http://scratchpad.wikia.com/wiki/RTorrentCommands
http://www.torrent-invites.com/seedbox-discussions/171584-seedbox-port-range.html
https://wiki.archlinux.org/index.php/RTorrent

d.start - start/resume
d.resume - start/resume
d.stop - pause
d.close - stop
d.erase - remove from list
d.delete_tied - remove metadata
d.get_peers_complete= - seeds
d.get_peers_accounted= - peers

t.multicall 90FB5DB6052BA54D4FD7199C8B1EC76EE09FFCCF d.get_hash= t.get_scrape_complete= - total seeds
t.multicall 90FB5DB6052BA54D4FD7199C8B1EC76EE09FFCCF d.get_hash= t.get_scrape_incomplete= - total peers

d.get_complete=         check if is complete
d.is_open=				check if is open
d.is_hash_checking= 	check if hash checking

if hash checking, means checking
if not complete and not open, means stopped
if not complete and open, means downloading
if complete and open, means seeding
if complete and not open, means finished

get port xmlrpc 127.0.0.1/RPC2 network.listen.port

Check hash after download
set_check_hash
get_check_hash 0/1

Default directory for downloads
get_directory
set_directory

Number of upload slots
get_max_uploads

set_min_peers
set_max_peers

set_min_peers_seed
set_max_peers_seed

set_priority
get_priority 0 1 2 3

get_upload_rate
set_upload_rate
```
