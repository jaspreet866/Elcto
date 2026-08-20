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

const CORS_ORIGINS = [
    "https://elcto-a5a8.onrender.com",
    "https://elcto-self.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173"
];

const allowedOrigins = CORS_ORIGINS;
const allowedOriginPatterns = [
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/,
    /^https:\/\/[a-z0-9-]+\.onrender\.com$/
];

const isAllowedOrigin = (origin) => {
    if (!origin) {
        return true;
    }

    return allowedOrigins.includes(origin) || allowedOriginPatterns.some((pattern) => pattern.test(origin));
};

const corsfront = {
    origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
}

app.use(express.json())
app.use(cors(corsfront))

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)

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
const emailQuery = (email) => {
    const emailRegex = new RegExp(`^${escapeRegExp(email)}$`, 'i');
    return {
        $or: [
            { Email: emailRegex },
            { email: emailRegex }
        ]
    };
};

app.post("/api/register", async (req, res) => {
    const verify = (req.body.email || '').trim().toLowerCase();
    const exist = await user.findOne(emailQuery(verify))

    if (!passwor.test(req.body.pass)) {
        return res.send({ statuscode: 3, message: "🚨 Password must contain Uppercase, Lowercase, Number & Special character" })
    }

    if (exist) {
        return res.send({ statuscode: 2, message: "Email is Already Used" })
    }
    else {
        const hash = bcrypt.hashSync(req.body.pass, 10)
        const result = new user({
            FirstName: req.body.fname,
            LastName: req.body.lname,
            Email: verify,
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
    const email = (req.body.email || '').trim().toLowerCase();
    const result = await user.findOne(emailQuery(email))
    if (!result) {
        return res.send({ statuscode: 0, message: "Invalid email or password" })
    }
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
// Forgot password API
// This sends an OTP code to the user's email.
// It uses MailerSend SMTP credentials from environment variables.

const mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.mailersend.net",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
        user: process.env.MAILERSEND_SMTP_USER,
        pass: process.env.MAILERSEND_SMTP_PASS
    }
});

var otpStore = {};
const OTP_EXPIRY_MS = 10 * 60 * 1000;

const createOtp = () => crypto.randomInt(100000, 1000000).toString();

const saveOtpForEmail = (email, otp) => {
    otpStore[email] = {
        code: otp,
        expiresAt: Date.now() + OTP_EXPIRY_MS
    };
};

const createOtpEmail = (email, otp) => {
    const senderEmail = process.env.MAILERSEND_SMTP_USER || "noreply@elcto.com";

    return {
        from: senderEmail,
        to: email,
        subject: 'Your Elcto OTP Code',
        text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
        html: `<div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; background: #f8fafc; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0;">
            <h2 style="color: #1d4ed8; margin-top: 0;">Elcto Password Reset</h2>
            <p>You requested to reset your password. Use the verification OTP below to proceed:</p>
            <div style="background: #eff6ff; border: 1px dashed #3b82f6; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #1d4ed8;">${otp}</span>
            </div>
            <p style="font-size: 13px; color: #64748b;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        </div>`
    };
};

const sendOtpEmail = async (email, otp) => {
    let emailDelivered = false;

    // 1. Attempt sending via SMTP if credentials are configured
    if (process.env.MAILERSEND_SMTP_USER && process.env.MAILERSEND_SMTP_PASS) {
        try {
            const emailMessage = createOtpEmail(email, otp);
            await mailTransporter.sendMail(emailMessage);
            emailDelivered = true;
            console.log(`[OTP] Email sent via SMTP to ${email}`);
            return true;
        } catch (smtpErr) {
            console.warn(`[OTP] SMTP send failed for ${email}:`, smtpErr.message);
        }
    }

    // 2. Attempt sending via MailerSend REST API if API Key is configured
    if (process.env.MAILERSEND_API_KEY) {
        try {
            const response = await fetch("https://api.mailersend.com/v1/email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.MAILERSEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: {
                        email: process.env.MAILERSEND_SMTP_USER || "MS_y76zKe@test-r83ql3p3mmmgzw1j.mlsender.net",
                        name: "Elcto Support"
                    },
                    to: [{ email: email }],
                    subject: "Your Elcto Password Reset OTP",
                    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
                    html: `<div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; background: #f8fafc; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0;">
                        <h2 style="color: #1d4ed8; margin-top: 0;">Elcto Password Reset</h2>
                        <p>You requested to reset your password. Use the verification OTP below to proceed:</p>
                        <div style="background: #eff6ff; border: 1px dashed #3b82f6; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
                            <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #1d4ed8;">${otp}</span>
                        </div>
                        <p style="font-size: 13px; color: #64748b;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
                    </div>`
                })
            });
            if (response.ok || response.status === 202) {
                emailDelivered = true;
                console.log(`[OTP] Email sent via MailerSend API to ${email}`);
                return true;
            } else {
                const text = await response.text();
                console.warn(`[OTP] MailerSend API response ${response.status}: ${text}`);
            }
        } catch (apiErr) {
            console.warn(`[OTP] MailerSend API failed for ${email}:`, apiErr.message);
        }
    }

    // 3. Fallback: Always log OTP to server console so testing is never blocked
    console.log(`\n===============================================\n🔑 [OTP CODE for ${email}]: ${otp}\n===============================================\n`);
    return emailDelivered;
};

app.post('/api/forgot', async (req, res) => {
    const email = (req.body.email || '').trim().toLowerCase();
    if (!email) {
        return res.send({
            statuscode: 2, message: 'Email is required'
        });
    }
    try {
        const exist = await user.findOne(emailQuery(email));
        if (!exist) {
            return res.send({
                statuscode: 0,
                message: 'No account found with this email address'
            });
        }

        const otp = createOtp();
        saveOtpForEmail(email, otp);
        const emailDelivered = await sendOtpEmail(email, otp);
        console.log(`[Forgot Password] OTP generated for ${email}: ${otp}`);

        return res.send({
            statuscode: 1,
            message: emailDelivered ? "OTP sent to your email" : "OTP generated successfully! Check your email",
            demoOtp: otp
        });
    }
    catch (err) {
        console.error("Forgot password error:", err);
        return res.status(500).send({
            statuscode: 0,
            message: "Unable to send OTP right now"
        });
    }
});

app.post('/api/verify-otp', async (req, res) => {
    const email = (req.body.email || '').trim().toLowerCase();
    const otp = (req.body.otp || '').toString().trim();

    if (!email || !otp) {
        return res.send({ statuscode: 2, message: 'Email and OTP are required' });
    }
    const savedOtp = otpStore[email];
    if (!savedOtp) {
        return res.send({ statuscode: 0, message: 'Invalid OTP or OTP has expired' });
    }
    if (Date.now() > savedOtp.expiresAt) {
        delete otpStore[email];
        return res.send({ statuscode: 0, message: 'OTP has expired. Please request a new code.' });
    }
    if (savedOtp.code !== otp) {
        return res.send({ statuscode: 0, message: 'Invalid OTP code. Please check and try again.' });
    }
    delete otpStore[email];
    return res.send({ statuscode: 1, message: 'OTP Verified Successfully' });
});

app.put("/api/resetpassword/:mail", async (req, res) => {
    const email = (req.params.mail || '').trim().toLowerCase();
    const { pass, cpass } = req.body;

    if (!email || !pass || !cpass) {
        return res.send({ statuscode: 2, message: "Email, password and confirm password are required" });
    }
    if (pass !== cpass) {
        return res.send({ statuscode: 4, message: "Password and confirm password do not match" });
    }
    if (!passwor.test(pass)) {
        return res.send({ statuscode: 3, message: "🚨 Password must contain Uppercase, Lowercase, Number & Special character (minimum 8 characters)" });
    }

    const exist = await user.findOne(emailQuery(email));
    if (!exist) {
        return res.send({ statuscode: 0, message: "No account found with this email" });
    }

    const hash = bcrypt.hashSync(pass, 10);
    const result = await user.updateOne(emailQuery(email), {
        $set: {
            Password: hash,
        }
    });

    if (result.matchedCount > 0 || result.modifiedCount > 0) {
        res.send({ statuscode: 1, message: "Password updated successfully" });
    }
    else {
        res.send({ statuscode: 0, message: "Password was not updated" });
    }
});

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
        allowed_formats: ["jpg", "png", "jpeg", "webp", "avif"]
    }
})

const upload = multer({ storage: myStorage })
const Category = new mongoose.Schema({
    Name: String,
    Img: String
})

const Cate = mongoose.model("category", Category)

app.post("/api/category", upload.single("pic"), async (req, res) => {
    try {
        if (!req.file || !req.file.path) {
            return res.status(400).send({ statuscode: 0, message: "Category image is required" })
        }

        const result = new Cate({
            Name: req.body.name,
            Img: req.file.path
        })
        const resp = await result.save()
        if (resp) {
            return res.send({ statuscode: 1 })
        }

        return res.send({ statuscode: 0 })
    }
    catch (err) {
        console.error("Error in /api/category", err)
        return res.status(500).send({ statuscode: 0, message: err.message })
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
    upload.any()(req, res, async function (uploadErr) {
        if (uploadErr) {
            console.error('Upload error in /api/updatepro/:id', uploadErr);
            return res.status(500).send({ statuscode: 0, error: uploadErr.message });
        }

        try {
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

            const uploadedFiles = req.files || (req.file ? [req.file] : []);
            if (uploadedFiles.length > 0) {
                const imagePaths = uploadedFiles.map(f => f.path || f.secure_url || f.filename);
                updateFields.Img = imagePaths[0];
                updateFields.Images = imagePaths;
            }

            const result = await pro.updateOne({ _id: req.params.id }, { $set: updateFields });

            if (result.modifiedCount === 1 || result.matchedCount === 1) {
                res.send({ statuscode: 1 });
            } else {
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
    try {
        if (!req.file || !req.file.path) {
            return res.status(400).send({ statuscode: 0, message: "Brand image is required" })
        }

        const result = new br({
            BrandName: req.body.brandname,
            Category: req.body.category,
            Img: req.file.path
        })
        const resp = await result.save()
        if (resp) {
            return res.send({ statuscode: 1 })
        }

        return res.send({ statuscode: 0 })
    }
    catch (err) {
        console.error("Error in /api/brand", err)
        return res.status(500).send({ statuscode: 0, message: err.message })
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
    Stock:Number,
    Images: [String],
    Brand: String,
    Specifications: String,
    AddedBy: String,
    VendorId: String
})

const pro = mongoose.model("Product", product)

app.post("/api/product", (req, res) => {
    upload.any()(req, res, async function (uploadErr) {
        if (uploadErr) {
            console.error('Upload error in /api/product', uploadErr);
            return res.status(500).send({ statuscode: 0, error: uploadErr.message });
        }
        try {
            const uploadedFiles = req.files || (req.file ? [req.file] : []);
            const imagePaths = uploadedFiles.map(f => f.path || f.secure_url || f.filename);
            const stock = Number(req.body.stock);

            if (!Number.isInteger(stock) || stock < 0) {
                return res.status(400).send({ statuscode: 0, error: "Stock must be a non-negative whole number" });
            }

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
                Img: imagePaths[0] || '',
                Stock: req.body.stock,
                Images: imagePaths,
                AddedBy: req.body.addedBy,
                VendorId: req.body.vendorid
            });

            const resp = await result.save();
            if (resp) {
                res.send({ statuscode: 1, data: { id: resp._id, stock: resp.Stock } });
            } else {
                res.send({ statuscode: 0 });
            }
        } catch (err) {
            console.error('Error in /api/product', err);
            res.status(500).send({ statuscode: 0, error: err.message });
        }
    });
});

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

app.get("/api/vendorproduct/:id", async (req, res) => {
    const result = await pro.find({ VendorId: req.params.id })
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
    try {
        const proid = req.params.proid
        const quantity = req.body.value === undefined ? 1 : Number(req.body.value)
        const item = await pro.findById(proid)

        if (!item) return res.status(404).send({ statuscode: 0, message: "Product not found" })
        if (!Number.isInteger(quantity) || quantity < 1 || item.Stock < quantity) {
            return res.status(400).send({ statuscode: 0, message: "Requested quantity is not in stock" })
        }

        const exist = await cartmodel.findOne({ ProductId: proid, User: req.body.id })
        if (exist) return res.send({ statuscode: 2, message: "Already in Cart" })

        await new cartmodel({
            ProductId: proid,
            Name: item.ProductName,
            Price: item.ProductPrice,
            Img: item.Img,
            Quantity: quantity,
            User: req.body.id
        }).save()
        res.send({ statuscode: 1 })
    } catch (err) {
        console.error("Error adding cart item", err)
        res.status(500).send({ statuscode: 0, message: "Could not add item to cart" })
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

app.put("/api/cartquantity/:id", async (req, res) => {
    try {
        const quantity = Number(req.body.quantity)
        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).send({ statuscode: 0, message: "Quantity must be at least 1" })
        }

        const cartItem = await cartmodel.findById(req.params.id)
        if (!cartItem) return res.status(404).send({ statuscode: 0, message: "Cart item not found" })

        const item = await pro.findById(cartItem.ProductId)
        if (!item || item.Stock < quantity) {
            return res.status(400).send({ statuscode: 0, message: "Only the available stock can be added" })
        }

        cartItem.Quantity = quantity
        await cartItem.save()
        res.send({ statuscode: 1, data: cartItem })
    } catch (err) {
        console.error("Error updating cart quantity", err)
        res.status(500).send({ statuscode: 0, message: "Could not update cart quantity" })
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
    Order: [{ ProductId: String, ProductName: String, Quantity: Number, Price: Number, Img: String }]
})

const cout = mongoose.model("Checkout", Check)

app.post("/api/checkout", async (req, res) => {
    const reducedItems = []
    try {
        const cartItems = await cartmodel.find({ User: req.body.id })
        if (!cartItems.length) {
            return res.status(400).send({ statuscode: 0, message: "Cart is empty" })
        }

        const orderItems = []
        let total = 0
        for (const cartItem of cartItems) {
            const quantity = Number(cartItem.Quantity)
            const updatedProduct = await pro.findOneAndUpdate(
                { _id: cartItem.ProductId, Stock: { $gte: quantity } },
                { $inc: { Stock: -quantity } },
                { new: true }
            )

            if (!updatedProduct) {
                throw new Error(`${cartItem.Name} no longer has enough stock`)
            }

            reducedItems.push({ productId: cartItem.ProductId, quantity })
            const price = Number(updatedProduct.ProductPrice)
            orderItems.push({
                ProductId: cartItem.ProductId,
                ProductName: updatedProduct.ProductName,
                Quantity: quantity,
                Price: price,
                Img: updatedProduct.Img
            })
            total += price * quantity
        }

        await new cout({
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
            Total: total,
            Order: orderItems,
            OrderNo: req.body.orderno
        }).save()

        await cartmodel.deleteMany({ User: req.body.id })
        res.send({ statuscode: 1 })
    } catch (err) {
        await Promise.all(reducedItems.map(({ productId, quantity }) =>
            pro.updateOne({ _id: productId }, { $inc: { Stock: quantity } })
        ))
        console.error("Error during checkout", err)
        res.status(400).send({ statuscode: 0, message: err.message || "Order could not be placed" })
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

const vendor = new mongoose.Schema({
    Name: String,
    Email: String,
    Phone: String,
    Password: String,
    Username: String,
    Bank: String,
    City: String,
    State: String,
    UserType: String,
    Status: String,
})

const vendordata = mongoose.model("Vendor", vendor)

app.post("/api/vendorregister", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.pass, 10)
    const result = new vendordata({
        Name: req.body.name,
        Email: req.body.email,
        Phone: req.body.phn,
        Password: hashedPassword,
        Username: req.body.uname,
        Bank: req.body.bank,
        City: req.body.city,
        State: req.body.state,
        UserType: "Vendor",
        Status: "Pending"
    })
    const resp = await result.save()
    if (resp) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.get("/api/vendordata", async (req, res) => {
    const result = await vendordata.find()
    if (result) {
        console.log(result)
        res.send({ statuscode: 1, data: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.post("/api/vlog", async (req, res) => {
    const result = await vendordata.findOne({ Email: req.body.email })
    const respass2 = result.Password
    const passw2 = bcrypt.compareSync(req.body.pass, respass2)
    console.log("Entered Password:", req.body.pass)
    console.log("DB Password:", result.Password)
    console.log("Match:", passw2)
    console.log("Status:", result.Status)
    if (result.Email === req.body.email && passw2 === true && result.Status === "Accept") {
        let vtoken = jwt.sign({ id: result._id, usertype: result.UserType, mail: result.Email }, key, { expiresIn: "1h" })
        res.send({ statuscode: 1, data: result, token: vtoken })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

app.put("/api/approval/:id", async (req, res) => {
    const result = vendordata.updateOne({ _id: req.params.id }, {
        $set: {
            Status: req.body.status,
        }
    })
    if ((await result).modifiedCount == 1) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})
