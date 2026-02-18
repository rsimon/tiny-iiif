# HTTPS Setup

NGINX starts with an HTTP-only configuration per default. Once all tiny.iiif services are running, you can obtain a free [LetsEncrypt](https://letsencrypt.org/) certificate to enable HTTPS. 

1. **Run the certbot script** to simulate the certification issue process. Replace `your-domain.org` with your actual domain.

   ```sh
   docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ --dry-run -d your-domain.org
   ```

2. If successful, **obtain the certificate**.

   ```sh
   docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d your-domain.org
   ```

3. **Update NGINX configuration**.

   - Remove the default HTTP-only config.

   ```sh
   mv default.conf default.conf.http
   ```

   - Make the included HTTPS config file the new default config

   ```sh
   mv default.conf.https default.conf
   ```

   - In the configuration file replace all occurrences of `yourdomain.org` (4x) with your domain name.

4. **Restart tiny.iiif**.

   ```sh
   docker compose down
   docker compose up
   ```

5. **Verify HTTPS** — open `https://your-domain.org/tiny` in a browser and confirm the tiny.iiif admin UI is accessible and protected via login.