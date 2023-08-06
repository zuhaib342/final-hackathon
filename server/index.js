const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserModel = require("./models/User");
const ProductModel = require("./models/Product");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());

mongoose.connect(
  "mongodb+srv://sheikhzuhaib522:zuhaib@cluster2.6gf8fjn.mongodb.net/?retryWrites=true&w=majority"
);

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Token is missing" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json("Error with token");
      } else {
        if (decoded.role === "admin") {
          next();
        } else {
          return res.json("Not admin");
        }
      }
    });
  }
};

app.get("/Dashboard", verifyUser, (req, res) => {
  res.json("Success");
});


app.get("/api/products", async (req, res) => {
  try {
    const products = await ProductModel.find({});
    const productsByCategory = {};
    products.forEach((product) => {
      const { category } = product;
      if (productsByCategory[category]) {
        productsByCategory[category].push(product);
      } else {
        productsByCategory[category] = [product];
      }
    });
    res.json(productsByCategory);
  } catch (err) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

app.post("/addProduct", verifyUser, async (req, res) => {
  const { name, category, description, price, color, size, images } = req.body;

  try {
    // Create a new product using the ProductModel
    const product = await ProductModel.create({
      name,
      category,
      description,
      price,
      color,
      size,
      images,
    });
    res.json({ status: "OK", product });
  } catch (err) {
    res.json({ err });
  }
});
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await UserModel.create({ name, email, password: hash });
    res.json({ status: "OK" });
  } catch (err) {
    res.json({ err });
  }
});


app.post("/login" , (req,res)=> {
  const {email , password} = req.body;
   UserModel.findOne({email : email})
   .then (user => {
    if (user ){
     bcrypt.compare(password, user.password, ( err , response)=>{
      if (response) {
    const token = jwt.sign({email: user.email, role : user.role}, "jwt-secret-key",{expiresIn: '1d'} )
    res.cookie("token" , token)
    return res.json({Status : "Success" , role: user.role})
      }else {
        return res.json("The Password is incorrect")
      }
     })
    }else {
      return res.json("No record existed")
    }
   })
});


app.listen(3001, () => {
  console.log("Server is running...");
});
