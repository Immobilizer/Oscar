1. MongoDB

-In the terminal, navigate to the cat feeder dir and create a subdir called data.
-In the terminal, navigate to the directory in which you placed your MongoDB files.  From that directory, type the following:
	$ mongod --dbpath ~/Development/Cat\ Feeder/feederapp/data/
 For me, the command looks like this:
 	$ Development/mongodb/bin/mongod --dbpath ~/Development/Cat\ Feeder/feederapp/data/
 You'll see the Mongo server start up. Once it says "[initandlisten] waiting for connections on port 27017", you're good.
-Open a second terminal window. Navigate to your Mongo installation directory and type:
	$ mongo
 You'll see something like this in the Mongo console:
 	c:\mongo>mongo
	MongoDB shell version: 2.4.5
	connecting to: test
 For me, the command looks like this:
 	$ Development/mongodb/bin/mongo
 The mongo client is up and running and it can be used to manually work with the database. When running the actual website, the mongo client isn't necessary; only the server daemon (mongod) is needed for that.
