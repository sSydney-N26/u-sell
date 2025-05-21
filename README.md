---

1. Database Setup Instructions (MySQL)

---

1.1 Install MySQL:

- Download and install MySQL Community Server from:
  https://dev.mysql.com/downloads/mysql/

  1.2 Start MySQL Server:

- macOS (if using Homebrew): brew services start mysql
- Windows: Start MySQL via Services or use `net start mysql`

- To confirm MySQL is running, run:

  mysqladmin ping -u root -p

  If the server is running, it will respond with:
  mysqld is alive

  1.3 Create the sample database and table:

- Open a terminal and log in to MySQL:

  mysql -u root -p

- Then run the following SQL commands:

  CREATE DATABASE testDB;
  USE testDB;

  CREATE TABLE student (
  uid DECIMAL(3, 0) NOT NULL PRIMARY KEY,
  name VARCHAR(30),
  score DECIMAL(3, 2)
  );

  INSERT INTO student VALUES (1, 'alice', 0.1);
  INSERT INTO student VALUES (2, 'bob', 0.4);

---

2. Application Setup (Next.js)

---

2.1 Prerequisites:

- Node.js and npm installed

  2.2 Install dependencies:

- In your project directory, run:

  npm install
  npm install mysql2

  2.3 Start the development server:

  npm run dev

  2.4 API Route Setup:

- API route located at: app/api/test-connection/route.ts
- Connects to the `testDB` MySQL database and runs a query:

  SELECT uid, name, score FROM student;

  2.5 Frontend:

- Located in: app/page.tsx
- On page load, it fetches from `/api/test-connection` and displays a list of students.

  2.6 Test the app:

- Open a browser and go to: http://localhost:3000
