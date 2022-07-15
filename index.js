const express = require("express");
const cors = require("cors");
const app = express();
const stripe = require("stripe")(
  "sk_test_51L1CCDGNqDr1x0jXfD1ulRKMbmTfNHYqb7xn3ZfkWdJSPbcLbe6HuvVoLLgQrPgaFNoqPpwvNeBoAqeCpJEprUam00bKzpYKvs",
);

app.use(express.static("public"));
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

// HkkdPSfQoDZARUc2

const uri =
  "mongodb+srv://kaitindResto:HkkdPSfQoDZARUc2@cluster0.fseuo.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const productCollection = client.db("restaurant").collection("products");
    const allDayBreakfastCollection = client
      .db("restaurant")
      .collection("all_day_breakfast");
    const sandwichesCollection = client
      .db("restaurant")
      .collection("sandwiches");
    const burgersCollection = client.db("restaurant").collection("burgers");
    const freshDessertsCollection = client
      .db("restaurant")
      .collection("fresh_desserts");
    const newArrivalsCollection = client
      .db("restaurant")
      .collection("new_arrivals");
    const riceBowlsCollection = client
      .db("restaurant")
      .collection("rice_bowls");
    const noodleBowlsCollection = client
      .db("restaurant")
      .collection("noodle_bowls");
    const biryanisCollection = client.db("restaurant").collection("biryanis");
    const accompanimentsCollection = client
      .db("restaurant")
      .collection("accompaniments");
    const sidesBeveragesCollection = client
      .db("restaurant")
      .collection("sides_beverages");
    const orderCollection = client.db("restaurant").collection("order");

    //Order code
    app.post("/order", async (req, res) => {
      const product = req.body;

      const doc = {
        ...product,
      };
      const result = await orderCollection.insertOne(doc);

      res.send(result);
    });
    //order update

    app.patch("/order/:id", async (req, res) => {
      const id = req.params.id;
      const { quantity } = req.body;
      const filter = { _id: id };

      const updatedDoc = {
        $set: {
          quantity,
        },
      };
      const updatedBooking = await orderCollection.updateOne(
        filter,
        updatedDoc,
      );

      res.send(updatedBooking);
    });
    //order get
    app.get("/order", async (req, res) => {
      const query = req.query;

      const result = await orderCollection.find(query).toArray();

      res.send(result);
    });

    //order delete
    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });
    //order delete Many
    app.delete("/order", async (req, res) => {
      const query = req.query;
      console.log(query);
      const result = await orderCollection.deleteMany(query);
      res.send(result);
    });
    //1. ========
    app.get("/allday", async (req, res) => {
      const result = await allDayBreakfastCollection.find({}).toArray();
      res.send(result);
    });

    //2. ========
    app.get("/sandwich", async (req, res) => {
      const result = await sandwichesCollection.find({}).toArray();
      res.send(result);
    });

    //3. ========
    app.get("/burgers", async (req, res) => {
      const result = await burgersCollection.find({}).toArray();
      res.send(result);
    });

    //4. ========
    app.get("/fresh", async (req, res) => {
      const result = await freshDessertsCollection.find({}).toArray();
      res.send(result);
    });

    //5. ========
    app.get("/newarrival", async (req, res) => {
      const result = await newArrivalsCollection.find({}).toArray();
      res.send(result);
    });

    //6. ========
    app.get("/rice", async (req, res) => {
      const result = await riceBowlsCollection.find({}).toArray();
      res.send(result);
    });

    //7. ========
    app.get("/noodle", async (req, res) => {
      const result = await noodleBowlsCollection.find({}).toArray();
      res.send(result);
    });

    //8. ========
    app.get("/biryani", async (req, res) => {
      const result = await biryanisCollection.find({}).toArray();
      res.send(result);
    });

    //9. ========
    app.get("/accompaniments", async (req, res) => {
      const result = await accompanimentsCollection.find({}).toArray();
      res.send(result);
    });

    //10. ========
    app.get("/sides", async (req, res) => {
      const result = await sidesBeveragesCollection.find({}).toArray();
      res.send(result);
    });

    //Payment

    app.post("/create-payment-intent", async (req, res) => {
      const service = req.body;
      const price = service.price;

      const amount = price * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });
  } finally {
  }
}
run().catch(console.dir);
app.get("/", async (req, res) => {
  res.send("Hello This is my new Ecomerce website");
});
app.listen(port, () => {
  console.log("Example Port Check", port);
});

module.exports = app;
