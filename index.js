import express from "express";
import Post from './mongoDB/models/post.js';
import Users from "./mongoDB/models/users.js";
import connectDB from "./mongoDB/connect.js";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import { setUser, getUser } from "./services/auth.js"
import { restrictToLoggedinUserOnly, checkAuth } from "./middleware/auth.js";
import { error } from "console";

const app = express();

//Middlewares
app.use(express.json({ limit: "50mb" })); //To accept post request in json format(upto 50mb)
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());


//EJS setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


//Routes
app.get("/", (req, res) => {
    res.render("user");
});

app.get("/admin", (req, res) => {
    res.render("index");
});

app.get("/udashboard", restrictToLoggedinUserOnly, async (req, res) => {
    const records =  await Post.find({})
    res.render("udashboard", {'records':records});
});

app.get("/addCar", restrictToLoggedinUserOnly, (req, res) => {
    res.render("addCar");
});

app.post("/login", async (req, res) => {
    try {
        const {name, pass} = req.body;

        const user = await Users.findOne({
            name,
            pass
        });
        if(!user){
          res.render("user",{
            error: "Invalid Username or Password",
          });
        }
        else if (user) {
          const sessionId = uuidv4();
          setUser(sessionId, user);
          res.cookie("uid", sessionId);
          return res.redirect("/dashboard");
        }
      } catch (error) {
        res.status(500);
      }
    });

app.post("/ulogin", async (req, res) => {
    try {
        const {name, pass} = req.body;

        const user = await Users.findOne({
            name,
            pass
        });
        if(!user){
          res.render("user",{
            error: "Invalid Username or Password",
          });
        }
        else if (user) {
          const sessionId = uuidv4();
          setUser(sessionId, user);
          res.cookie("uid", sessionId);
          return res.redirect("/udashboard");
        }
      } catch (error) {
        res.status(500);
      }
    });

    app.post("/logout", async (req, res) => {
      await res.clearCookie("uid").redirect("/");
    });
    
    app.post("/addCar", restrictToLoggedinUserOnly, async (req, res) => {
      try {
        const { cname, mfgy, price } = req.body;

        const newPost = await Post.create({
            cname,
            mfgy,
            price
        });

        res.status(201).json({ success: true, data: newPost });
    } catch (error) {
        res.status(500);
    }

    });

    app.get("/dashboard", restrictToLoggedinUserOnly, async (req, res) => {
      try {
        const records =  await Post.find({})
          if(records){
           res.status(200).render('dashboard',{'records':records})
          }else{
           res.render('read')
          } 
       } catch (error) {
          res.status(500)
          console.log(error.message) 
       }
  });


  //Edit
app.get("/edit/:id", restrictToLoggedinUserOnly, async (req,res)=>{
  try {
      // console.log(req.params.id)
      const record = await Post.findById({'_id':req.params.id})
      if(record){
          res.render('edit', {'record':record}) 
      }else{
          res.render('edit')
      }
  } catch (error) {
      console.log(error.message)
  }
});

//Update
app.post("/update/:id", restrictToLoggedinUserOnly, async (req,res)=>{
  try {
   const updatedRecord =   await Post.findByIdAndUpdate(req.params.id, req.body)
   if(updatedRecord){
      res.redirect('/')
   }else{
      res.redirect('read')
   }
  } catch (error) {
      console.log(error.message)
  }
});

//Delete
app.get("/delete/:id", restrictToLoggedinUserOnly, async (req,res)=>{
  try {
    const deleterecord =   await Post.findByIdAndDelete(req.params.id)
      if(deleterecord){
          res.redirect('read')
      }else{
          res.redirect('/dashboard')
      }
    
  } catch (error) {
      
  }
});

    res.status(201).json({ success: true, data: newPost });
} catch (error) {
    res.status(500);
}

});

//Server Initialisation
const startServer = async () => {
    try {
      connectDB("mongodb+srv://harshsahu9926:rAqrCu9HIjsfks1j@cluster0.njhqnml.mongodb.net/?retryWrites=true&w=majority"); //MongoDB url is stored for deployment in process.env.MONGODB_URL
      app.listen(8000, () =>
        console.log("Server has started on port http://localhost:8000")
      );
    } catch (err) {
      console.log(err);
    }
  };
  
  startServer();
