# Use bun alpine image
FROM oven/bun:alpine

# Create app directory
WORKDIR /usr/src/app

# For caching purposes, install deps without other changed files
COPY package.json bun.lockb ./

# Install deps
RUN bun install

# Copy source code
COPY . ./

# Build static site
RUN bun run build

# Set things up
EXPOSE 8500