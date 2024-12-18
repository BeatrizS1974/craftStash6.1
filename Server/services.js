//const TheCraftStash = require('the-craft-stash');
const {MongoClient, ObjectId } =require('mongodb');

const dbUrl =  process.env.BD_URI || "mongodb://127.0.0.1";

const client = new MongoClient(dbUrl);


var services = function(app) {

    app.post('/write_record', async function(req, res){
    var newData = {
        ProductDescription: req.body.ProductDescription,
        Color: req.body.Color,
        ManufacturerName: req.body.ManufacturerName,
        ProductType: req.body.ProductType,
        Location: req.body.Location,
        Quantity: req.body.Quantity
        };
        
        var search = {ProductDescription: req.body.ProductDescription};

        try{
            const conn = await client.connect();
            const db = conn.db("craftstash");
            const coll = db.collection("products");

            const product = await coll.find(search).toArray();

           if(product.length > 0) {
                await conn.close();
                return res.send(JSON.stringify({msg: "Product Already Exists"}));
        }else{
            await coll.insertOne(newData);
            await conn.close();
            return res.send(JSON.stringify({msg: "SUCCESS"}));
        }
       }catch (error){
            await conn.close();
            return res.send(JSON.stringify({msg: "Error" + error}));
       }
    });

    app.get('/get-Products', async function(req, res) {
        try {
            const conn = await client.connect();
            const db = conn.db("craftstash");
            const coll = db.collection("products");

            const data = await coll.find().toArray();
            await conn.close();
            return res.send(JSON.stringify({msg: "SUCCESS", products: data}))

        }catch (error){
            await conn.close();
            return res.send(JSON.stringify({msg: "Error" + error}));   
        }
    });

    app.get("/get-productsByType", async function(req, res) {

        var search = (req.query.type === "") ? { } : {type: req.query.type};

        try{
            const conn = await client.connect();
            const db = conn.db("craftstash");
            const coll = db.collection('products');

            const data = await coll.find(search).toArray();
            await conn.close();
            return res.send(JSON.stringify({msg: "SUCCESS", products: data }))

        } catch(error) {
        await conn.close();
        return res.send(JSON.stringify({msg: "Error" + error}));  
    } 
    });

    app.put('/update-product', async function(req, res) {
        var updateData = {
            $set:{
                ProductDescription: req.body.ProductDescription,
                Color: req.body.Color,
                ManufacturerName: req.body.ManufacturerName,
                ProductType: req.body.ProductType,
                Location: req.body.Location,
                Quantity: req.body.Quantity,
            
            }
        };
            try{
                const conn = await client.connect();
                const db = conn.db("craftstash");
                const coll = db.collection('products');

                const search = {_id:ObjectId.createFromHexString(req.body.ID)};


            await coll.updateOne(search, updateData);

            await conn.close();

            return res.send(JSON.stringify({msg: "SUCCESS" }))

        } catch(err){
            console.log(err);
            return res.send(JSON.stringify({msg: "Error", products: err }));
        }
    
    });

    app.delete('/delete-product', async function(req, res) {
        try{
            const conn = await client.connect();
            const db = conn.db("craftstash");
            const coll = db.collection("products");

            const search = {_id: ObjectId.createFromHexString(req.query.productId)};
            
            await coll.deleteOne(search);
            await conn.close();
            return res.send(JSON.stringify({msg: 'SUCCESS'}));

           
        }catch(error) {
            await conn.close();
            return res.send(JSON.stringify({msg: "Error" + error}));  
        }
    });

    //For refreshing the products table
    app.post('/refreshProducts', async function(req, res) {
    // console.log("In refresh products");
    try {
        const conn = await client.connect();
        const db = conn.db("craftstash");
        const coll = db.collection('products');
        await coll.drop();
        console.log("Dropped database");
        await client.close();
        initializeDatabase();
        return res.status(200).send(JSON.stringify({msg:"SUCCESS"}));        
    } catch(err) {
        console.log(err);
        return res.status(200).send(JSON.stringify({msg:"Error: " + err}));
    }

});

}

//To Initialize the products table
var initializeDatabase = async function() {

    try {
        const conn = await client.connect();
        const db = conn.db("craftstash");
        const coll = db.collection('products');
        const data = await coll.find().toArray();

        if(data.length === 0) {
            var products = TheCraftStash.all;
            await coll.insertMany(products);
            console.log("Added seed records");
        }

        await conn.close();
    } catch(err) {
        console.log(err);
    }

}

module.exports = { services, initializeDatabase };

