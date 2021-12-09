require( 'dotenv' ).config();
const express = require( 'express' );
const app = express();
const port = process.env.PORT || 5001;
const cors = require( 'cors' );


//middleware
app.use( cors() );
app.use( express.json() );

//Create the database client instance
const { MongoClient } = require( 'mongodb' );

//connect to the database with user credentials
const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@cluster0.iezc6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

//create the database client from the client instance
const client = new MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology: true } );

const run = async () => {
    try {
        await client.connect();
        console.log( 'Connected to MongoDB' );

        //connect to  the database
        const database = client.db( "algogendb" );

        //Connect to the database collections of notes and tags
        const notesCollection = database.collection( "notes" );
        const tagsCollection = database.collection( "tags" );

        //GET Notes API (Send all notes information to the client)
        app.get( '/notes', async ( req, res ) => {
            const cursor = notesCollection.find( {} );
            const notes = await cursor.toArray();
            res.send( notes );
        } );

        //GET Tags API (Send all notes information to the client)
        app.get( '/tags', async ( req, res ) => {
            const cursor = tagsCollection.find( {} );
            const tags = await cursor.toArray();
            res.send( tags );
        } );
    }
    catch ( err ) {
        console.error( err );
    }
    finally {
        // await client.close();
    }
};

run().catch( console.dir );

app.get( '/', ( req, res ) => {
    res.send( 'Hello World! Algorithm Generation ToDo App Server is running successfully' );
} )

app.listen( port, () => {
    console.log( `AlgoGen ToDo App Server App listening at http://localhost:${ port }` );
} )