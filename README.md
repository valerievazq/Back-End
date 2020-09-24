# Back-End

Backend implementation of build week

Expat Journal Back-end API Information
API: https://expat-journalist.herokuapp.com/

REGISTER AND LOGIN

Type Endpoint Function Requisites

POST /register registers a user requires a first name, last name, email, and password
POST /login logs a user in requires a email and password returns an authorized token.

USERS

Type Endpoint Function
GET /users returns a list of all users
GET /users/:id returns a specific user by id
PUT /users/update/:id allows specific user to be edited
DELETE /users/delete/:id allows user to be delted
GET /users/logout allows user to logout

Type Endpoint Function
GET /stories returns a list of all stories
GET /stories/:id returns a specific story by id
POST /stories adds new story
PUT /stories/:id updates specific story by id
DELETE /stories/:id deletes specific story by id
