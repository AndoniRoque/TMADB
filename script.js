const axios = require('axios');

// axios
//   .get("http://localhost:8050/clientes/")
//   .then(res => {
//     console.log(`statusCode: ${res.status}`);
//     console.log(res.data);
//   })
//   .catch(error => {
//     console.log(error);
//   });

axios
  .post("http://localhost:8050/clientes/", {
    "nombre": "Andrés",
    "apellido": "Molina",
    "email": "andresoad@hotmal.com",
    "telefono": 1234567891,
    "comentarios": "Soy celíaco."
  })
  .then(res => {
    console.log(`statusCode: ${res.status}`);
    console.log(res.data);
  })
  .catch(error => {
    console.log(error);
  });