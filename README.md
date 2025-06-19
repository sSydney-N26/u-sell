<h1>1. Database Setup Instructions (MySQL)</h1>

<h2>1.1 Install MySQL</h2>
<ul>
  <li>Download and install MySQL Community Server from: <a href="https://dev.mysql.com/downloads/mysql/">https://dev.mysql.com/downloads/mysql/</a></li>
</ul>

<h2>1.2 Start MySQL Server</h2>
<ul>
  <li>Run: <code>mysql -u root -p</code></li>
</ul>

<h3>Verify MySQL is Running</h3>
<ul>
  <li>Run: <code>mysqladmin ping -u root -p</code></li>
  <li>If the server is running, it will respond with: <code>mysqld is alive</code></li>
</ul>

<h2>1.3 Setup Mock Database and Schema</h2>
<ul>
  <li> Navigate to: </>
  <pre><code> src/app/db </code></pre>
  <li>Make the script executable:</>
  <pre><code>chmod +x src/app/db/setup-db.sh</code></pre>
  <li>Run the setup script to create the mock database and insert sample data:</li>
  <pre><code>./setup-db.sh</code></pre> or <pre><code> bash setup-db.sh </code></pre>
  <li> By the end, you should see the Database Setup Complete message </li>
  <li>This script will drop the existing `u_sell` database if it exists, recreate it, and populate it with the schema and mock data. If u_sell data
  base has never been created, it will create one and populate it with the
  schema and mock data.</li>
</ul>

<h2>1.4 Test Queries with Mock Data</h2>
<ul>
  <li>Connect to the `u_sell` database:</li>
  <pre><code>mysql -u root</code></pre>
  <pre><code>USE u_sell;</code></pre>
  <li>Run SQL queries to test the mock data. For example:</li>
  <pre><code>
SELECT * FROM Users;
  </code></pre>
  this should return:
  <pre><code>
+-----------+----------+--------------------+------------------------+------+---------------------+
| uid       | username | email              | program                | year | created_at          |
+-----------+----------+--------------------+------------------------+------+---------------------+
| x8uocqJbNoWO7TL6ZCEXCR2Hm1k1 | alice    | alice@uwaterloo.ca | Computer Science       |    2 | 2025-06-10 10:50:09 |
| uid_bob   | bob      | bob@uwaterloo.ca   | Electrical Engineering |    3 | 2025-06-10 10:50:09 |
| uid_carol | carol    | carol@uwaterloo.ca | Mechanical Engineering |    1 | 2025-06-10 10:50:09 |
+-----------+----------+--------------------+------------------------+------+---------------------+
  </code></pre>
</ul>

<hr>

<h1>2. Application Setup (Next.js)</h1>

<h2>2.1 Prerequisites</h2>
<ul>
  <li>Node.js and npm installed</li>
</ul>

<h2>2.2 Install Dependencies</h2>
<ul>
  <li>In your project directory, run:</li>
  <pre><code>
npm install
npm install mysql2
  </code></pre>
</ul>

<h2>2.3 Start the Development Server</h2>
<pre><code>npm run dev</code></pre>

<h2>2.4 API Route Setup</h2>
<ul>
  <li>API route located at: <code>app/api/test-connection/route.ts</code></li>
  <li>Connects to the <code>testDB</code> MySQL database and runs a query:</li>
  <pre><code>SELECT uid, name, score FROM student;</code></pre>
</ul>

<h2>2.5 Frontend</h2>
<ul>
  <li>Located in: <code>app/page.tsx</code></li>
  <li>On page load, it fetches from <code>/api/test-connection</code> and displays a list of students.</li>
</ul>

<h2>2.6 Test the App</h2>
<ul>
  <li>Open a browser and go to: <a href="http://localhost:3000">http://localhost:3000</a></li>
</ul>
