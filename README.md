# Digital Cow Hut Backend

<hr>

### Project Name: Online Cow Selling Backend for Eid Ul Adha

The main focus of this Project is to implement error handling, CRUD operations, pagination and filtering, transactions (including a simple transaction without a payment gateway), and additional routes as necessary.

### Technology Stack:

- Used TypeScript as the programming language.
- Used Express.js as the web framework.
- Used Mongoose as the Object Data Modeling (ODM) and validation library for MongoDB.

### Live Link: https://digital-cow-hut-seven.vercel.app/

### Application Routes:

#### User

- api/v1/auth/signup (POST)
- api/v1/users (GET)
- api/v1/users/648dc7df49be1ec53f9dc4d2 (Single GET)
- api/v1/users/648dc7df49be1ec53f9dc4d2 (PATCH)
- api/v1/users/648dc7df49be1ec53f9dc4d2 (DELETE)

#### Cows

- api/v1/cows (POST)
- api/v1/cows (GET)
- api/v1/cows/648d3f6e593570f77f75cc70 (Single GET)
- api/v1/cows/648d3f6e593570f77f75cc70 (PATCH)
- api/v1/cows/648d3f6e593570f77f75cc70 (DELETE)

### Pagination and Filtering routes of Cows

- api/v1/cows?page=1&limit=10
- api/v1/cows?sortBy=price&sortOrder=asc
- api/v1/cows?minPrice=20000&maxPrice=70000
- api/v1/cows?location=Chattogram
- api/v1/cows?searchTerm=Cha

#### Orders

- api/v1/orders (POST)
- api/v1/orders (GET)

# Thank you
