
# frome_road
## project overview
frome_road is a project I developed solo as a mockup for a social space that employees of Lot Fourteen could use to discuss anything from tech to the weather. 

I originally created this project as a way to get into full-stack devving. I wanted to create a project where I could simply start using SQL databases again, I also wanted to show the capabilities (albeit in a lightweight project) of React.
Lastly since I hadn't messed with APIs much except for Springboot and .NET I wanted to learn a technology from scratch and one that didn't require VS to edit... looking at you .NET. 
Due to this I was met with Python Flask or NodeJS. Since I already had experience in JS I figured to go with it and I can spend time learning flask a bit later.

### the stack
The project is built with a ReactJS front-end that's hosted on AWS amplify, the middleware is an ExpressJS server which is running on Fargate in EC2/ECS. This was chosen as it has minimal setup despite a slightly higher fee and can scale rapidly due to ECS capabilities. Finally the database is an Aurora MySQL in RDS, this allows the database to scale significantly when traffic is low and provides heaps of options for redundancy and whatnot. 
Originally I had the stack on bare metal and frankly this would've been a viable option for the project too since cost, however, I took the opportunity to fork out the large sum of $5 a month as a learning experience in AWS and it was well worth it.
There is a docker-compose if you would rather use bare metal

# Experimenting in the Repo

### Step one
clone project with `git clone https://github.com/finnholland/fromeroad.git`

**UI - ReactJS**
1. To develop the UI run `cd web && npm i` then `cd.. && npm run web`
2. You can find the react docs [here](https://reactjs.org/)
3. It is possible to develop without the API by updating the `API_URLS` constant in `/web/src/constants.ts` to `const  API  =  API_URLS.dev;` this assumes you have an environment in AWS and have edited the `constants` values. But for local development, see below.  

**API - NodeJS**
To use the default configuration you will need: an s3 bucket for uploading. a super user IAM and the access/secret keys. You can follow and tailor the cloud [instructions](finnholland/fromeroad/blob/master/terraform/Instructions.md) to do these steps.
Or you can change from multers3 to multer in `image.js` and `post.js`


1. Install MySQL from [here](https://dev.mysql.com/downloads/mysql/) and choose your OS
2. Select MySQL Server and Workbench. You may also wish to choose .NET and Python connector if you plan on using them in the future personally. - The install will require Visual Studio to be installed.
3. Inside MySQL Workbench connect to your localhost db with a new connection and user `root`.

4. Import the data from frome_road by opening the menu server>data import>import from dump project folder> `/repo_location/sql/dev/backups/<latest_date>.sql` or `/repo_location/sql/empty_with_users.sql`
5. Start import, you may have to expand the window to see the button (it's silly)
6. Create a `.env` file in the `/api/` folder and put the following values. 

| variable  | value  |
|--|--|
| SES_KEY | AWS user access key |
|SES_SECRET  | AWS user secret key |
|S3_KEY | AWS user access key|
|S3_SECRET | AWS user secret key |
|RDS_DB | localhost |
|RDS_USER|admin_fromeroad_local (or rename in the sql script)  |
|RDS_PASSWORD | abc123 |  
| JWT_SECRET | run `npm run crypto` and use value |
| CRYPTO_KEY | run `npm run crypto` and use value |
|ENV|local|
8. Start the local API `npm run api` from the root directory
9. Change the line `const  API  =  API_URLS.env;` to `const  API  =  API_URLS.local;` in `/web/src/constants.ts`
10. Check if you can access the API by going to [localhost](http://localhost:8080/)

**AWS - Terraform**

See cloud [docs](terraform/Instructions.md)

