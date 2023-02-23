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
## Coding
This project is public and so is the repo... kinda. anyone who is able to log in and verifies their email can access the repo by clicking on the page header "**frome_road**" on the homepage.
clone project with git clone https://github.com/fhllnd/fromeroad.git
developing UI `cd web && npm start` 
developing API (you will need MySQL db(Workbench or CLI))
- start the local API `cd api && npm start` 


# TODO
write docker install instructions



