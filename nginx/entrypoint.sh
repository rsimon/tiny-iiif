#!/bin/sh
set -e

if [ -n "$TINY_USERNAME" ] && [ -n "$TINY_PASSWORD" ]; then    
    # Install apache2-utils for htpasswd
    apk add --no-cache apache2-utils
        
    echo "Generating .htpasswd for user: $TINY_USERNAME"

    # Generate the htpasswd file
    htpasswd -nb "$TINY_USERNAME" "$TINY_PASSWORD" > /etc/nginx/.htpasswd
    
    echo ".htpasswd file generated successfully"
else
    echo "ERROR: TINY_USERNAME and TINY_PASSWORD must be set in .env file"
    exit 1
fi

sed "s|\${IIIF_PROXY_DESTINATION}|$IIIF_PROXY_DESTINATION|g" /etc/nginx/templates/default.conf > /etc/nginx/conf.d/default.conf