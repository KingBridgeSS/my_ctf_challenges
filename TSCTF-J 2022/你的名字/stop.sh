docker-compose down
docker rm $(docker ps -a -q)
docker rmi tsctfj-qbox_qbox
# docker-compose up