#docker run -d \
#  -v /var/run/docker.sock:/var/run/docker.sock \
#  -v jenkins_home:/var/jenkins_home \
#  -p 8080:8080 -p 50000:50000 \
#  --name jenkins \
#  jenkins/jenkins:lts
# Dockerfile
FROM jenkins/jenkins:lts

USER root

# Cài docker CLI bên trong Jenkins container
RUN apt-get update && apt-get install -y docker.io

USER jenkins
