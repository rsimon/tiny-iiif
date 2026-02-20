# Development

This repository includes a separate Docker setup for frontend development. In development mode:

- Cantaloupe and NGINX run in Docker
- The admin GUI runs locally with live reload

## Prerequisites

- NodeJS 20+
- npm 11+

## Start Development Backend

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
