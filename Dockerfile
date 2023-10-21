# syntax=docker/dockerfile:1

FROM node:alpine
ENTRYPOINT ["id"]
COPY ./dist ./dist
EXPOSE 9999
CMD ["node", "dist/build.js"]