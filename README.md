# task-manager-api

access task manager api from Postman or similar at {{url}} = https://git.heroku.com/rogi-task-manager.git

routes available with mongoDB atlas connection and email service with SendGrid API:

POST
  - Create user (creates authToken): POST/ {{url}}/users
  - Login user (create authToken): POST/ {{url}}/users/login
  - Create tasks (authToken): POST/ {{url}}/tasks
  - Logout all users (cleart authTokens): POST/ {{url}}/users/logoutAll
  - Logout logged in user (authToken): POST/ {{url}}/users/logout
  - Upload logged in user's avatar(image) (authToken): POST/ {{url}}/users/me/avatar
  - Delete logged in user's avatar(image) (authToken): POST/ {{url}}/users/me/avatar
  
-----------------------------------------------------------------
GET
  - Read logged in user's profile (authToken): GET/ {{url}}/users/me
  - List logged in user's tasks (authToken): GET/ {{url}}/tasks?limit=3&skip=1&sortBy=createdAt:desc
  
-----------------------------------------------------------------
PATCH 
  - Update logged in user (authToken): PATCH/ {{url}}/users/me
  - Update task by id: PATCH/ {{url}}/tasks/5d51984f036983234c543aef

-----------------------------------------------------------------
DELETE
  - Delete logged in user (authToken): DELETE/ {{url}}/users/me
  - Delete task by id: DELETE/ {{url}}/tasks/5d400e606498af22588b33cb
