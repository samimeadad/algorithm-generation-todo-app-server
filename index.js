require( 'dotenv' ).config();
const express = require( 'express' );
const app = express();
const port = process.env.PORT || 5001;
const cors = require( 'cors' );
const ObjectId = require( 'mongodb' ).ObjectId;


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

        //POST API (Add a Note)
        app.post( '/notes', async ( req, res ) => {
            const note = req.body;
            console.log( note );
            const result = await notesCollection.insertOne( note );
            res.json( result );
        } );

        //POST API (Add a Tag)
        app.post( '/tags', async ( req, res ) => {
            const tag = req.body;
            console.log( tag );
            const result = await tagsCollection.insertOne( tag );
            res.json( result );
        } );

        //DELETE API (Delete a Note)
        app.delete( '/notes/:id', async ( req, res ) => {
            const id = req.params.id;
            const query = { _id: ObjectId( id ) };
            const result = await notesCollection.deleteOne( query );
            res.json( result );
        } );

        //DELETE API (Delete a Tag)
        app.delete( '/tags/:id', async ( req, res ) => {
            const id = req.params.id;
            const query = { _id: ObjectId( id ) };
            const result = await tagsCollection.deleteOne( query );
            res.json( result );
        } );

        //UPDATE API (Update a Note)
        app.put( '/notes/:id', async ( req, res ) => {
            const noteId = req.params.id;
            const updatedNote = req.body;
            console.log( updatedNote );
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