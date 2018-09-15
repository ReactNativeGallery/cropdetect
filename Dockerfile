FROM justadudewhohacks/opencv-nodejs:node9-opencv3.4.1-contrib
WORKDIR /app
COPY . /app/
RUN apt-get update && apt-get -y install build-essential
RUN npm install
CMD node server.js