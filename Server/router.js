const path = require('path');

//Page Listener(router)
var router = function(app) {

    app.get("/", function(req, res){
        res.status(200).sendFile(path.join(__dirname + "/../Client/index.html"));
});

app.get("/home", function(req, res){
    res.status(200).sendFile(path.join(__dirname + "/../Client/index.html"));
});

app.get("/write-data", function(req, res){
    res.status(200).sendFile(path.join(__dirname + "/../Client/write-data.html"));
});
app.get("/view-data", function(req, res){
    res.status(200).sendFile(path.join(__dirname + "/../Client/view-data.html"));
});
app.get("/browse-data", function(req, res){
    res.status(200).sendFile(path.join(__dirname + "/../Client/browse-data.html"));
});
}

module.exports = router;