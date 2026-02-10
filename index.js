const express = require('express') 
const app = express() 
const ejs = require('ejs') 
const mongoose = require('mongoose')
app.set('view engine', 'ejs')
const dotenv = require('dotenv')
dotenv.config()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const userRouter = require ('./routers/user.route')
app.use('/api/v1', userRouter)


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

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log('error starting server');
    }   
    else {
        console.log('server started successfully');

    }

})