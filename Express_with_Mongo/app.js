const express = require('express');
const { connectToDb, getDb } = require('./db')
const {ObjectId} = require('mongodb');

// ini app & middleware
const app = express();
app.use(express.json())

// db connection
connectToDb((err)=> {
	if (!err){
		app.listen(3000 ,() => {
			console.log('app listening on port 3000')
		});
		db = getDb();
	}
})
	

//app.listen( 3000, () => {
//    console.log("App listening on port 3000")
//} );


// routes
app.get('/books', (req, res) => {
	let books = []
	db.collection('books')
		.find()
		.sort({author:1})
		.forEach( book => books.push(book) )
		.then( ()=> {
			res.status(200).json(books)
		})
		.catch( () => {
			res.status(500).json( {error:'could not fetch'})
		})

})

app.get('/books/:id', (req, res) => {

	if (ObjectId.isValid(req.params.id)) {

		db.collection('books')
			.findOne({_id:new ObjectId(req.params.id)})
			.then(doc => {
				res.status(200).json(doc)
			})
			.catch(err => {
				res.status(500).json( {error:'could not fetch'})
			})
		}
		else {
        res.status(500).json( {error:'invalid id'})
    }
})

app.post('/books', (req, res) => {
	let book = req.body;
	db.collection('books')
	.insertOne(book)
	.then( (result)=> {
        res.status(201).json(result)
    })
	.catch( err => {
        res.status(500).json( {error:'could not insert'})
    })
})

