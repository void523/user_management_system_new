# user_management_system_new
backend api for user management system

### API ENDPOINTS

### USER APIs

**endpoint** : /users/signup
**function** : creates a new user registration
**method** : POST

**endpoint** : /users/login 
**function** : logs a user with JWT authentication
**method** : POST

**endpoint** : /users/:userId/:token
**function** : email verification
**method** : GET

**endpoint** : /users/reset
**function** : to initiate password reset
**method** : POST

**endpoint** : /users/newPass
**function** : to update new password to database
**method** : POST

**endpoint** : /users/dashboard 
**function** : a protectued route for a user displaying user information
**method** : GET


### ADMIN API

**endpoint** : /admins/signup
**function** : creates a new admin registration
**method** : POST

**endpoint** : /admins/login 
**function** : logs a admin with JWT authentication
**method** : POST

**endpoint** : /admins/dashboard 
**function** : a protected route for admin's info and to perform CRUD operation
**method** : GET

### user admin's CRUD APIs

**endpoint** : /users/dashboard/users
**function** : get information on all users
**method** : GET

**endpoint** : /users/dashboard/:userId
**function** : get information on a specific user via _id
**method** : GET

**endpoint** : /user/dashboard/:userId
**function** : update information of a specific user via _id
**method** : PATCH

**endpoint** : /user/dashboard/:userId
**function** : deletes a specific user via _id
**method** : DELETE
