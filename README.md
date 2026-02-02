# tiny.iiif

A minimal Docker-based IIIF server. Backed by Cantaloupe, NGINX and a tiny admin GUI.

## Prerequisites

- Docker 24.0+
- Docker Compose 2.x

## Installation

- Create a copy of the file `.env.example` called `.env``

  ```
  cp .env.example .env
  ```

- Edit the file to change your username and password for the tiny admin GUI. (Otherwise, the default loing is tiny / tiny). 

- Run `docker compose up` to launch:
  - Cantaloupe
  - tiny.iiif admin environment
  - NGINX proxy

- NGINX will map the following routes:
  - `/iiif` to Cantaloupe
  - `/manifests` to the static file manifest folder
  - `/tiny` to the admin GUI

## Development

This repository includes a dedicated Docker setup for development, intended for developers working on the admin GUI, with hot reloading.

In development mode, only the backend (Cantaloup and NGINX) is launched via Docker. The admin GUI must be started manually. You need the following pre-requisites:

- NodeJS 20+
- npm 11+

### Start Development Backend

- Start the backend

  ```sh 
  docker compose -f ./docker-compose.dev.yml up --build` to start the backend
  ```

- Change into the `tiny` folder

  ```sh
  cd tiny
  ````

- Install dependencies

  ```sh
  npm install
  ```

- Start development server
  
  ```sh
  npm start
  ````

- Go to <http://localhost:4321>


