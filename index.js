require( 'dotenv' ).config();
const express = require( 'express' );
const app = express();
const port = process.env.PORT || 5001;
const cors = require( 'cors' );
const ObjectId = require( 'mongodb' ).ObjectId;

//middleware for CORS (Cross Origin Resource Sharing) and JSON conversion
app.use( cors() );
app.use( express.json() );

//Create the database client instance
const { MongoClient } = require( 'mongodb' );

//define database url with user credentials
const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@cluster0.iezc6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

//create the database client from the client instance with its user credentials
const client = new MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology: true } );

//declare the run function to implement the database connection and CRUD operations
const run = async () => {
    try {
        //connect to the client to the database
        await client.connect();
        console.log( 'Connected to MongoDB' );

        //store the database to a variable
        const database = client.db( "algogendb" );

        //store the database collections of notes and tags in separate variables
        const notesCollection = database.collection( "notes" );
        const tagsCollection = database.collection( "tags" );

        //GET Notes API (Send all notes information to the client)
        app.get( '/notes', async ( req, res ) => {
            const cursor = notesCollection.find( {} );
            const notes = await cursor.toArray();
            res.send( notes );
        } );

        //GET Tags API (Send all tags information to the client)
        app.get( '/tags', async ( req, res ) => {
            const cursor = tagsCollection.find( {} );
            const tags = await cursor.toArray();
            res.send( tags );
        } );

        //POST API (Add a Note)
        app.post( '/notes', async ( req, res ) => {
            const note = req.body;
            const result = await notesCollection.insertOne( note );
            res.json( result );
        } );

        //POST API (Add a Tag)
        app.post( '/tags', async ( req, res ) => {
            const tag = req.body;
            const result = await tagsCollection.insertOne( tag );
            res.json( result );
        } );

        //DELETE API (Delete a Note)
        app.delete( '/notes/:id', async ( req, res ) => {
            const id = req.params.id;
            const filter = { _id: ObjectId( id ) };
            const result = await notesCollection.deleteOne( filter );
            res.json( result );
        } );

        //DELETE API (Delete a Tag)
        app.delete( '/tags/:id', async ( req, res ) => {
            const id = req.params.id;
            const filter = { _id: ObjectId( id ) };
            const result = await tagsCollection.deleteOne( filter );
            res.json( result );
        } );

        //UPDATE API (Update a Note)
        app.put( '/notes/:id', async ( req, res ) => {
            const noteId = req.params.id;
            const updatedNote = req.body;
            const filter = { _id: ObjectId( noteId ) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    noteTitle: updatedNote.noteTitle,
                    noteData: updatedNote.noteData,
                    noteTag: updatedNote.noteTag
                },
            };
            const result = await notesCollection.updateOne( filter, updateDoc, options );
            res.json( result );
        } );
    }
    catch ( err ) {
        console.error( err );
    }
    finally {
        //close the database connection
        // await client.close();
    }
};

//invoke the function run() and catch the error if any
run().catch( console.dir );

app.get( '/', ( req, res ) => {
    res.send( 'Hello World! Algorithm Generation ToDo App Server is running successfully' );
} )

app.listen( port, () => {
    console.log( `AlgoGen ToDo App Server App listening at https://enigmatic-coast-44636.herokuapp.com/:${ port }` );
} )