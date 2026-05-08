const mongoose = require('mongoose')
const cors = require('cors')
const express = require('express')
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const key = "$@*#5gf*yre@gutcf&@*#$234ju6"
const dotenv = require("dotenv");
const nodemailer = require('nodemailer');
dotenv.config();


const app = express()


const corsfront={
    origin:["https://elcto-a5a8.onrender.com","https://elcto-self.vercel.app"],
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
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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
// forgot password api

// simple in-memory OTP store: { [email]: { code: number, expiresAt: Date } }
let otpstore = {};
let resetTokenStore = {};
const OTP_TTL_SECONDS = parseInt(process.env.OTP_TTL_SECONDS) || 600; // default 10 minutes
const RESET_TOKEN_TTL_SECONDS = parseInt(process.env.RESET_TOKEN_TTL_SECONDS) || 600;

// helper: send email via MailerSend API if MAILERSEND_API_KEY is present,
// otherwise fall back to SMTP using nodemailer and SMTP credentials (MAILERSEND_SMTP_USER / MAILERSEND_SMTP_PASS)
async function sendMailerSendEmail(toEmail, subject, html, text) {
    const apiKey = process.env.MAILERSEND_API_KEY;
    if (apiKey) {
        // Use MailerSend HTTP API
        const payload = {
            from: {
                email: process.env.MAIL_FROM_EMAIL || 'no-reply@example.com',
                name: process.env.MAIL_FROM_NAME || 'Electo'
            },
            to: [{ email: toEmail }],
            subject: subject,
            html: html,
            text: text || ''
        };

        // Use global fetch (Node 18+). If not available this will throw and fall back to SMTP below.
        if (typeof fetch === 'function') {
            const resp = await fetch('https://api.mailersend.com/v1/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(payload)
            });
            const responseText = await resp.text();
            let data = {};
            if (responseText) {
                try {
                    data = JSON.parse(responseText);
                } catch {
                    data = { message: responseText };
                }
            }
            if (!resp.ok) throw new Error(JSON.stringify(data));
            return data;
        } else {
            throw new Error('fetch is not available in this Node runtime; please configure SMTP fallback variables');
        }
    }

    // SMTP fallback using nodemailer (requires MAILERSEND_SMTP_USER and MAILERSEND_SMTP_PASS)
    if (process.env.MAILERSEND_SMTP_USER && process.env.MAILERSEND_SMTP_PASS) {
        const transporter = nodemailer.createTransport({
            host: process.env.MAILERSEND_SMTP_HOST || 'smtp.mailersend.net',
            port: Number(process.env.MAILERSEND_SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.MAILERSEND_SMTP_USER,
                pass: process.env.MAILERSEND_SMTP_PASS
            }
        });

        const info = await transporter.sendMail({
            from: `"${process.env.MAIL_FROM_NAME || 'Electo'}" <${process.env.MAIL_FROM_EMAIL || process.env.MAILERSEND_SMTP_USER}>`,
            to: toEmail,
            subject,
            html,
            text
        });
        return info;
    }

    throw new Error('No MailerSend credentials configured (MAILERSEND_API_KEY or MAILERSEND_SMTP_USER/PASS)');
}

app.post('/api/forgot', async (req, res) => {
    const email = (req.body.email || '').trim().toLowerCase();

    if (!email) {
        return res.send({ statuscode: 2, message: 'Email is Required' });
    }

    const account = await user.findOne({ Email: new RegExp(`^${escapeRegExp(email)}$`, 'i') });
    if (!account) {
        return res.send({ statuscode: 0, message: 'No account found with this email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    // store OTP per-email (do not overwrite whole store)
    otpstore[email] = { code: otp, expiresAt: Date.now() + OTP_TTL_SECONDS * 1000 };
    // schedule removal after TTL
    setTimeout(() => {
        if (otpstore[email] && otpstore[email].expiresAt <= Date.now()) {
            delete otpstore[email];
        }
    }, OTP_TTL_SECONDS * 1000 + 1000);

    const subject = 'You requested a password reset';
    const html = `<p>You requested a password reset.</p><p><a href="https://elcto-self.vercel.app/verify?email=${encodeURIComponent(email)}">Click here to reset your password</a></p><p>Your OTP is ${otp}</p>`;
    const text = `You requested a password reset. Your OTP is ${otp}. Visit https://elcto-self.vercel.app/verify?email=${encodeURIComponent(email)} to continue.`;

    try {
        const data = await sendMailerSendEmail(email, subject, html, text);
        console.log('Email sent:', data);
        res.send({ statuscode: 1, message: 'OTP Sent Successfully' });
    } catch (error) {
        console.error('Error sending forgot email:', error);
        res.send({ statuscode: 0, message: 'Error sending email' });
    }
});

app.post('/api/verify-otp', async (req, res) => {
    const email = (req.body.email || '').trim().toLowerCase();
    const { otp } = req.body;
    if (!email || !otp) {
        return res.send({ statuscode: 2, message: 'Email and OTP are required' });
    }

    const stored = otpstore[email];
    if (stored && stored.expiresAt <= Date.now()) {
        delete otpstore[email];
        return res.send({ statuscode: 0, message: 'OTP expired' });
    }

    if (stored && stored.code && stored.code.toString() === otp.toString()) {
        // OTP verified, remove it so it can't be reused
        delete otpstore[email];
        const resetToken = crypto.randomBytes(32).toString('hex');
        resetTokenStore[email] = {
            token: resetToken,
            expiresAt: Date.now() + RESET_TOKEN_TTL_SECONDS * 1000
        };
        setTimeout(() => {
            if (resetTokenStore[email] && resetTokenStore[email].expiresAt <= Date.now()) {
                delete resetTokenStore[email];
            }
        }, RESET_TOKEN_TTL_SECONDS * 1000 + 1000);
        res.send({ statuscode: 1, message: 'OTP Verified Successfully', resetToken });
    } else {
        res.send({ statuscode: 0, message: 'Invalid OTP' });
    }
});

app.put("/api/resetpassword/:mail",async(req,res)=>{
    const email = (req.params.mail || '').trim().toLowerCase();
    const { pass, cpass, resetToken } = req.body;

    if (!email || !pass || !cpass || !resetToken) {
        return res.send({ statuscode: 2, message: "Email, password, confirm password and reset token are required" });
    }

    if (pass !== cpass) {
        return res.send({ statuscode: 4, message: "Password and confirm password do not match" });
    }

    if (!passwor.test(pass)) {
        return res.send({ statuscode: 3, message: "🚨 Password must contain Uppercase, Lowercase, Number & Special character" });
    }

    const storedResetToken = resetTokenStore[email];
    if (!storedResetToken || storedResetToken.token !== resetToken || storedResetToken.expiresAt <= Date.now()) {
        delete resetTokenStore[email];
        return res.send({ statuscode: 0, message: "Reset session expired. Please request a new OTP." });
    }

    const hash=bcrypt.hashSync(pass,10)
    const result=await user.updateOne({Email:new RegExp(`^${escapeRegExp(email)}$`, 'i')},{
     $set:{
        Password:hash,
     }   
    })
  if(result.modifiedCount>0){
    delete resetTokenStore[email];
    res.send({statuscode:1, message: "Password updated successfully"})
  }
  else{
    res.send({statuscode:0, message: "Password was not updated"})
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



// configure cloudinary (use the cloudinary object directly)
cloudinary.config({
    cloud_name: process.env.Cloud_name,
    api_key: process.env.Api_key,
    api_secret: process.env.Secret_key
})

// category api

const myStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "electomart",
        allowed_formats: ["jpg", "png", "jpeg", "webp","avif"]
    }
})

const upload = multer({ storage: myStorage })
const Category = new mongoose.Schema({
    Name: String,
    Img: String
})

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

app.put("/api/updatepro/:id", async (req, res) => {
    // Run multer upload inside the route so we can catch upload errors (Cloudinary/multer)
    upload.single("pic")(req, res, async function (uploadErr) {
        if (uploadErr) {
            console.error('Upload error in /api/updatepro/:id', uploadErr);
            return res.status(500).send({ statuscode: 0, error: uploadErr.message });
        }

        try {
            // Build update object conditionally to avoid accessing req.file when undefined
            const updateFields = {
                Category: req.body.productt,
                ProductName: req.body.name,
                ProductPrice: req.body.price,
                ProductDetail: req.body.detail,
                OnSale: req.body.sale,
                Date: new Date(),
                SalePrice: req.body.saleprice,
                Brand: req.body.brand,
                Specifications: req.body.specifications || req.body.Specifications
            };

            // If a file was uploaded, set Img to the Cloudinary path; otherwise leave unchanged
            if (req.file && req.file.path) {
                updateFields.Img = req.file.path;
            }

            const result = await pro.updateOne({ _id: req.params.id }, { $set: updateFields });

            if (result.modifiedCount === 1) {
                res.send({ statuscode: 1 });
            } else {
                // If nothing was modified, still return informative response
                res.send({ statuscode: 0, message: 'No changes made' });
            }
        } catch (err) {
            console.error('Error in /api/updatepro/:id', err);
            res.status(500).send({ statuscode: 0, error: err.message });
        }
    });
});

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
        Img: req.file.path
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
        Img: req.file.path
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
            Img: req.file.path
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
        // multer-storage-cloudinary exposes the uploaded file info on req.file
        // use req.file.path (Cloudinary URL) when present
        Img: req.file ? req.file.path : "no-image.png"
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
            Img: req.body.img ,
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
    SalePrice: String,
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
            SalePrice: req.body.saleprice,
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

// Global error handler to catch any middleware errors not handled above
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(500).send({ statuscode: 0, error: err.message || 'Internal Server Error' });
});

const vendor=new mongoose.Schema({
    Name:String,
    Email:String,
    Phone:String,
    Password:String,
    Username:String,
    Bank:String,
    City:String,
    State:String,
    UserType:String,
    Status:String,
})

const vendordata=mongoose.model("Vendor", vendor)

app.post("/api/vendorregister",async(req,res)=>{
    const hashedPassword=await bcrypt.hash(req.body.pass,10)
    const result=new vendordata({
        Name:req.body.name,
        Email:req.body.email,
        Phone:req.body.phn,
        Password:hashedPassword,
        Username:req.body.uname,
        Bank:req.body.bank,
        City:req.body.city,
        State:req.body.state,
        UserType:"Vendor",
        Status:"Pending"
    })
    const resp=await result.save()
    if(resp){
        res.send({statuscode:1})
    }
    else{
        res.send({statuscode:0})
    }
})

app.get("/api/vendordata",async(req,res)=>{
    const result=await vendordata.find()
    if(result){
        console.log(result)
        res.send({statuscode:1,data:result})
    }
    else{
        res.send({statuscode:0})
    }
})

app.post("/api/vlog",async(req,res)=>{
    const result=await vendordata.findOne({Email:req.body.email})
    const respass2=result.Password
    const passw2=bcrypt.compareSync(req.body.pass,respass2)
    console.log("Entered Password:", req.body.pass)
console.log("DB Password:", result.Password)
console.log("Match:", passw2)
console.log("Status:", result.Status)
    if(result.Email===req.body.email && passw2===true && result.Status==="Accept"){
        let vtoken=jwt.sign({id:result._id,usertype:result.UserType,mail:result.Email},key,{expiresIn:"1h"})
        res.send({statuscode:1,data:result,token:vtoken})
    }
    else{
        res.send({statuscode:0})
    }
})

app.put("/api/approval/:id",async(req,res)=>{
    const result=vendordata.updateOne({_id:req.params.id},{
        $set:{
            Status:req.body.status,
        }
    })
  if((await result).modifiedCount==1){
    res.send({statuscode:1})
  }
  else{
    res.send({statuscode:0})
  }
})
 
