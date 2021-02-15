## Youtube GIF Maker Using Next.js, Node and RabbitMQ

### [Live Demo](https://ytgif.vercel.app/)

### [Dev.to Series](https://dev.to/ragrag/getting-started-youtube-gif-maker-using-next-js-node-and-rabbitmq-1cl9) - View Details about this project on the Dev.to series



### Run locally

- Rename .env.example to .env
- Fill missing env variable in node-worker (Google Cloud Storage related secrets)

#### Run using docker

- Make sure docker & docker-compose are installed in your system then run

```
 docker-compose up -d --build
```

#### Run without docker

- Make sure MongoDB & RabbitMQ Server are installed on your machine then run in each of the folders

```
npm run dev
```

open http://localhost:3000 in your browser

## Overview

### Idea

The basic idea of the app is to let users create GIFs from Youtube Videos. Users can do that by defining the url of the youtube video they want to make a GIF from as well as defining the start/end times of the GIF

### App Functionalities

- Create a GIF from a youtube video and the start/end times (range) from the video to make into a GIF
- Preview the result before doing the actual conversion

## System Design

### System Components

Each component of the system is responsible for working in isolation and communicating with other components

- React (Next.js) as the client side
  - Communicates with the backend server to create new gif conversion requests as well as getting information of already created gif conversions
- Node as a backend server
  - Handles requests from the client as well as dispatching new conversion jobs to the message broker
- Node as a service worker
  - Will be responsible for executing/processing the conversion jobs
- RabbitMQ as a message broker
  - Will act as a Task Queue where the backend server will produce tasks to it and the service worker will consume tasks from it
- MongoDB for datastore
  - Will store information about the GIF conversion jobs
- Google Cloud Storage for media storage
  - Will be used to store the converted GIFs

### Architecture

![System Architecture](https://dev-to-uploads.s3.amazonaws.com/i/a33a1ot9ncgu65eq1ryz.png)

### Sequence Diagram

This is a sequence diagram of the system including all the components mentioned above and their interactions

![Sequence Diagram](https://dev-to-uploads.s3.amazonaws.com/i/3p3q8twj2omqf3ndtw3g.png)

Check the whole [Dev.to Series](https://dev.to/ragrag/getting-started-youtube-gif-maker-using-next-js-node-and-rabbitmq-1cl9) on this project
