// const axios = require('axios');
const fs = require('node:fs');

try {
  const data = fs.readFileSync('./Users/joe/test.txt', 'utf8');
  console.log(data);
} catch (err) {
  console.error(err);
}

// const content = 'Some other content!';

// try {
//   fs.writeFileSync('./Users/joe/test.txt', content, {flag:'a+'});
//   // file written successfully
// } catch (err) {
//   console.error(err);
// }

// axios
//   .get("http://localhost:8050/clientes/")
//   .then(res => {
//     console.log(`statusCode: ${res.status}`);
//     console.log(res.data);
//   })
//   .catch(error => {
//     console.log(error);
//   });

// axios
//   .post("http://localhost:8050/clientes/", {
//     "nombre": "Andrés",
//     "apellido": "Molina",
//     "email": "andresoad@hotmal.com",
//     "telefono": 1234567891,
//     "comentarios": "Soy celíaco."
//   })
//   .then(res => {
//     console.log(`statusCode: ${res.status}`);
//     console.log(res.data);
//   })
//   .catch(error => {
//     console.log(error);
//   });
