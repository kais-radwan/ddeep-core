# syntax=docker/dockerfile:1

FROM node:alpine AS builder
ENTRYPOINT ["id"]
USER nonroot
COPY ./dist ./dist
EXPOSE 9999
CMD ["node", "dist/build.js"]