const express = require('express');
const { connectToDb, getDb } = require('./db')

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


// routes
app.get('/usuario', (req, res) => {
	let books = []
	db.collection('usuario')
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

// Listar usuarios
app.get('/users', (req, res) => {
	db.collection('usuario')
	.find()
	.toArray()
	.then(users => {
		res.status(200).json(users);
	})
	.catch(err => {
		res.status(500).json({ error: 'Could not fetch users' });
	});
});

// Registrar usuario
app.post('/users', (req, res) => {
	let user = req.body;
	db.collection('usuario')
	.insertOne(user)
	.then(result => {
		res.status(201).json(result);
	})
	.catch(err => {
		res.status(500).json({ error: 'Could not insert user' });
	});
});

