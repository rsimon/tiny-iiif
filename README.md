# tiny.iiif

Turn a folder of images into a working [IIIF](https://iiif.io/) setup – in a minute or less!

![Screenshot of the tiny.iiif admin GUI](screenshot.jpg "Screenshot of the tiny.iiif admin GUI")

## Overview

**tiny.iiif** is a lightweight IIIF server for small to medium-sized collections. It provides a simple way to publish images via the IIIF Image and Presentation APIs without deploying a full collection management system.

It fills the gap between large repository platforms and manually wrangling IIIF manifest JSON files.

## Who is tiny.iiif for?

tiny.iiif is particularly suitable for:

- Small collections (tens to a few thousand images)
- Digital Humanities research projects
- Online exhibitions
- Developers building IIIF-powered tools
- Institutions that need lightweight IIIF infrastructure without running a full repository stack

## Features

- **Drag & drop images** → instant IIIF Image Service (version 2 and 3) powered by [Cantaloupe](https://cantaloupe-project.github.io/).
- **Create a folder, add images** → instant IIIF Presentation v3 manifest
- **Zero configuration** → works out of the box with sensible defaults
- **User-friendly admin interface** → simple, modern, easy to use
- **Production-ready** → Docker-based deployment with [NGINX](https://nginx.org/) as reverse proxy

## Prerequisites

- Recommended minimum hardware: virtual server with **2 CPUs and 4 GB RAM**. 
- Sufficient disk space – tiny.iiif converts all uploaded images to [pyramidal TIFF format for performance reasons](https://cantaloupe-project.github.io/manual/5.0/images.html).
- Docker 24.0+ and Docker Compose 2.x
- Web address for your server (custom domain or sub-domain)

## Quick Start

1. **Create an environment file** - copy the included `.env.example`

   ```sh
   cp .env.example .env
   ```

2. **Configure authentication** - edit `.env` to change your username and password for the admin GUI. (Default credentials are `tiny` / `tiny`.)

3. **Launch tiny.iiif**

   ```sh 
   docker compose up --build
   ```

4. **Access services**
   - Admin GUI: <http://localhost/tiny>
   - IIIF Image API: <http://localhost/iiif>
   - Manifests: <http://localhost/manifests>

5. To set up HTTPS using [LetsEncrypt](https://letsencrypt.org/) follow the [HTTPS Setup Guide]().

## Usage

Once **tiny.iiif** is running:

1. Open the admin GUI at <http://localhost/tiny>
2. Log in with your credentials (default: `tiny` / `tiny`)
3. Drag and drop images to publish them via Cantaloupe
4. Create folders and add images to publish IIIF Presentation manifests

## Development

This repository includes a separate Docker setup for frontend development.

In development mode:
- Cantaloupe and NGINX run in Docker
- The admin GUI runs locally with live reload

### Additional Prerequisites

- NodeJS 20+
- npm 11+

### Start Development Backend

1. **Start the backend**

   ```sh 
   docker compose -f ./docker-compose.dev.yml up --build
   ```

2. **Install frontend dependencies**

   ```sh
   cd tiny
   npm install
   ```

3. **Start development server**
  
   ```sh
   npm start
   ```

4. **Access the admin GUI** at <http://localhost:4321> - note that there is **no password protection** in dev mode.

## Hosted Service at tiny-iiif.org

For institutions and projects without in-house IT support or infrastructure to manage servers, managed hosting is available at:

```
https://your-name.tiny-iiif.org
```

Hosted service includes:

- Deployment and server management
- Updates and maintenance
- Secure cloud hosting in a geographic region of your choice
- Technical support
- tiny-iiif.org sub-domain or optional custom domain
- Disk space starting from 50 GB

For pricing details or to discuss project requirements, please contact [hello@rainersimon.io](mailto:hello@rainersimon.io). Your subscription additionally contributes directly to the continued maintenance and development of tiny.iiif as an open-source project.

## License

[MIT](LICENSE)