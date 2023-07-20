# frome_road
## project overview
frome_road is a space for all employees of Lot Fourteen to discuss anything from tech to the weather.The site is currently only available to employees of Chamonix.

## message from me
I originally created this project as a way to get into full-stack devving. I wanted to create a project where I could simply start using SQL databases again, I also wanted to show the capabilities (albeit in a lightweight project) of React. Since I hadn't messed with API much except for Springboot and .NET I wanted to learn a technology from scratch and one that didn't require VS to edit... looking at you .NET. Due to this I was met with Python Flask or NodeJS. Since I already had experience in JS I figured to go with it.

### the stack
The project is built with a ReactJS front-end that's hosted on AWS amplify, the middleware is an ExpressJS server which is running on Fargate in EC2/ECS. This was chosen as it has minimal setup despite a slightly higher fee and can scale rapidly due to ECS capabilities. Finally the database is an Aurora Mysql in RDS, this allows the database to scale significantly when traffic is low and provides heaps of options for redundancy and whatnot. 

# How can you help?
## Contributing
This project is public and so is the repo... kinda. anyone who is able to log in and verifies their email can access the repo by clicking on the github icon in the page header on the homepage.

### Step one
clone project with `git clone https://github.com/fhllnd/fromeroad.git`

**UI**
1. To develop the UI run `npm run web` from the root directory
2. You can find the react docs [here](https://reactjs.org/)
3. It is possible to develop without the API using the `API_URLS` constant in constants.ts pointing to dev.api.fromeroad.com. But for local development, see below.  

**API**

1. Install MySQL from [here](https://dev.mysql.com/downloads/mysql/) and choose your OS
2. Select MySQL Server and Workbench. You may also wish to choose .NET and Python connector if you plan on using them in the future personally. - The install will require Visual Studio to be installed.
3. Inside MySQL Workbench connect to your localhost db with a new connection and user root.

4. Import the data from frome_road by opening the menu server>data import>import from dump project folder> `/repo_location/sql/dev/backups/<latest_date>`
5. Start import, you may have to expand the window to see the button (it's silly)
6. Make sure to download the .env file from S3 after you are given access to it and put it in /api/.
7. Start the local API `npm run api` from the root directory
8. Change the line `const  API  =  API_URLS.env;` to `const  API  =  API_URLS.local;` in `/web/src/constants.ts`
9. Check if you can access the API by going to [localhost](http://localhost:8080/)

- [ ] give allen a backstory
