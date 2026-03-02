const mongoose = require('mongoose')
const cors = require('cors')
const express = require('express')
const multer = require('multer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const key = "$@*#5gf*yre@gutcf&@*#$234ju6"
const dotenv = require("dotenv");
dotenv.config();

const app = express()


const corsfront={
    origin:"https://elcto-vpkv.vercel.app",
    credentials:true
}

app.use(express.json())
app.use(cors(corsfront))

app.listen(9000, () => {
    console.log("Server is running on 9000")
   
})


mongoose.connect(process.env.Mongo_url)
    .then(() => console.log("connected"))
    .catch(() => console.log("not connected"))

const Register = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Email: String,
    Password: String,
    UserType: String,
    Status: String
})

const user = mongoose.model("users", Register)
const passwor = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])(?=.{8,}).*$/;
const emailregex = /^\S+@\S+\.\S+$/;

app.post("/api/register", async (req, res) => {
    const verify = req.body.email
    const exist = await user.findOne({
        Email: verify,
    })

    if (!passwor.test(req.body.pass)) {
        res.send({ statuscode: 3, message: "🚨 Password must contain Uppercase, Lowercase, Number & Special character" })
    }
   
    if (exist) {
        res.send({ statuscode: 2, message: "Email is Already Used" })
    }
    else {
        const hash = bcrypt.hashSync(req.body.pass, 10)
        const result = new user({
            FirstName: req.body.fname,
            LastName: req.body.lname,
            Email: req.body.email,
            Password: hash,
            UserType: "User",
            Status: "Active"
        })
        const response = await result.save()
        if (response) {
            res.send({ statuscode: 1 })
        }
        else {
            res.send({ statuscode: 0 })
        }
    }
})

// Login api

app.post("/api/login", async (req, res) => {
    const result = await user.findOne({ Email: req.body.email})
    const respass = result.Password
    const passw = bcrypt.compareSync(req.body.pass, respass)
    if (passw === true && result.Status === "Active") {
        let token = jwt.sign({ id: result._id, usertype: result.UserType, mail: result.Email }, key, { expiresIn: "1h" })
        res.send({ statuscode: 1, data: result, jwtoken: token })
    }
    else {
        res.send({ statuscode: 0 })
    }
})
//admin data
app.get("/api/users", async (req, res) => {
    const result = await user.find()
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//make admin
app.put("/api/makeadmin/:id", async (req, res) => {
    const result = await user.updateOne({ _id: req.params.id }, {
        $set: {
            UserType: req.body.ad
        }
    })
    if (result.modifiedCount === 1) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})
app.put("/api/changestatus/:id", async (req, res) => {
    const result = await user.updateOne({ _id: req.params.id }, {
        $set: {
            Status: req.body.status
        }
    })
    if (result.modifiedCount === 1) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

// category api

var pic;

const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads")
    },
    filename: (req, file, cb) => {
        pic = Date.now() + "-" + file.originalname
        cb(null, pic)
    }
})
const Category = new mongoose.Schema({
    Name: String,
    Img: String
})
const upload = multer({ storage: myStorage })
const Cate = mongoose.model("category", Category)

app.post("/api/category", upload.single("pic"), async (req, res) => {
    const result = new Cate({
        Name: req.body.name,
        Img: pic
    })
    if (result) {
        const resp = await result.save()
        if (resp) {
            res.send({ statuscode: 1 })
        }
        else {
            res.send({ statuscode: 0 })
        }
    }
})

app.get("/api/getcategory", async (req, res) => {
    const result = await Cate.find()
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//brand api

const brand = new mongoose.Schema({
    BrandName: String,
    Category: String,
    Img: String
})

const br = mongoose.model("Brands", brand)

app.post("/api/brand", upload.single("pic"), async (req, res) => {
    const result = new br({
        BrandName: req.body.brandname,
        Category: req.body.category,
        Img: pic
    })
    if (result) {
        const resp = await result.save()
        if (resp) {
            res.send({ statuscode: 1 })
        }
        else {
            res.send({ statuscode: 0 })
        }
    }
})

app.get("/api/showbrand", async (req, res) => {
    const result = await br.find()
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/getbrand/:id", async (req, res) => {
    const result = await br.find({ Category: req.params.id })
    if (result) {

        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/getbrand2/:id", async (req, res) => {
    const result = await br.find({ Category: req.params.id })
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

// product api 

const product = new mongoose.Schema({
    Category: String,
    ProductName: String,
    ProductPrice: Number,
    ProductDetail: String,
    OnSale: String,
    SalePrice: String,
    Date: String,
    Img: String,
    Brand: String,
    Specifications: String
})

const pro = mongoose.model("Product", product)

app.post("/api/product", upload.single("pic"), async (req, res) => {
    const result = new pro({
        Category: req.body.productt,
        ProductName: req.body.name,
        ProductPrice: req.body.price,
        ProductDetail: req.body.detail,
        OnSale: req.body.sale,
        Date: new Date(),
        SalePrice: req.body.saleprice,
        Brand: req.body.brand,
        Specifications: req.body.Specifications,

        Img: pic
    })

    if (result) {
        const resp = await result.save()
        if (resp) {
            res.send({ statuscode: 1 })
        }
        else {
            res.send({ statuscode: 0 })
        }
    }

})

app.get("/api/laptop", async (req, res) => {
    const result = await pro.find({ Category: '6970dd60300a757a6dcdb92e' }).limit(8)
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/mobiles", async (req, res) => {
    const result = await pro.find({ Category: "6970dd2d300a757a6dcdb92a" }).limit(8)
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/leds", async (req, res) => {
    const result = await pro.find({ Category: "6970dd16300a757a6dcdb928" })
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/airpods", async (req, res) => {
    const result = await pro.find({ Category: "69849f299a77c6ecd3c2839b" })
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/getproduct", async (req, res) => {
    const result = await pro.find()
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.delete("/api/deletepro/:id", async (req, res) => {
    const result = await pro.deleteOne({ _id: req.params.id })
    if (result.deletedCount === 1) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.put("/api/updatepro/:id", upload.single("pic"), async (req, res) => {
    const result = await pro.updateOne({ _id: req.params.id }, {
        $set: {
            Category: req.body.productt,
            ProductName: req.body.name,
            ProductPrice: req.body.price,
            ProductDetail: req.body.detail,
            OnSale: req.body.sale,
            Date: new Date(),
            SalePrice: req.body.saleprice,
            Brand: req.body.brand,
            Specifications: req.body.specifications,
            Img: pic
        }
    })
    if (result.modifiedCount === 1) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/related/:id", async (req, res) => {
    const result = await pro.find({ Category: req.params.id })
    if (result) {

        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/relatedtwo/:id", async (req, res) => {
    const result = await pro.aggregate(
        [
            {
                $match: { Category: req.params.id }
            },
            {
                $sample: { size: 4 }
            }
        ]
    )
    if (result) {

        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/brand/:id", async (req, res) => {
    const result = await pro.find({ Brand: req.params.id })
    if (result) {
        console.log(result)
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})
app.get("/api/saleproduct", async (req, res) => {
    const result = await pro.find({ OnSale: true }).limit(4)
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})
app.get("/api/latestproduct", async (req, res) => {
    const result = await pro.find().sort({ _id: -1 }).limit(4)


    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/detail/:id", async (req, res) => {
    const result = await pro.findOne({ _id: req.params.id })
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//contact schema,model

const Contact = new mongoose.Schema({
    Name: String,
    Email: String,
    Mobile: Number,
    Type: String,
    Msg: String
})

const response = mongoose.model("Contact", Contact)

app.post("/api/response", async (req, res) => {
    const result = new response({
        Name: req.body.name,
        Email: req.body.mail,
        Mobile: req.body.phn,
        Type: req.body.type,
        Msg: req.body.msg
    })
    if (result) {
        const response = await result.save()
        if (response) {
            res.send({ statuscode: 1 })
        }
        else {
            res.send({ statuscode: 0 })
        }
    }
})

//cart schema ,model
const Cart = new mongoose.Schema({
    ProductId: String,
    Name: String,
    Price: String,
    Img: String,
    Quantity: Number,
    User: String
})

const cartmodel = mongoose.model("Cart", Cart)

app.post("/api/cartdata/:proid", async (req, res) => {
    const proid = req.params.proid
    const exist = await cartmodel.findOne({
        ProductId: proid,
        User: req.body.id
    })
    if (exist) {
        res.send({ statuscode: 2, message: "Already in Cart" })
    }
    else {
        const result = new cartmodel({
            ProductId: proid,
            Name: req.body.name,
            Price: req.body.price,
            Img: req.body.img,
            Quantity: req.body.value,
            User: req.body.id
        })
        if (result) {
            const resp = await result.save()
            if (resp) {
                res.send({ statuscode: 1 })
            }
            else {
                req.send({ statuscode: 0 })
            }
        }
    }
})

app.get("/api/getcartdata/:id", async (req, res) => {
    const result = await cartmodel.find({ User: req.params.id })
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ staruscode: 0 })
    }
})

app.delete("/api/remove/:id", async (req, res) => {
    const result = await cartmodel.deleteOne({ _id: req.params.id })
    if (result.deletedCount === 1) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.delete("/api/removecartdata/:id", async (req, res) => {
    const result = await cartmodel.deleteMany({ User: req.params.id })
    if (result.deletedCount > 0) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//review api,schema
const Review = new mongoose.Schema({
    Name: String,
    User: String,
    Msg: String,
    Rating: Number,
    Date: String,
    Product: String
})

const review = mongoose.model("Reviews", Review)

app.post("/api/reviews", async (req, res) => {
    const result = new review({
        Name: req.body.username,
        User: req.body.mail,
        Msg: req.body.msg,
        Rating: req.body.rating,
        Date: new Date(),
        Product: req.body.prr
    })
    const response = await result.save()
    if (response) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/getreview/:id", async (req, res) => {
    const result = await review.find({ Product: req.params.id }).sort({ _id: -1 }).limit(1)
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//wishlist api ,schema

const wish = new mongoose.Schema({
    Productid: String,
    Name: String,
    Img: String,
    Price: Number,
    Date: String,
    UserId: String

})

const wlist = mongoose.model("Wishlist", wish)

app.post("/api/wishpost/:proid", async (req, res) => {
    const proid = req.params.proid
    const exists = await wlist.findOne({
        Productid: proid,
        UserId: req.body.id
    })
    if (exists) {
        res.send({ statuscode: 2, message: "Already in Wishlist" })
    }
    else {
        const result = new wlist({
            Productid: proid,
            Name: req.body.name,
            Img: req.body.img,
            Price: req.body.price,
            Date: new Date(),
            UserId: req.body.id
        })

        const savee = await result.save()
        if (savee) {
            res.send({ statuscode: 1 })
        }
        else {
            res.send({ statuscode: 0 })
        }
    }
})



app.get("/api/getwish/:id", async (req, res) => {
    const result = await wlist.find({ UserId: req.params.id })
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.delete("/api/deletewish/:id", async (req, res) => {
    const result = await wlist.deleteOne({ _id: req.params.id })
    if (result.deletedCount === 1) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})



// checkout api,schema

const Check = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Phone: String,
    Email: String,
    Country: String,
    State: String,
    City: String,
    Address: String,
    PostalCode: String,
    Date: String,
    UserId: String,
    Payment: String,
    OrderNo: String,
    Total: Number,
    Order: [{ ProductName: String, Quantity: Number, Price: Number, Img: String }]
})

const cout = mongoose.model("Checkout", Check)

app.post("/api/checkout", async (req, res) => {
    const result = new cout({
        FirstName: req.body.fname,
        LastName: req.body.lname,
        Phone: req.body.phn,
        Email: req.body.email,
        Country: req.body.country,
        State: req.body.state,
        City: req.body.city,
        Address: req.body.address,
        PostalCode: req.body.postal,
        Date: new Date(),
        UserId: req.body.id,
        Payment: req.body.payment,
        Total: req.body.totalprice,
        Order: req.body.data,
        OrderNo: req.body.orderno
    })
    const resp = await result.save()
    if (resp) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/orderdata", async (req, res) => {
    const result = await cout.find()
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/myorder/:id", async (req, res) => {
    const result = await cout.find({ UserId: req.params.id })
    if (result) {
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/sales/monthly", async (req, res) => {

    const orders = await cout.find();

    const monthly = {
        Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
        Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
    };

    orders.forEach(order => {

        if (!Array.isArray(order.Order)) return;

        const date = new Date(order.Date);
        const monthIndex = date.getMonth();
        const months = Object.keys(monthly);

        let orderTotal = 0;

        order.Order.forEach(item => {
            orderTotal += (Number(item.Quantity) || 0) * (Number(item.Price) || 0);
        });

        monthly[months[monthIndex]] += orderTotal;
    });

    res.send({
        statuscode: 1,
        labels: Object.keys(monthly),
        values: Object.values(monthly)
    });
});

