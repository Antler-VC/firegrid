
# Use the official lightweight Node.js image.
# https://hub.docker.com/_/node
FROM node:15-slim

# copy packages to work directory
WORKDIR /workdir
COPY www/package*.json /workdir/
COPY www/yarn.lock /workdir/

# Install dependencies
RUN yarn install

# get all env variables from cloud build
ARG _PROJECT_ID
ARG _FIREBASE_WEB_API_KEY
ARG _ALGOLIA_APP_ID
ARG _FIREBASE_APP_ID
ARG _FIREBASE_MEASUREMENT_ID
ARG _HOSTING_TARGET
ARG _FIREBASE_TOKEN

# copy www folder to docker work directory
COPY www /workdir/

# set env variables
RUN yarn env $_PROJECT_ID $_FIREBASE_WEB_API_KEY $_ALGOLIA_APP_ID $_FIREBASE_APP_ID $_FIREBASE_MEASUREMENT_ID $_HOSTING_TARGET $_FIREBASE_TOKEN

# build the app, the most time consuming step
RUN yarn build

# deploy
RUN yarn target $_HOSTING_TARGET --project $_PROJECT_ID
RUN yarn deploy --project $_PROJECT_ID --debug --token $_FIREBASE_TOKEN --only hosting

