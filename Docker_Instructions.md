This section is only for setting up docker containers on the server.
You can run the API and DB locally on docker but you will need to use http://your-public-ip (and maybe some troubleshooting since I'm not focussing on that segment)
## Docker Containers

### NGINX
 - run `docker pull jc21/nginx-proxy-manager`
 - run `docker-compose -d up`


### MySQL & API
 - `docker-compose -d up`
