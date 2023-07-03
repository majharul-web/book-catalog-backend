# Digital Cow Hut Auth Backend

<hr>

### Project Name: Online Cow Selling Backend for Eid Ul Adha

The main focus of this Project is to implement error handling, CRUD operations, pagination and filtering, transactions (including a simple transaction without a payment gateway), and additional routes as necessary.

### Technology Stack:

- Used TypeScript as the programming language.
- Used Express.js as the web framework.
- Used Mongoose as the Object Data Modeling (ODM) and validation library for MongoDB.

### Live Link: https://digital-cow-hut-admin.vercel.app/

### Application Routes:

## Main part

### Auth (User)

- Route: https://digital-cow-hut-admin.vercel.app/api/v1/auth/login (POST)
- Route: https://digital-cow-hut-admin.vercel.app/api/v1/auth/signup (POST)
- Route: https://digital-cow-hut-admin.vercel.app/api/v1/auth/refresh-token (POST)

### Auth (Admin)

- Route: https://digital-cow-hut-admin.vercel.app/api/v1/admins/create-admin (POST)
- Route: https://digital-cow-hut-admin.vercel.app/api/v1/admins/login (POST)

### User

- Route: https://digital-cow-hut-admin.vercel.app/api/v1/users (GET) Include an id that is saved in your database
- Route: https://digital-cow-hut-admin.vercel.app/api/v1/users/6177a5b87d32123f08d2f5d4 (Single GET) Include an id that is saved in your database
- Route: https://digital-cow-hut-admin.vercel.app/api/v1/users/6177a5b87d32123f08d2f5d4 (PATCH) Include an id that is saved in your database
- Route: https://digital-cow-hut-admin.vercel.app/api/v1/users/6177a5b87d32123f08d2f5d4 (DELETE) Include an id that is saved in your database

#### Cows

- Route: https://digital-cow-hut-admin.vercel.app/api/v1/cows (POST)
- Route: https://digital-cow-hut-admin.vercel.app/api/v1/cows (GET)
- Route: https://digital-cow-hut-admin.vercel.app/api/v1/cows/648d3f6e593570f77f75cc70 (Single GET) Include an id that is saved in your database
- Route: https://digital-cow-hut-admin.vercel.app/api/v1/cows/648d3f6e593570f77f75cc70 (PATCH) Include an id that is saved in your database
- Route: https://digital-cow-hut-admin.vercel.app/api/v1/cows/648d3f6e593570f77f75cc70 (DELETE) Include an id that is saved in your database

#### Orders

- Route: https://digital-cow-hut-admin.vercel.app/api/v1/orders (POST)
- Route: https://digital-cow-hut-admin.vercel.app/api/v1/orders (GET)

## Bonus Part

#### Admin

-Route: https://digital-cow-hut-admin.vercel.app/api/v1/admins/create-admin (POST)

#### My Profile

- Route: https://digital-cow-hut-admin.vercel.app/api/v1/users/my-profile (GET)
- Route: https://digital-cow-hut-admin.vercel.app/api/v1/users/my-profile (PATCH)

#### Order:

- Route: https://digital-cow-hut-admin.vercel.app/api/v1/orders/64a251d7454768393bb15c03 (GET)

# Thank you
