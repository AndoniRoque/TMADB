const http = require('http');
const url = require('url');

http.createServer(function(req, res){
  const q = url.parse(req.url, true);
  let filename = "";
  if (q.pathname === "/") {
    filename = "." + "/index.html"
  }
})
.listen(8099)