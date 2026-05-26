const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const parts = line.trim().split('=');
      if (parts.length >= 2 && !line.trim().startsWith('#')) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        process.env[key] = val;
      }
    });
  }
}

async function main() {
  loadEnv();

  console.log('Checking database connection with parameters:');
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`Port: ${process.env.DB_PORT}`);
  console.log(`User: ${process.env.DB_USER}`);
  console.log(`Database: ${process.env.DB_NAME}`);

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      multipleStatements: true,
      connectTimeout: 10000,
    });
    console.log('Successfully connected to the database.');
  } catch (err) {
    console.error('Failed to connect to the database:', err.message);
    process.exit(1);
  }

  try {
    // Check if tables exist
    const [tables] = await connection.query('SHOW TABLES');
    const tableNames = tables.map(row => Object.values(row)[0]);
    console.log('Existing tables in database:', tableNames);

    const requiredTables = [
      'svt_web_categories',
      'svt_web_products',
      'svt_web_contact_messages',
      'svt_web_bookings',
      'svt_web_enquiries'
    ];

    const missingTables = requiredTables.filter(t => !tableNames.includes(t));

    if (missingTables.length > 0) {
      console.log(`Missing tables detected: ${missingTables.join(', ')}`);
      console.log('Running migrate.sql migration script...');

      const migrateSqlPath = path.join(__dirname, 'migrate.sql');
      if (fs.existsSync(migrateSqlPath)) {
        const migrateSql = fs.readFileSync(migrateSqlPath, 'utf8');
        await connection.query(migrateSql);
        console.log('Migration completed successfully.');
      } else {
        console.error('migrate.sql script not found!');
        process.exit(1);
      }
    } else {
      console.log('All required tables are present in the database. No migration needed.');
    }
  } catch (err) {
    console.error('Error during database check/migration:', err.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();
