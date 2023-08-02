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

**UI - ReactJS**
1. To develop the UI run `npm run web` from the root directory
2. You can find the react docs [here](https://reactjs.org/)
3. It is possible to develop without the API by updating the `API_URLS` constant in `/web/src/constants.ts` to `const  API  =  API_URLS.dev;`. But for local development, see below.  

**API - NodeJS**

1. Install MySQL from [here](https://dev.mysql.com/downloads/mysql/) and choose your OS
2. Select MySQL Server and Workbench. You may also wish to choose .NET and Python connector if you plan on using them in the future personally. - The install will require Visual Studio to be installed.
3. Inside MySQL Workbench connect to your localhost db with a new connection and user root.

4. Import the data from frome_road by opening the menu server>data import>import from dump project folder> `/repo_location/sql/dev/backups/<latest_date>.sql` or `/repo_location/sql/empty_with_users.sql`
5. Start import, you may have to expand the window to see the button (it's silly)
6. Make sure to download the .env file from S3 after you are given access to it and put it in /api/.
7. Start the local API `npm run api` from the root directory
8. Change the line `const  API  =  API_URLS.env;` to `const  API  =  API_URLS.local;` in `/web/src/constants.ts`
9. Check if you can access the API by going to [localhost](http://localhost:8080/)

**DB - MySQL**

There's not much to do with the DB for now however I am open to suggestions for any additional features or optimisations with the database schema.
If you think of anything that could be added to help these things follow the below steps:
1. Make sure to test the query in local and check that none of the queries and tables are affected (especially stored procedures)
2. Once you are sure that it will not affect what is in place run the query against dev, create a PR which has the query in a file inside `/sql/queries/<descriptive-name>.sql`
3. When it gets approved it will run against test/prod and the change will be added!
*Note*
To make features available, you will need to implement changes to front-end and API, you can do this or you can get someone to help!

**AWS - Terraform**

As of now the only changes really required is making the Terraform completely serverless (excluding domain and secrets)
Some changes that may occur are swapping from FARGATE to EC2, I'm just lazy and didn't care for setting up and optimising an EC2 template and had issues getting it to connect to ECS. If some Wiz out there wants to help be my guest.
Terraform steps:
1. Run `terraform init -var="ACCESS_KEY=<ACCESS-KEY>" -var="SECRET_KEY=<SECRET_KEY>" -backend-config="bucket=<bucket>" -backend-config="region=ap-southeast-2" -backend-config="key=<key>" -migrate-state`
2. Run `terraform plan -var="ACCESS_KEY=<ACCESS-KEY>" -var="SECRET_KEY=<SECRET_KEY>" -var="RDS_USER=<RDS_USER>" -var="RDS_PASSWORD=<RDS_PASSWORD>" -var="env=<dev/prod>" -var="region=ap-southeast-2"`
3. These steps will initialise the connection to the terraform state so that you can tell what is deployed and see how your changes affect the infrastructure in AWS. Fill out the missing variables by using the values inside the AWS SecretsManager or CodePipeline environment variables.
4. When the changes you've made look good to you and do what you expect (i.e. doesn't destroy everything, you can create a PR from your branch and get it approved) Once it is merged into master the pipeline will automatically deploy the changes made :)
[The AWS Terraform docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)


- [ ] give allen a backstory
