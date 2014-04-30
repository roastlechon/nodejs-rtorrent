# nodejs-rtorrent
![cutout](http://cloudfront.nwgat.net/nodejs-rtorrent-cutout2.png "screenshot")

nodejs-rtorrent was created as a web gui for rtorrent. I wanted to create an alternative to rutorrent that used nodejs and this is the how far I got. The technologies used are NodeJS, Express, Handlebars, MongoDB, Mongoose, XMLRPC, FeedMe, Q (Promises), Passport, Socket.IO. For the front-end, I am using AngularJS, RequireJS, Bower, Underscore, and Twitter Bootstrap.


There is some additional functionality that needs to be worked on and this file contains some notes/scratchpad work needed to be done to get some additional features working.

Special thanks to [nwgat](http://nwgat.net)  for testing, readme improvements and ideas :)

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
* Settings does not work yet
* Feeds realy works 
* Torrents realy works
* basic username and password works

#### Codename Alchemist (v1)
* Settings
* Search
* Feeds > Basic Regex
* Feeds > AutoDL
* HTTPS

#### Codename Unicorn (v2)
* Multi-User
* Advanced Regex
* File Manager
* Torrent Creator
* HTML5 Media Player

### Depends on
NodeJS NPM Bower MongoDB rtorrent and a webserver with RPC

## Installation Guide
see [here](https://github.com/roastlechon/nodejs-rtorrent/wiki/_pages) for guides for your distro
https://github.com/roastlechon/nodejs-rtorrent/wiki/_pages

## Support
Having issues? [submit a ticket](https://github.com/roastlechon/nodejs-rtorrent/issues/new)

Join us on our IRC channel [#NodeJS-rTorrent @ Freenode](http://webchat.freenode.net/?channels=nodejs-rtorrent) 

## FAQ
huh?

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
