#!/usr/bin/node
`docker rm $(docker stop $(docker ps - a - q--filter ancestor = fromeroadapi--format = "{{.Id}}")) &&
  docker rmi fromeroadapi && cd.. && docker compose--env - file.dev.env up - d && docker compose--env - file.env up - d`