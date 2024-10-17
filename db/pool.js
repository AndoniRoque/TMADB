const { Pool } = require('pg');

// Deberían ser variables de entorno pero que paja
module.exports = new Pool({
  host: "localhost",
  user: "mesa20",
  database: "top_users",
  password: "mesa20",
  port: 5432,
});

// connection uri
// module.exports = new Pool({
//   connectionString: "postgresql://<role_name>:<role_password>@localhost:5432/top_users"
// });