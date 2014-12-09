# Installation

Follow these steps to get this meteor application running  with forever and behind a nginx proxy on a debian

## Requirements ##

* mongoDB
* nginx
* nodejs & npm
* forever and demeteorizer (only in dev) packages

## MongoDB ##

### installation ###

Import PGP key of mongoDB, create a source.list file for mongodb, then update the package list and install monfoDB.

```sh
apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen' | tee /etc/apt/sources.list.d/mongodb.list
apt-get update
apt-get install mongodb-10gen
```

### configuration ###

Launch mongo shell and select admin database (it will be created at the first insertion if it does not exist) and add an administrator for all databases

```
mongo
db = db.getSiblingDB('admin')
db.addUser({user: "root", pwd: "rootPwd", roles: ["userAdminAnyDatabase", "clusterAdmin", "readAnyDatabase"]})
exit
```

Turn on auth mode and restart mongo or reload mongo configuration

```sh
nano /etc/mongodb.conf (=> set auth to true)
service mongodb restart
```

Then add a user for the project. A mongo user is a combination of a database name and a login, so you will need those 2 pieces of information to connect.
Do not forget to 'use' a database, else test is used by default.

```sh
mongo -u root -p --authenticationDatabase admin
use items-art-generator
db.addUser({ user: "items-art-generator-user", pwd: "items-art-generator-password", roles: [ "readWrite", "userAdmin"] })
```

## Nginx ##

Add a virtual host such as :

```conf
upstream items-art-generator-upstream {
        server 127.0.0.1:58090;
}
server {
        listen 0.0.0.0:80;
        server_name items-art-generator.net;
        error_log  /var/log/nginx/items-art-generator.error;
        access_log /var/log/nginx/items-art-generator.access;
        location / {
                proxy_pass http://items-art-generator-upstream/;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host $http_host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forward-Proto http;
                proxy_set_header X-Nginx-Proxy true;
                proxy_redirect off;
        }
}
```

## Forever ##

Create a script to launch the app with forever and mongo variables.

```sh
echo "[+] Starting Items Art Generator!"
if [ "$1" = "" ]
        then
        echo "[-] Usage: <dir>"
        echo "[!] Path needed for the containing project folder"
        exit 0
fi
if [ ! -d $1 ]
        then
        echo "[!] Could not enter the dir: $1"
        exit 0
fi
cd $1
echo "[+] Running NPM"
npm install &>/dev/null
echo "[+] Setting environment variables"
#mongodb://user:password@host:port/database
export MONGO_URL='mongodb://items-art-generator-user:items-art-generator-password@127.0.0.1:27017/items-art-generator'
export PORT=58090
export ROOT_URL='http://localhost/'
echo "[+] Starting Node Server"
forever start main.js
echo "Done!"
```

## Prepare the demeteorize application ##

Configure the api endpoint. Go to src/server/parameters.js

```sh
Parameters = {
    'api_public_endpoint': 'http://items-art-generator.net'
};
```

Now you need to use demeteorizer in order to have the meteop app run as a native nodejs application.

```sh
    cd src/
    demeteorizer -o ../demeteorize-app/
```

Then copy the scripts folder into the demeteorized folder

```sh
    cp -r src/public/scripts ../demeteorize/public/scripts
```

You should now be able to run the previously created script.