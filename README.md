# tiny.iiif

Publish your images as IIIF in a minute - or less!

![Screenshot of the tiny.iiif admin GUI](/screenshot.jpg "Screenshot of the tiny.iiif admin GUI")

## Overview

**tiny.iiif** is a minimal IIIF server. It fills the gap between running a full collection management system, and hand-editing your own Presentation manifests.

## Features
- **Drag & drop images** → instant IIIF Image Service (version 2 and 3) powered by Cantaloupe.
- **Create a folder, add images** → instant IIIF Presentation v3 manifest
- **Zero configuration** → works out of the box with sensible defaults
- **User-friendly admin GUI** → quick, modern, easy to use
- **Production-ready** → Docker-based deployment with NGINX reverse proxy

## Prerequisites

- Docker 24.0+
- Docker Compose 2.x

## Quick Start

1. **Create your environment file**

   ```sh
   cp .env.example .env
   ```

2. **Configure authentication**: edit `.env` to change your username and password for the admin GUI. (Default credentials are `tiny` / `tiny`.)

3. **Launch tiny.iiif**

   ```sh 
   docker compose up
   ````

4. **Access services**
   - Admin GUI: http://localhost/tiny
   - IIIF Image API: http://localhost/iiif
   - Manifests: http://localhost/manifests

- NGINX will map the following routes:
  - `/iiif` to Cantaloupe
  - `/manifests` to the static file manifest folder
  - `/tiny` to the admin GUI

## Usage

Once tiny.iiif is running:

1. Open the admin GUI at http://localhost/tiny
2. Log in with your credentials (default: `tiny` / `tiny`)
3. Drag and drop images to publish them via Cantaloupe
4. Create folders and add images to publish IIIF Presentation manifests

## Development

This repository includes a dedicated Docker setup for developers working on the **admin GUI**. In development mode, the backend (Cantaloup and NGINX) run in Docker, but the admin GUI runs locally with live code reload.

### Additinoal Prerequisites

- NodeJS 20+
- npm 11+

### Start Development Backend

1. **Start the backend**

   ```sh 
   docker compose -f ./docker-compose.dev.yml up --build` to start the backend
   ```

2. **Install frontend dependencies**

   ```sh
   cd tiny
   npm install
   ````

3. **Start development server**
  
   ```sh
   npm start
   ````

4. **Access the admin GUI** at <http://localhost:4321>

## License

[MIT](LICENSE)

---

**Status:** Work in progress. Contributions and feedback welcome!


