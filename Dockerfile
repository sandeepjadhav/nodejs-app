 FROM node:22-alpine

# Create app directory
WORKDIR /app

# Copy package.json first (better cache usage)
COPY package*.json ./

# Fix permissions (very important when Jenkins mounts workspace)
RUN mkdir -p /app/node_modules && chown -R node:node /app

# Configure npm cache location to avoid root locked directory issue
RUN npm config set cache /app/.npm-cache --global

# Switch to non-root user
USER node

# Install dependencies
RUN npm install

# Copy rest of app
COPY --chown=node:node . .

EXPOSE 3000

CMD [ "node", "app.js" ]
