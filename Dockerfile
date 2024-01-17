FROM node:20.10.0-alpine

RUN apk update && \
    apk upgrade && \
    apk add --no-cache git dumb-init

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Copy package.json files to the working directory (./)
COPY yarn.lock ./
COPY package.json ./

# Install dependencies using yarn
RUN yarn install --frozen-lockfile --no-cache

# Copy the rest of the application code to the working directory
COPY ./ .

# Set production environment
ENV NODE_ENV=production

# Custom build workflows would be added here
# ==========================================
# ==========================================

# Set port environment variable
ENV PORT=80

# Expose port 80
EXPOSE 80

# Start the application
CMD ["dumb-init", "node", "src/index.js"]
