const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;



const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'nodelogin',
  password: 'Welcome17',
  port: 5432,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
let intialPath = path.join(__dirname, "public");
app.use(express.static(intialPath));

app.use(session({
  secret: 'yes' ,
  resave: false,
  saveUninitialized: false,
  cookie: {secure:false}
}))


 let welcomesent = false;

app.get('/', (req, res)=>{
    res.sendFile(path.join(intialPath, "ht.html"))
    if(req.session.userId && !welcomesent){
      console.log('succesfull login')
      welcomesent = true;
    }
})

app.get('/searchresult', (req, res)=>{
  res.sendFile(path.join(intialPath, "serachresult.html"))
})

app.get('/log', (req, res)=>{
    res.sendFile(path.join(intialPath, "Loginpage.html"))
})

app.get('/reg', (req, res)=>{
    res.sendFile(path.join(intialPath, "register.html"))
})

app.get('/add', (req, res)=>{
  if (!req.session.userId){
    res.redirect('/log');
  } else{
    res.sendFile(path.join(intialPath, "add.html")); 
  }

})

app.get('/wishlist', (req,res) =>{
  if (!req.session.userId){
    res.redirect('/log');
  } else{
    res.sendFile(path.join(intialPath, "wishlist.html"));
  }
})

app.get('/basket', (req,res)=>{
  if(!req.session.userId){
    res.redirect('/log')
  } else{
    res.sendFile(path.join(intialPath, "basket.html"))
  }
})

app.get('/dc', async (req, res)=>{
  res.sendFile(path.join(intialPath, "DC.html"))
})


app.post('/search', async (req, res) => {
  const { search } = req.body;

  try {
    res.redirect(`searchresult?q=${encodeURIComponent(search)}`);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send('Search error');
  }
});

app.get('/productsearch/:search', async (req, res) => {
  const { search } = req.params;
  console.log(search);

try{
  const query = `SELECT * FROM product WHERE product_name ILIKE '%${search}%'`;
  const result = await pool.query(query);
  console.log(result.rows)

  if (result.rowCount > 0) {
    res.status(200).json({ message: 'Items found', products: result.rows });
  } else {
    res.status(404).send('No products found');
  }
} catch (error) {
  console.error('Error', error);
  res.status(500).send('Server error');
}
});

app.post('/reg', async (req, res) => {
  const { input, names, password } = req.body;
  console.log(
    input,
    names,
    password
  );

  try {
    const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    const { rowCount: userExists } = await pool.query(checkUserQuery, [input]);

    if (userExists) {
      return res.status(400).json({ error: 'email taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery = 'INSERT INTO users (name, email, password) VALUES ($1, $2,$3) RETURNING *';
    const { rows } = await pool.query(insertUserQuery, [names,input ,hashedPassword]);

    res.status(200).json({ message: 'User registered successfully', alert: 'User registered successfully' });
    res.redirect('/log')
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/log', async (req, res) => {
  const { input, password } = req.body;
  console.log(
    input,
    password
  );

  try {
    const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    const { rows, rowCount } = await pool.query(checkUserQuery, [input]);

    if (!rowCount) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const match = await bcrypt.compare(password, rows[0].password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    req.session.loggedIn = true;
    req.session.userId = rows[0].id;
    req.session.username = rows[0].name;

    res.redirect('/')

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const cors = require('cors');
// const { get } = require('http');
// const { error } = require('console');

 app.use(
   cors({
     origin: "*",
   })
 )



const apikey = "e66e16b1ecd0e5f943197cede949f2af516a02c4";
// //const URL = "https://comicvine.gamespot.com/api/";
//const url = `https://comicvine.gamespot.com/api/characters/?api_key=${apikey}&format=json`;
const url2 = `https://comicvine.gamespot.com/api/issues/?api_key=${apikey}&format=json`;
const url3 = `https://comicvine.gamespot.com/api/issues/?api_key=${apikey}&filter=name:hawkeye&format=json`;

app.get("/data", async (req, res)=>{
  try{
  const response = await fetch(url3);
  const data = await response.json();
  res.json(data.results);
} catch(error) {
  console.log('error',error);
  res.status(500).json({error: 'int'});
}
});

app.post('/add', async (req, res) => {
  const { cname, price, description,pub,condition,image  } = req.body;
  console.log(
    req.session.userId,
    cname,
    price,
    pub,
    condition,
    description,
    image
  );

  try {
    const insertpostQuery = 'INSERT INTO product (id,product_name, price, listing_des,pub,condition,imageurl) VALUES ($1, $2,$3,$4,$5,$6,$7) RETURNING *';
    const { rows } = await pool.query(insertpostQuery, [req.session.userId,cname,price , description, pub,condition,image]);

    res.status(201).json({ message: 'User post successfully', product: rows[0] });
  } catch (error) {
    console.error('Error during post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/dc-data', async (req, res) => {
  try {
      let dcquery = "SELECT * FROM product WHERE pub = 'DC Comics'";
      const price = parseFloat(req.query.price);
      console.log(price);
      if (!isNaN(price)) {
          dcquery += ` AND price <= ${price}`;
      }
      const { rows } = await pool.query(dcquery);
      res.json(rows);
  } catch (error) {
      console.error('error', error);
      res.status(500).json({ message: error.message });
  }
});

  app.delete('/removeproduct/:productId', async (req, res) => {
    const userId = req.session.userId;
    const { productId } = req.body;
  
    try {
      const result = await pool.query('DELETE FROM cart WHERE id = $1 AND product_id = $2', [userId, productId]);
  
      if (result.rowCount === 1) {
        res.status(200).json({ message: 'Item removed', alert: 'Product removed' });
      } else {
        res.status(404).json({ message: 'Item not found', alert: 'Product does not exist' });
      }
    } catch (err) {
      console.error('Error', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

app.get('/productData', async (req, res) => {
  const productId = req.query.id;
  console.log(productId);
  try {
    const result = await pool.query('SELECT * FROM product WHERE product_id = $1', [productId]);
    console.log(result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/addpro/:productId', async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User not logged in', alert: 'Product not added please log in', redirect: '/log' });
    }

    const check = await pool.query('SELECT * FROM cart WHERE product_id = $1 AND id = $2', [productId, userId]);

    if (check.rows.length > 0) {
      return res.status(400).json({ message: 'Product already in cart', alert: 'product is already added to cart'});
    }

    const query = 'INSERT INTO cart (product_id, id) VALUES ($1, $2)';
    await pool.query(query, [productId, userId]);

    res.status(200).json({ message: 'Added to the cart', alert: 'product is added to the cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/addwish', async (req, res) =>{
  try{
    const { productId } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User not logged in', alert: 'Product not added please log in', redirect: '/log' });
    }

    const check = await pool.query('SELECT * FROM wishlist WHERE product_id = $1 AND id = $2', [productId, userId]);

    if (check.rows.length > 0) {
      return res.status(400).json({ message: 'Product already in wishlist', alert: 'product is already added to wishlist'});
    }

    const query = 'INSERT INTO wishlist (product_id, id) VALUES ($1, $2)';
    await pool.query(query, [productId, userId]);

    res.status(200).json({ message: 'Added to the wishlist', alert: 'product is added to the wishlist' });
  } catch(err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.get('/getprobasket', async (req,res) => {
  const userId = req.session.userId;
  console.log(userId);
  console.log('hello')
  try{

    const result = await pool.query('select * from users join cart on users.id = cart.id join product on product.product_id = cart.product_id where cart.id = $1;', [userId]);
    console.log(result.rows)
    res.json(result.rows)
  }catch(err){
    console.error(err);
    res.status(500).json({message: 'oooffff'})
  }
})

app.get('/getwish', async (req,res)=>{
  const userId = req.session.userId;
  console.log(userId);

  try{
    const result = await pool.query('select * from wishlist join users on users.id = wishlist.id join product on product.product_id = wishlist.product_id where wishlist.id = $1;', [userId]);
    console.log(result.rows)
    res.json(result.rows)
  }catch(err){
    console.error(err);
    res.status(500).json({message: 'error'})
  }
})


app.delete('/removeprod/:productId', async (req,res) => {
  const userId = req.session.userId;
  const {productId} = req.body;

  try {
    const result = await pool.query('DELETE FROM wishlist WHERE id = $1 AND product_id = $2', [userId, productId]);

    if (result.rowCount === 1) {
      res.status(200).json({ message: 'Item removed', alert: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Item not found', alert: 'Product does not exist' });
    }
  } catch (err) {
    console.error('Error', err);
    res.status(500).json({ message: 'Server error' });
  }  
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
