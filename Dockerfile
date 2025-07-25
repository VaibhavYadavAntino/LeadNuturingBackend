FROM node:18.19.1
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD [ "npm","run","dev" ]
