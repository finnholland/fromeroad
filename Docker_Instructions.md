
## Docker Containers

### NGINX
 - run `docker pull jc21/nginx-proxy-manager`
 - run `docker-compose -d up`


### MySQL
 - `cd sql`
 - `docker-compose -d up`


### NodeJS API 
 - Open VSCode
 - Press F1 to open commands
 - 'Docker Images: Build Image'
 - In a terminal run `docker run -d --network docker_default --name=fromeroad_api -d fromeroadapi`