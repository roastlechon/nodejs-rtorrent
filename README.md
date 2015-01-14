# nodejs-rtorrent
nodejs-rtorrent was created as a web gui for rtorrent. I wanted to create an alternative to rutorrent that used Node.js and this is the how far I got. The technologies used are Node.js, Express, MongoDB/TingoDB, Mongoose, tungus (for use with Mongoose), XML-RPC, FeedMe, Q (Promises), Passport, and Socket.IO. For the client side, I am using AngularJS, Browserify, Bower, and Twitter Bootstrap (using Scss). View the package.json and bower.json for more details.

We are looking for developers, please fork and tell us what you want to code and submit pull requests when done. We are active on our IRC channel [#nodejs-rtorrent @ Freenode](http://webchat.freenode.net/?channels=nodejs-rtorrent).

![cutout](http://i.imgur.com/ywbBABC.png "screenshot")

## Features
* Auto-download torrents from feeds
* Regex search torrents from feeds
* Download torrents from feeds to specified directory
* Load torrents from .torrent/.magnet link or file
* Start, pause, stop, remove, delete with data torrents
* Batch manipulate torrents
* SCGI Direct Connection to rtorrent
* HTTPS support
* Embedded database support
* Basic download and connection settings
* [Remote Torrent Adder supported via auto add torrent or right click within Chrome](https://code.google.com/p/remote-torrent-adder/)

## Feature Roadmap
* Search (External Sites)
* Multi-User
* First Time Setup
* Feeds > Import & Export
* Feeds > Custom Max Size
* Keyboard Shortcuts 
* File Manager with Torrent Creator
* Stats Page

## Developing Features
Development follows standard git work flows: dev is the main development branch, master is the stable production branch, smaller feature branches are created from dev and merged back. To get started on developing nodejs-rtorrent, follow these steps.

1. `git clone https://github.com/roastlechon/nodejs-rtorrent.git`
2. `cd nodejs-rtorrent && git checkout dev`
3. `npm install && bower install`
4. Write code! Use `gulp dev` as your main development pipeline. Use `npm start` to run the application and test in the browser.
5. Check in code and/or create a pull request.

## Installation Guide
* [Linux](https://github.com/roastlechon/nodejs-rtorrent/wiki/Installation-Guide-for-Linux-(direct-scgi-connection))

#### Dependencies
* Node.js
* NPM
* rtorrent
* Linux

Special thanks to [nwgat](http://nwgat.net)  for testing, readme improvements and ideas :)

## Team
* roastlechon - Creator, Developer
* rendom - Developer
* nwgat - Documentation, QA, Community 

## Support
* Having issues? [Submit a ticket](https://github.com/roastlechon/nodejs-rtorrent/issues/new)
* Join us on our IRC channel [#nodejs-rtorrent @ Freenode](http://webchat.freenode.net/?channels=nodejs-rtorrent) 

## FAQ
[Read the wiki here](https://github.com/roastlechon/nodejs-rtorrent/wiki)
