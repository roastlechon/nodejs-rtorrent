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

$ if hash checking, means checking
# if not complete and not open, means stopped
# if not complete and open, means downloading
# if complete and open, means seeding
# if complete and not open, means finished



https://code.google.com/p/gi-torrent/wiki/rTorrent_XMLRPC_reference

Menu
	Upload a torrent
	Add a url - 

Torrents
	Torrent actions
		Start/Resume
		Pause
		Stop
	Torrent status
		Transfer
		Tracker
		General
		