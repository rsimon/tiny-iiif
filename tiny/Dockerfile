FROM node:lts

WORKDIR /app

# COPY .env .
COPY tsconfig.json .
COPY package.json .
COPY . .
RUN npm install

ARG PUBLIC_IIIF_IMAGE_PATH
ENV PUBLIC_IIIF_IMAGE_PATH=${PUBLIC_IIIF_IMAGE_PATH}

RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]