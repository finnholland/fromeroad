# frome_road
## project overview
frome_road is a space for all employees of Lot Fourteen to discuss anything from tech to the weather.The site is currently only available to employees of Chamonix.

## message from me
I originally created this project as a way to get into full-stack devving. I wanted to create a project where I could simply start using SQL databases again, I also wanted to show the capabilities (albeit in a lightweight project) of React. Since I hadn't messed with API much except for Springboot and .NET I wanted to learn a technology from scratch and one that didn't require VS to edit... looking at you .NET. Due to this I was met with Python Flask or NodeJS. Since I already had experience in JS I figured to go with it.

### the stack
The project runs on a server with two docker containers for MySQL database and NodeJS API. These endpoints are hosted using the [NGINX Proxy Manager](https://nginxproxymanager.com/guide/#quick-setup) docker instance. This container handles SSL encryption and certificates as well as redirecting incoming traffic to the correct webserver allowing for more domains to be added.

### why didn't I choose cloud?
I chose originally to run the backend on a self-hosted server because I couldn't be bothered paying AWS, Azure, or Google for services such as EC2, RDS, and S3. While it's not expensive and might even be worth migrating in the future (if necessary) I figured I'd rather drink a few more bubble teas a month than pay ~80$ a month for those services.
Despite this I am not a savage, the site is still hosted as a webapp using AWS Amplify, and the domain was purchased and routed using AWS Route 53.


# How can you help?
## Contributing
This project is public and so is the repo... kinda. anyone who is able to log in and verifies their email can access the repo by clicking on the github icon in the page header on the homepage.

### Step one
clone project with `git clone https://github.com/fhllnd/fromeroad.git`

**UI**
1. To develop the UI run `npm run web` from the root directory
2. You can find the react docs [here](https://reactjs.org/)
3. It is possible to develop without the API but painful. Follow the steps below to start the API and use along side the UI  

**API**

1. Install MySQL from [here](https://dev.mysql.com/downloads/mysql/) and choose your OS
2. Select MySQL Server and Workbench. You may also wish to choose .NET and Python connector if you plan on using them in the future personally. - The install will require Visual Studio to be installed.
3. Inside MySQL Workbench connect to your localhost db with a new connection and user root.

4. Import the data from frome_road by opening the menu server>data import>import from dump project folder> `/repo_location/sql/dev/backups/<latest_date>`
5. Start import, you may have to expand the window to see the button (it's silly)
6. Comment the line `host: process.env.ENV+"_fromeroad_mysql"` and uncomment `host: "localhost"` in `api/index.js`
7. Create a .env file in `api/` with the content of `MYSQL_PASSWORD=your_local_db_password` the full .env is available on S3 (ask for access)
8. Start the local API `npm run api` from the root directory
9. Change the line `const  API  =  API_URLS.env;` to `const  API  =  API_URLS.local;` in `/web/src/constants.ts`
10. Check if you can access the API by going to [localhost](http://localhost/)

### Docker
These steps are not really necessary for anyone as it's done for the server only.
#### Install NGINX Proxy Manager
Follow the simple [steps](https://nginxproxymanager.com/guide/#quick-setup)
- `docker pull jc21/nginx-proxy-manager`
- `docker-compose -d up`
#### Create and run frome_road DB and API images.
- `npm run dockerdev` from root directory
- change `api/index.js` accordingly (should be) `localhost:10715` 

*how to remember ports* 
prod = LOT14 -> 10714
dev = LOT15 -> 10715  

# TODO

- [ ] give allen a backstory
