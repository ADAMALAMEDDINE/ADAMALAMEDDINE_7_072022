# groupomania


## Basic configurationn before starting ...

### Create new mysql db with the name of your choice
(tables and relations in this db, will be automaticly created following the model definitions)
### At the project root :
```
touch .env
```
### .env file content must look like :
```
SERVER_PORT=<port number of your choice>
DB_NAME=<same db name as the one you created in mysql>
DB_USER=<one of your mysql accounts id>
DB_PASS=<your mysql account password>
DB_HOST=<your host (localhost if in local)>
JWT_SECRET=<the scret of your choice>
JWT_DURING=<time before session expires - ex : 1 d>
USER_ADMIN_FIRSTNAME=<the firstname who will give admin role to user when signing in with>
BCRYPT_SALT_ROUND=<salting for password encryption ex : 5>
```


## Project setup
```
npm install
```

### Compiles without hot-reload for development
```
npm run start
```

### Compiles with hot-reload for development
```
npm run dev
```

