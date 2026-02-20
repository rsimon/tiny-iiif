# tiny.iiif

Turn a folder of images into a working [IIIF](https://iiif.io/) setup – in a minute or less!

![Screenshot of the tiny.iiif admin GUI](screenshot.jpg "Screenshot of the tiny.iiif admin GUI")

## Contents

- [Overview](#overview)
- [Who is tiny.iiif for?](#who-is-tinyiiif-for)
- [Features](#features)
- [Self-Hosting](#self-hosting) — on your own server
- [Hosted Service](#hosted-service-at-tiny-iiiforg) — no server required
- [Usage](#usage)
- [Development](#development)
- [License](#license)

## Overview

**tiny.iiif** is a lightweight IIIF server for small to medium-sized collections. It provides a simple way to publish images via the IIIF [Image](https://iiif.io/api/image/3.0/) and [Presentation](https://iiif.io/api/presentation/3.0/) APIs without deploying a full collection management system.

It fills the gap between large repository platforms and hand-editing IIIF manifest JSON files.

## Who is tiny.iiif for?

tiny.iiif is particularly useful for:

- Small collections (tens to a few thousand images)
- Online exhibitions
- Digital Humanities research projects
- DH classroom exercises
- Developers building IIIF-powered tools
- Institutions that need lightweight IIIF infrastructure without running a full repository stack

## Features

- **Drag & drop images** → instant IIIF Image Service powered by [IIPImage](https://iipimage.sourceforge.io/) or [Cantaloupe](https://cantaloupe-project.github.io/).
- **Create a folder, add images** → instant IIIF Presentation v3 manifest
- **Zero configuration** → works out of the box with sensible defaults
- **User-friendly admin interface** → simple, modern, easy to use
- **Production-ready** → Docker-based deployment with [NGINX](https://nginx.org/) as reverse proxy

## Self-Hosting

### Requirements

- Minimum server hardware: **1 CPU and 2 GB RAM** (2 CPUs / 4 GB for Cantaloupe)
- Sufficient disk space – tiny.iiif converts all uploaded images to [pyramidal TIFF format for performance reasons](https://cantaloupe-project.github.io/manual/5.0/images.html)
- Docker 24.0+ and Docker Compose 2.x
- A domain or subdomain pointing to your server

### Installation

1. **Clone this repository**

2. **Create an environment file** - copy the included `.env.example`

   ```sh
   cp .env.example .env
   ```

3. **Configure authentication** - edit `.env` to change your username and password for the admin GUI. (Default credentials are `tiny` / `tiny`.)

4. **Optional: Configure image server** - per default, tiny.iiif uses [IIPImage](https://iipimage.sourceforge.io/). You can choose to use [Cantaloupe](https://cantaloupe-project.github.io/) instead.
   
   - Set `COMPOSE_PROFILE=cantaloupe` in `.env`
   - Uncomment the Cantaloupe variable section: `IIIF_PROXY_DESTINATION` and `IIIF_IMAGE_PATH` 
   - Comment out the IIPImage section

5. **Start tiny.iiif**

   ```sh 
   docker compose up --build
   ```

6. **Access services locally**
   - Admin GUI: <http://localhost/tiny>
   - IIIF Image API: <http://localhost/iiif>
   - Manifests: <http://localhost/manifests>

7. **Configure HTTPS** – to set up HTTPS using [LetsEncrypt](https://letsencrypt.org/) follow the [HTTPS Setup Guide](guides/https-setup.md).

> [!IMPORTANT]
> You can **only choose between IIPImage or Cantaloupe during initial setup**. Once you have created manifests, switching is no longer supported because image-server-specific URLs are embedded in the manifests. To change servers later, you must delete and re-create all manifests.

## Hosted Service at tiny-iiif.org

For institutions and projects without in-house IT support or infrastructure to manage servers, managed hosting is available at:

```
https://[your-name].tiny-iiif.org
```

Hosted service includes:

- Deployment and server management
- Updates and maintenance
- Secure cloud hosting in a geographic region of your choice
- Technical support
- tiny-iiif.org sub-domain or optional custom domain
- Disk space starting from 50 GB

For pricing or to discuss project requirements, contact [hello@rainersimon.io](mailto:hello@rainersimon.io). Your subscription contributes directly to the continued maintenance and development of tiny.iiif as an open-source project.

## Usage

Once **tiny.iiif** is running:

1. Open the admin GUI at <http://[your-domain]/tiny>
2. Log in with your credentials (default: `tiny` / `tiny`)
3. Drag and drop images to publish them via Cantaloupe
4. Create folders and add images to publish IIIF Presentation manifests

## Development

This repository includes a separate Docker setup for frontend development. See the [Developer Guide](guides/development.md) for details.

## License

[MIT](LICENSE)