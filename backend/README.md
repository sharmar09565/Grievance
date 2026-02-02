# Grievance System Backend

## Setup Instructions

1.  **Navigate to backend directory**:
    ```bash
    cd backend
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```
    *Note: If restricted by PowerShell, use `cmd /c npm install`*

3.  **Setup Database**:
    - Ensure MySQL is running on localhost.
    - Create a database named `grievance_db` (or update `.env` file).
    - Run the setup script:
      ```bash
      node setup_db.js
      ```
    - Alternatively, import `database/schema.sql` using MySQL Workbench.

4.  **Run Server**:
    ```bash
    node server.js
    ```
    - Server runs on `http://localhost:5000`

## API Endpoints

-   `POST /api/auth/register` - { name, email, password, role }
-   `POST /api/auth/login` - { email, password }
-   `POST /api/grievances` - Submit grievance form data
-   `GET /api/grievances/track/:id` - Get status
-   `GET /api/grievances` - (Admin) List all (requires Token)

## Frontend Integration

The frontend files (`login.js`, `registerGrievance.js`, `trackGrievance.js`) are configured to fetch from `http://localhost:5000`.
Ensure cors is enabled on backend (already configured).
