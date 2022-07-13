var express = require("express");
var serveStatic = require("serve-static");

var app = express();

app.use(serveStatic("./", { index: ["index.html", "index.html"] }));
app.listen(3000, () => {
	console.log(`Server started, open in browser at http://127.0.0.1:3000`);
});