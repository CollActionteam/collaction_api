# Collaction API

This is the repository for the CollAction API

## Getting Started

This section will describe how to get started working with the CollAction API.

### Project Requirements

Before we go into the details, make sure you fulfill these requirements:

-   [Git](https://git-scm.com/downloads)
-   [NodeJS v16.^](https://nodejs.org/en/download/)
-   [Docker](https://www.docker.com/)

_Note: NPM version used is 7.20.0!_

### Running Mongo in Docker

If you don't already have an instance of Mongo running, eg. in Docker or otherwise locally, start by fetching the latest image of Mongo and running it in docker:

-   `docker run -d -p 27017:27017 --name mongo mongo:latest`

The command will fetch the latest official image of Mongo from the Docker Hub. The option `-d` signifies that the Docker container runs in the background, whereas `-p` signifies the port, allowing you to access mongo at `localhost:27017`.

### Configuring the Service

When all of the dependencies are ready _(MongoDB)_, we can start configuring the service.

First copy+paste the `.env.example` as `.env` and make any changes to the environment file as needed.

_Note: If you follow the default setup, you should not have to make any changes!_

### Configuring Firebase (Optional)

If you want, or need, to work with Authentication, you will need to setup Firebase Authentication. We recommend each developer to create a new Firebase Project and use for local development.

**Section TBD**

### Running the Service

If you have not already, run `npm ci` to install the package dependencies as defined in the `package-lock.json` file.

_Note: To keep the service as stable as possible, we highly recommend you do not use `npm install` unless you have added new dependencies._

You can now run either the start or watch command, to run the service:
-   `npm run start:dev`   To run the server locally
-   `npm run start:watch` To run the server locally, and watch for any changes

### Running the Service in Docker

If you haven't already, build the Service using:
-   `npm run build`

To run the service in Docker, you must first build the image. You can achieve that simply by doing:
-   `docker build -t collaction-api --no-cache .` Notice the no cache option, which forces Docker to build the image from scratch.

_Note: The no cache option is used, in case you have made changes, otherwise Docker builds from cache. This can mean your changes won't be applied._

You will now be able to run the image in a container using the following command:
-   `docker run -p 3000:3000 --name collaction-api collaction-api`

_Note: When accessing another running container, eg. Mongo, you will have to change the ENV variable accordingly._