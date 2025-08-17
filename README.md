# Trucking Company Backend API

This is a complete Node.js backend API for a fictional trucking company. It includes authentication, and CRUD APIs for managing drivers and trips.

## Features

- **Authentication**: Driver registration, login/logout with JWT.
- **Drivers API**: CRUD operations for driver profiles.
- **Trips API**: CRUD operations for trips.
- **Database**: PostgreSQL schema and connection management.
- **Validation**: Input validation for all endpoints.
- **Error Handling**: Centralized error handling.

## Project Structure

```
/
├── app.js              # Main application file
├── package.json        # Project dependencies and scripts
├── README.md           # This file
├── .env                # Environment variables (you need to create this)
├── .gitignore          # Files to be ignored by Git
├── db/
│   ├── db.js           # PostgreSQL connection pool
│   └── init.sql        # Database schema initialization script
├── routes/
│   ├── auth.js         # Authentication routes
│   ├── drivers.js      # Driver routes
│   └── trips.js        # Trip routes
├── controllers/
│   ├── authController.js
│   ├── driverController.js
│   └── tripController.js
└── middleware/
    └── authMiddleware.js # JWT authentication middleware
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [PostgreSQL](https://www.postgresql.org/)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd trucking-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project by copying the provided `.env` file.

```bash
cp .env .env
```

Now, open the `.env` file and update the following variables with your PostgreSQL credentials and a secure JWT secret:

```
# Server Configuration
PORT=3000

# PostgreSQL Database Configuration
DB_USER=your_db_user
DB_HOST=localhost
DB_DATABASE=trucking_db
DB_PASSWORD=your_db_password
DB_PORT=5432

# JWT Configuration
JWT_SECRET=a_very_secret_key_that_should_be_long_and_random
```

### 4. Set up the database

1.  Make sure your PostgreSQL server is running.
2.  Connect to PostgreSQL and create a new database. You can name it `trucking_db` or whatever you specified in your `.env` file.
3.  Run the `db/init.sql` script to create the necessary tables. You can do this using a tool like `psql`:

```bash
psql -U your_db_user -d trucking_db -f db/init.sql
```

### 5. Run the server

-   To run the server in production mode:
    ```bash
    npm start
    ```
-   To run the server in development mode (with auto-reloading via `nodemon`):
    ```bash
    npm run dev
    ```

The API will be running at `http://localhost:3000`.

## API Endpoints

All endpoints are prefixed with `/api`. A valid JWT must be sent in the `x-auth-token` header for all private routes.

### Authentication

-   `POST /auth/register`: Register a new driver.
    -   **Body**: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
-   `POST /auth/login`: Log in a driver and get a JWT.
    -   **Body**: `{ "email": "john@example.com", "password": "password123" }`

### Drivers (Private)

-   `GET /drivers/me`: Get the profile of the currently logged-in driver.
-   `PUT /drivers`: Update the logged-in driver's profile.
    -   **Body**: `{ "name": "Johnathan Doe", "working_hours": 8 }`
-   `DELETE /drivers`: Delete the logged-in driver's profile.

### Trips (Private)

-   `POST /trips`: Create a new trip for the logged-in driver.
    -   **Body**: `{ "destination": "New York", "cargo": "Electronics", "commission_type": "percentage" }`
-   `GET /trips`: Get a list of all trips.
-   `GET /trips/driver/:id`: Get all trips for a specific driver.
-   `GET /trips/ongoing`: Get all trips that are currently ongoing.
-   `PUT /trips/:id`: Update a trip's details.
    -   **Body**: `{ "destination": "Los Angeles", "cargo": "Furniture", "commission_type": "fixed" }`
-   `PUT /trips/:id/end`: Mark a trip as completed.
-   `DELETE /trips/:id`: Delete a trip.
