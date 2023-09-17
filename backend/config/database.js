const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoURI = process.env.MONGODB_URI;
const uri = `mongodb+srv://nguyendong:${mongoURI}@cluster0.hr9qn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function connectDB() {
	try {
		console.log('Database Connecting....');
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();
		// Send a ping to confirm a successful connection
		await client.db('iphone').command({ ping: 1 });
		console.log(
			'Pinged your deployment. You successfully connected to MongoDB!'
		);
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}

module.exports = connectDB;
