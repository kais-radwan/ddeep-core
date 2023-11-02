
FROM oven/bun:1.0.7 as base
WORKDIR /

COPY / /
RUN bun install

USER bun
EXPOSE 3000/tcp
ENTRYPOINT ["bun", "start"]