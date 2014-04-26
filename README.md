# nodejs-rtorrent
nodejs-rtorrent was created as a web gui for rtorrent. I wanted to create an alternative to rutorrent that used nodejs and this is the how far I got. The technologies used are NodeJS, Express, Handlebars, MongoDB, Mongoose, XMLRPC, FeedMe, Q (Promises), Passport, Socket.IO. For the front-end, I am using AngularJS, RequireJS, Bower, Underscore, and Twitter Bootstrap.

There is some additional functionality that needs to be worked on and this file contains some notes/scratchpad work needed to be done to get some additional features working.

Here are some [screenshots](http://imgur.com/a/OVQoQ) of it in action! (PS. I like Anime!)

Special thanks to [nwgat](http://nwgat.net)  for testing, readme improvements :)

#### Feature To-Do List
* ~~Change frontend framework to Angular JS - Kinda done~~
* Add some frontend validation
* Refactor backend coding
	* ~~Refactor models/schemas and rssfeeds.js~~
	* ~~Refactor rtorrent.js~~
	* ~~Refactor authentication to use HMAC~~
	* Add expiration mechanism to authentication
	* ~~Add config setup json file~~
* Add in settings page functionality to change rtorrent settings
* Add in search page functionality to web scrape torrent search results
* Add new user registration and admin management
* Add grunt/gulp and minification of javascript files 
* Add docker file for easy container management


## Roadmap
#### blablabla (<we are here<)
* feeds and downloads realy works
* basic username and password works

#### Version 1.0
* Settings
* Search
* Feeds > Basic Regex
* Feeds > AutoDL

#### Version 2.0 
* Multi-User
* Advanced Regex
* File Manager
* Torrent Creator
* HTML5 Media Player



### Depends on
NodeJS NPM Bower MongoDB rtorrent

## Installation Guide

### 1. Install packages

Ubuntu 14.04 LTS
```
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update && sudo apt-get install python g++ make nodejs mongodb-server rtorrent libxmlrpc-core-c3-dev git
```
For other distros
install these  packages or whatever that is relevant for your distro
```
python g++ make nodejs mongodb-server rtorrent libxmlrpc-core-c3-dev git
```
see https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager for nodejs

#### 1.5 Make mongodb smart aka create folder for database
why mongodb dont do this is anyones guess...
```
sudo mkdir -p /data/db
sudo service mongodb restart
```
### 2. Web Server
Now you have to setup a webserver with RPC

apache2
```
sudo apt-get install apache2 libapache2-mod-scgi
sudo a2enmod scgi

sudo echo "SCGIMount /RPC2 127.0.0.1:5000" >> /etc/apache2/sites-enabled/yoursite
service apache2 restart
```

lighttpd
```coming soon```

nginx
```coming soon```

standalone
```coming when we know how, got any tips?```

### 3. rtorrent Installation
```
cd $user
echo "scgi_port = localhost:5000" >> .rtorrent.rc
echo "directory = rtorrent-downloads" >> .rtorrent.rc

screen rtorrent
deattach with ctrl + D

to run at startup
cd /etc/init.d/
wget http://libtorrent.rakshasa.no/raw-attachment/wiki/RTorrentCommonTasks/rtorrentInit.bash
edit the user and path to /home/user/.rtorrent.rc
update-rc.d rtorrentInit.bash defaults

```
### 4. nodejs-rtorrent Installation
```
git clone https://github.com/roastlechon/nodejs-rtorrent.git && cd nodejs-rtorrent
npm install && npm install bower
node_modules/bower/bin/bower install (select answer 2)

```

### 5. Configuration
`nano config/config.json`
change settings to suit your needs. By default, nodejs-rtorrent listens on port 3000. Before running the application, make sure to change the default admin user.

```
"defaultUser": {
	"email": "admin@localhost",
	"password": "password"
},
```
### 6. Running the application
To run the application, navigate to the `nodejs-rtorrent` folder, and type in 'nodejs app.js'. You should see some logs pop up. You can now login and add torrents and feeds!

**if it all goes well you will find your very own nodejs-rtorrent @ http://yourip:3000/#/**

Since rtorrent was running on the same box, it is using 127.0.0.1. Make sure to double check and connection issues. I have found that using xmlrpc tool on the console helps with debugging. Assuming xmlrpc is installed on the console, you can use this command to test to see if it connects: `xmlrpc 127.0.0.1/RPC2 d.multicall main d.name=`. An array of files will be returned (assuming rtorrent is running and has torrents in the list).

### 7. Running it in the background aka continuously (Optional)
pm2 will help in this regard, install it and set it up with nodejs-rtorrent

https://github.com/Unitech/pm2
```
npm install pm2
node_modules/pm2/bin/pm2 start app.js --name NodeJS-rTorrent

```
useful commands
```
node_modules/pm2/bin/pm2 list (shows your nodejs processes)
node_modules/pm2/bin/pm2 restart <number> (to restart process)
node_modules/pm2/bin/pm2 stop <number> (to stop process)

```

## FAQ
bower cannot be found
try running bower like this `node_modules/bower/bin/bower install` inside nodejs-rtorrent directory

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

xmlrpc 127.0.0.1/RPC2 d.multicall main d.get_hash= d.get_throttle_name=
throttle_down=up16,10

xmlrpc 127.0.0.1/RPC2 d.get_throttle_name 82E7111FC6E574C976B26EB453460F49D46559F7

setting throttle
xmlrpc 127.0.0.1/RPC2 d.stop 82E7111FC6E574C976B26EB453460F49D46559F7
xmlrpc 127.0.0.1/RPC2 d.set_throttle_name 82E7111FC6E574C976B26EB453460F49D46559F7 thr_1   


xmlrpc 127.0.0.1/RPC2 throttle_up "thr_10" "20"
```
