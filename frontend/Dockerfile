FROM node:20-alpine

# Set the working directory in the container
WORKDIR /code

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy configuration files from the support folder
# COPY package.json yarn.lock tsconfig.json ./

# Copy the rest of the application source code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["yarn", "run", "dev"]

