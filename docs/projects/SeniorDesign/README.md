# 2025 Spring Team 25

## NCSU College of Natural Resources


## Usage

### Running the client
1. ```cd``` into the ```client/``` directory
2. Install the packages
  ```npm i```
3. Start the react application
  ```npm start```


### Running the server
1. ```cd``` into the ```server/``` directory
2. Install the packages
  ```npm i```
3. Copy the .env.template file to .env and enter in information it requires
4. Start the nodejs application
  ```node index.js```

### DEV NOTES
1. On a fresh pull, run the freshPull.sh script to clear the docker containers of its volumes. This allows it to reset to a state where the changes will work.
2. After running script, CTRL+C to close it
3. Run `docker-compose up` and it will work.

### Testing the Server
1. ```cd``` into ```server/``` directory
2. Install the packages with ```npm i```
3. Run the server with ```NODE_ENV=testing node index.js```
