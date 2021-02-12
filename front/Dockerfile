FROM node:13.12.0-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install
RUN npm install react-scripts -g
EXPOSE 3000
EXPOSE 35729
ADD . /app
CMD ["npm", "start"]
