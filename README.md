# Simple Scalable Grocery List Project
![website image](https://github.com/jthnl/grocery/blob/main/images/main.png)

## Feature Highlights
- Creating Multiple Lists
- Reordering, Deleting, Creating Items for the List
- List Versioning - users can rollback to old versions of their lists
- Scalability, each modification requires minimal db access 

## Development Guide
### Prerequisites
1. download and install npm: [Getting Started with NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
1. download and install postgreSQL: [Getting Started with PostgreSQL](https://www.w3schools.com/postgresql/postgresql_getstarted.php)

### Setting up Database
1. setup postgres: [W3School PostgreSQL](https://www.w3schools.com/postgresql/postgresql_getstarted.php)
1. create new database
1. run SQL script on ```./database/createTable.sql``` on database

### Setting up Project
1. clone this git repository
1. ```npm install``` on both ```./server/``` and ```./client```
1. Add `.env` files on ```./server/``` and ```./client```
- Example ./server/.env
```
PORT=3001
FRONT_END=http://localhost:3000
DB_HOST=localhost
DB_USER=myusername
DB_PASSWORD=mypassword
DB_NAME=grocerydb
```
- Example ./client/.env
```
REACT_APP_BASE_URL=http://localhost:3001
```

### Running Project
1. make sure that postgreSQL server is running
1. on ```./server/``` run ```npm run fastrun```
1. on ```./client/``` run ```npm run start```
1. navigate to URL set on ```REACT_APP_BASE_URL``` or React should open the app on browser.

## Usage
1. register a new user:
![website sign up](https://github.com/jthnl/grocery/blob/main/images/signup.png)
1. login with a new user:
![website login](https://github.com/jthnl/grocery/blob/main/images/login.png)
1. create a new shopping list:
![website login](https://github.com/jthnl/grocery/blob/main/images/create_list.png)
![website login](https://github.com/jthnl/grocery/blob/main/images/new_list.png)
1. add items to the list:
![website login](https://github.com/jthnl/grocery/blob/main/images/add_items.png)
1. re-order items to the list:
![website login](https://github.com/jthnl/grocery/blob/main/images/reorder_items.png)
1. arrows show old versions of the list:
![website login](https://github.com/jthnl/grocery/blob/main/images/add_items.png)
1. delete items off the list (x), check items on the list (checkbox) or create new lists:
![website login](https://github.com/jthnl/grocery/blob/main/images/final.png)



