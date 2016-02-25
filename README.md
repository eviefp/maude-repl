# maude-repl
In order to install the Maude REPL server you need the following:
- a 64bit Linux version (if unsure, run `uname -a` in a terminal)
- the git client (you can use your distribution's package management to install git or get it from [the git-scm website](https://git-scm.com/downloads))
- nodejs 5.7.0+ (you can install it using [Node Version Manager](https://github.com/creationix/nvm) or directly from the [nodejs website](https://nodejs.org/en/download/))
- nginx to act as a proxy for nodejs (install using your distribution's package manager or from the [nginx website](http://nginx.org/en/download.html))
- unzip, wget

Open a console on the linux server and go through the following commands:
```bash
# Clone the REPL github repository
git clone https://github.com/vladciobanu/maude-repl

# Go to the folder and prepare the Maude binary folder
cd maude-repl
mkdir bin
cd bin

# Download and unzip maude
wget http://maude.cs.illinois.edu/w/images/c/ce/Maude27-linux.zip
wget http://maude.cs.illinois.edu/w/images/c/ce/Full-maude-27.zip
unzip Maude27-linux.zip
unzip Full-maude-27.zip
mv full-maude.maude maude27-linux

# Optionally, cleanup the folder
rm -rf Maude27-linux.zip Full-maude-27.zip __MACOSX

# Go back to the maude-repl folder
cd ..

# Install and use PM2 to make sure the application stays Optionally
npm install pm2 -g
pm2 start maude-repl.js
```

By default this runs on `localhost:3000` and we use nginx to serve it. You first need to edit `/etc/nginx/sites-enabled/default` to contain the following:

```
server {
    listen 80;
    listen [::]:80 default_server ipv6only=on;
    # Replace this with the actual DNS if any
    server_name maude.cvlad.info;

    # This can be a different location, eg. /maude
    location / {
        # By default it's localhost:3000 since that's what the nodejs app runs on
        proxy_pass http://127.0.0.1:3000;
        # Rest are just default http proxy settings.
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
```

Everything should be setup now. If not, make sure nginx is running.
