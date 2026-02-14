const express = require('express')   // this is the main framework we are using to create our server and handle routes
const app = express()  // this is the instance of express that we will use to create our server and handle routes
const ejs = require('ejs')   // this is the template engine we are using to render our views (html files) and pass data to them
const mongoose = require('mongoose')  // this is the library we are using to connect to our MongoDB database and define our data models (schemas) and perform CRUD operations on them
app.set('view engine', 'ejs') // this is the line of code that tells our express app to use ejs as the template engine to render our views (html files) and pass data to them. This means that when we call res.render('index'), it will look for a file named index.ejs in the views folder and render it with the data we pass to it.
const dotenv = require('dotenv') // this is the library we are using to load environment variables from a .env file into process.env. This allows us to keep sensitive information like database connection strings and API keys out of our code and instead store them in a separate file that is not committed to version control.
dotenv.config()  // this is the line of code that tells dotenv to load the environment variables from the .env file into process.env. This should be called before we try to access any environment variables in our code, otherwise they will be undefined.
app.use(express.urlencoded({extended:true}))   // this is the line of code that tells our express app to use the built-in middleware function express.urlencoded() to parse incoming request bodies in a middleware before your handlers, available under the req.body property. The extended option allows you to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true). The qs library allows for rich objects and arrays to be encoded into the URL-encoded format, allowing for a JSON-like experience with URL-encoded. When extended is false, you can not post nested objects, but when it is true, you can post nested objects.
app.use(express.json())   // this is the line of code that tells our express app to use the built-in middleware function express.json() to parse incoming request bodies in a middleware before your handlers, available under the req.body property. This is used to parse JSON data sent in the request body, which is common when making API requests.
const userRouter = require ('./routers/user.route')   // this is the line of code that imports the userRouter from the user.route.js file in the routers folder. This router contains all the routes related to user operations (create, edit, delete, get) and we will use it to handle those routes in our main app.
app.use('/api/v1', userRouter)  // this is the line of code that tells our express app to use the userRouter for any routes that start with /api/v1. This means that if we have a route defined in userRouter as router.post('/register', createUser), it will be accessible at /api/v1/register in our main app. This is a way to organize our routes and keep them modular by separating them into different files and using them in our main app with a specific prefix.


mongoose.connect(process.env.DATABASE_URI)
.then(()=>{
console.log('Database connected succesfully');
})
.catch((err)=>{
    console.log("Error connecting to database", err);
})  

// app.get(Path, callback)
// request - req
// response - res

// for every req send a res
// you can not send 2 res toghther
// 





const products = [
    {
        prodName: "Charger",
        prodPrice: 20,
        prodQuantity: 20,
        prodDescription: "balablu"


    },

    {
        prodName: "Power Bank",
        prodPrice: 35,
        prodQuantity: '',
        prodDescription: "Portable power bank for charging devices on the go.",

    },

    {
        prodName: "Headphones",
        prodPrice: 40,
        prodQuantity: '',
        prodDescription: "Over-ear headphones delivering clear sound quality."

    },

    {
        prodName: "Phone Stand",
        prodPrice: 10,
        prodQuantity: '',
        prodDescription: "Adjustable phone stand for hands-free viewing."
    },


    {
        prodName: "Bluetooth Speaker",
        prodPrice: 45,
        prodQuantity: 20,
        prodDescription: "Compact Bluetooth speaker with rich audio output."
    },

    {
        prodName: "HDMI Cable",
        prodPrice: 12,
        prodQuantity: '',
        prodDescription: "High-speed HDMI cable for audio and video transmission."
    },

    {
        prodName: "Laptop Sleeve",
        prodPrice: 22,
        prodQuantity: '',
        prodDescription: "Protective laptop sleeve with padded interior."
    },

    {
        prodName: "Keyboard",
        prodPrice: 25,
        prodQuantity: '',
        prodDescription: "Comfortable keyboard designed for everyday typing tasks."

    },



]

app.get('/', (req, res) => {        // creating a path for home page
    res.redirect('/index');
});

app.get('/index', (req, res)=>{      // creating a path for index.ejs
    res.render('index', {products}) // rendering index.ejs and passing products array to it
})


app.get('/addProduct', (req, res)=>{        // a new path for addproduct.ejs
  res.render("addProduct") 
})




app.post("/addProduct", (req, res)=>{               // post method to collect data from addproduct.ejs
    console.log(req.body)
    const{prodName, prodPrice, prodQuantity, prodDescription} = req.body     //destructuring the req body to collect data

    products.push(req.body)         //pushing the collected data into products array
    res.render("index", {products})  //rendering the index.ejs with the new products array
})



app.post("/deleteProd/:id", (req, res)=>{  // post method to delete a product using its id
    const { id } = req.params;  //collecting the id from params
    products.splice(id, 1);     //using splice method to remove the product from products array
    res.redirect('/index');  //redirecting to index to see the updated products array
}); 

app.get("/editProd/:id", (req, res)=>{  // get method to edit a product using its id
    const { id } = req.params;              //  collecting the id from params
    const product = products[id];     // getting the specific product from products array using the id
    res.render("editProduct", { product, id });   // rendering editProduct.ejs with the specific product and its id
});

app.post("/editProd/:id", (req, res)=>{
  const {id}= req.params      //collect the id for index.ejs and pass the params here
  const{prodName, prodPrice, prodQuantity, prodDescription} = req.body //since we are editing, we need a req body for want we want to change/replace
  products.splice(id, 1, req.body)   //the normal array method to remove and replace
  res.render("index", {products})    //after editing, we now display the new products
})



// app.get('/addProduct' (req, res)=>{
//     res.render()
// })








// app.listen(prompt, callback )

app.listen(process.env.PORT, (err) => {   // this is the line of code that starts the server and listens for incoming requests on the specified port. The port number is taken from the environment variable PORT, which should be defined in the .env file. The callback function is executed when the server starts successfully or if there is an error starting the server. If there is an error, it will log "error starting server" to the console, otherwise it will log "server started successfully".
    if (err) {
        console.log('error starting server');
    }   
    else {
        console.log('server started successfully');

    }

})