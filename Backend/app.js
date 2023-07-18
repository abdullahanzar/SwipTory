const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const imageSchema = new mongoose.Schema({
  image: {
    type: Buffer,
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
});

const swipToryStorySchema = new mongoose.Schema({
  storyID: {
    type: Number,
    default: 0,
  },
  heading: String,
  description: String,
  imageURL: String,
  category: String,
  likes: {
    type: Array,
    default: [],
  },
  iteration: {
    type: Number,
    default: 0,
    min: [0, "Iteration cannot be less than 0"],
    max: [5, "Iteration cannot be more than 5"],
  },
  createdByUser: String,
});

const swipToryUser = mongoose.model("SwipTory-User", {
  username: String,
  password: String,
  bookmarks: {
    type: Array,
    default: [],
  },
});

const swipToryStory = mongoose.model("swiptory-story", swipToryStorySchema);
const swipToryImages = mongoose.model("swiptory-image", imageSchema);

async function authenticate(username, password) {
  const user = await swipToryUser.findOne({ username });
  if (!user) return false;
  const fetchedPassword = user.password;
  const auth = await bcrypt.compare(password, fetchedPassword);
  if (auth === true) return user.username;
  else return false;
}

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.token;
  try {
    const verify = await jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (e) {
    res.json({ error: "Sign In First", err: e });
    return;
  }
  next();
};

app.get("/", (req, res) => {
  res.json({ Welcome: "To the SwipTory Server",
            Health: "Good, go to /health to get more details" });
});

app.get('/health', (req, res)=>{
    if(mongoose.connection.readyState==1)
    res.json({
        Server: 'IS RUNNING ON THE DESIGNATED PORT',
        Database: 'Connection is succesful'
    })
    else 
    res.json({
        Server: 'IS RUNNING ON THE DESIGNATED PORT',
        Database: 'There is some problem connecting to the database'
    })
})

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (await swipToryUser.findOne({ username: username })) {
    res.json({ error: "user already exists" });
  } else if (!username || !password) {
    res.json({ error: "sent empty body" });
  } else {
    try {
      const encryptedPassword = await bcrypt.hash(password, 4);
      await swipToryUser.create({
        username: username,
        password: encryptedPassword,
      });
      res.json({ Success: "All Good", user: username });
    } catch (e) {
      res.json({ error: e });
    }
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.json({ error: "sent empty body" });
  } else {
    const authentication = await authenticate(username, password);
    if (authentication) {
      try {
        const jwtToken = await jwt.sign(
          { username, password },
          process.env.JWT_SECRET_KEY,
          { expiresIn: 1800 }
        );
        res.json({
          authentication: true,
          login: "successful",
          token: jwtToken,
          user: authentication,
        });
      } catch (e) {
        res.json({
          error: e,
        });
      }
    } else {
      res.json({
        error: "Authentication failed",
        login: "unsuccessful",
        authentication: false,
      });
    }
  }
});

app.post("/story", isAuthenticated, async (req, res) => {
  const storyID = req.body.storyID;
  const found = await swipToryStory.find({ storyID });
  const { heading, description, imageURL, category, createdByUser } = req.body;
  if (!heading || !description || !imageURL || !category || !createdByUser) {
    return res.json({ error: "Imcomplete Body" });
  }
  if (found[0] == undefined) {
    try {
      await swipToryStory.create({
        storyID,
        heading,
        description,
        imageURL,
        category,
        createdByUser
      });
      return res.json({
        Success: "Story Successfully Uploaded",
        storyID: storyID,
        iteration: 0,
      });
    } catch (e) {
      return res.json({ Error: e });
    }
  }
  if (found) {
    try {
      const iteration = found[found.length - 1].iteration;
      if (iteration >= 6)
        return res.json({
          Error: "Not allowed to upload more than 6 slides in a story",
        });
      await swipToryStory.create({
        storyID,
        heading,
        description,
        imageURL,
        category,
        iteration: iteration + 1,
        createdByUser
      });
      return res.json({
        Success: "Story Successfully Uploaded",
        storyID: storyID,
        iteration: iteration + 1,
      });
    } catch (e) {
      return res.json({ Error: e });
    }
  }
});

app.put("/story", isAuthenticated, async (req, res) => {
  const storyID = req.body.storyID;
  const found = await swipToryStory.find({ storyID });
  if (found.length > 0 && found[found.length - 1].iteration == 5) {
    try {
      const deleted = await swipToryStory.deleteMany({ storyID });
    } catch (e) {
      return res.json({ Error: "Internal Error with Patch" });
    }
  }
  const { heading, description, imageURL, category } = req.body;
  if (!heading || !description || !imageURL || !category) {
    return res.json({ error: "Imcomplete Body" });
  }
  if (found[0] == undefined) {
    try {
      await swipToryStory.create({ heading, description, imageURL, category });
      return res.json({ Success: "Story Successfully Uploaded" });
    } catch (e) {
      return res.json({ Error: e });
    }
  }
  if (found) {
    try {
      const iteration = found[found.length - 1].iteration;
      if (iteration >= 6)
        return res.json({
          Error: "Not allowed to upload more than 6 slides in a story",
        });
      await swipToryStory.create({
        storyID,
        heading,
        description,
        imageURL,
        category,
        iteration: iteration + 1,
      });
      return res.json({ Success: "Story Successfully Uploaded" });
    } catch (e) {
      return res.json({ Error: e });
    }
  }
});

app.delete("/story/:id", isAuthenticated, async (req, res) => {
  const storyID = req.params.id;
  try {
    await swipToryStory.deleteMany({ storyID });
    res.json({ Success: "Delete successful" });
  } catch (e) {
    res.json({ Error: "Could not be deleted" });
  }
});

app.get("/story/:storyID", async (req, res) => {
  try {
    const storyID = req.params.storyID;
    const category = req.query.category;
    if (category) {
      const found = await swipToryStory.find({ category }).sort({ _id: -1 });
      return res.json(found);
    }
    if (storyID == "all") {
      const found = await swipToryStory.find().sort({ _id: -1 });
      return res.json(found);
    }
    const found = await swipToryStory.find({ storyID });
    return res.json(found);
  } catch (e) {
    return res.json({ "Error": "Contact Developer" });
  }
});

app.get("/user/story/:username", async(req, res)=>{
  try {
    const username = req.params.username;
    if(!username) {
      return res.json({error: "Not provided with the username params."})
    }
    const found = await swipToryStory.find({createdByUser: username}).sort({ _id: -1 });
    if(!found[0]) {
      return res.json({error: "This user hasn't created any stories yet."})
    }
    return res.json(found)
  } 
  catch (e) {
    console.log(e)
  }
})

app.post("/like", isAuthenticated, async (req, res) => {
  try {
    const user = req.body.username;
    const storyID = req.body.storyID;
    const iteration = req.body.iteration;
    const userArray = [user]
    if(!user || !storyID || !iteration) {
      return res.json({error: "Not provided username or storyID or iteration."})
    }
    const check = await swipToryStory.findOne({ storyID, iteration, likes : { $in: userArray}});
    if (check)
      return res.json({ error: "User has already liked the story." });
    const found = await swipToryStory.findOneAndUpdate(
      { storyID, iteration: iteration },
      { $push: { likes: user } },
      {
        new: true,
      }
    );
    return res.json(found.likes);
  } catch (e) {
    return res.json({ Error: e });
  }
});

app.put("/like", isAuthenticated, async (req, res) => {
  try {
    const user = req.body.username;
    const userArray = [user];
    const storyID = req.body.storyID;
    const iteration = req.body.iteration;
    const check = await swipToryStory.findOne({ storyID, iteration, likes : { $in: userArray}});
    if(check) {
      const response =  await swipToryStory.findOneAndUpdate({ storyID, iteration: iteration },
        { $pull: { likes: user } },
        {
          new: true,
        })
      if(response)
      return res.json(response)
    }
    return res.json({notFound: "Not Found"})
  }
  catch(e) {
    return res.json({err: e});
  }
})

app.get('/like/:storyID', isAuthenticated, async (req, res) => {
  try {
    const storyID = req.params.storyID;
    const iteration = req.query.iteration;
    const username = req.query.username;
    const user = [username];
    if(!storyID || !iteration || !username)
    return res.json({error: "not provided with storyID or iteration"})
    const check = await swipToryStory.findOne({ storyID, iteration, likes : { $in: user}});
    if(check) {
      return res.json({userLiked: true,
        likes: check.likes});
    }
    let likes = await swipToryStory.findOne({storyID, iteration});
    if(likes)
    likes = likes.likes;
    return res.json({userLiked: false,
      likes: likes})
  }
  catch(e) {
    return res.json({err: e});
  }
})

app.post("/bookmark", isAuthenticated, async (req, res) => {
  try {
    const user = req.body.username;
    const storyID = req.body.storyID;
    const check = await swipToryUser.findOne({ username: user });
    if (check.bookmarks.includes(storyID))
      return res.json({
        error: "Bookmark already exists. Try delete request.",
      });
    const found = await swipToryUser.findOneAndUpdate(
      { username: user },
      {
        $push: { bookmarks: storyID },
      },
      {
        new: true,
      }
    );
    res.json(found);
  } catch (e) {
    res.json({ error: "You are missing either user or storyID", ERR: e });
  }
});

app.get("/bookmark/:username", isAuthenticated, async (req, res) => {
  try {
  const user = req.params.username;
  const storyID = req.query.storyID;
  const storyIDArray = [storyID];
  const check = await swipToryUser.findOne({username: user, bookmarks: { $in: storyIDArray }});
  if(check) {
    return res.json({found: true})
  }
  else {
    return res.json({notFound: "Not Found"})
  }
  }
  catch(e) {
    res.json({err: e})
    console.log(e)
  }
})

app.put("/bookmark", isAuthenticated, async (req, res) => {
  try {
    const user = req.body.username;
    const storyID = req.body.storyID;
    const check = await swipToryUser.findOne({ username: user, bookmarks: { $in : storyID} });
    if (check) {
      const found = await swipToryUser.findOneAndUpdate(
        { username: user },
        {
          $pull: { bookmarks: storyID },
        },
        {
          new: true,
        }
      );
      return res.json(found);
    }
    res.json({ Error: "Bookmark does not exist!" });
  } catch (e) {
    res.json({ Error: "User or StoryID is missing", err: e });
  }
});

app.get('/user/bookmarks/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const response = await swipToryUser.findOne({
      username
    })
    if(response) {
      let userBookmarks = response.bookmarks;
      userBookmarks = userBookmarks.filter((item,
        index) => userBookmarks.indexOf(item) === index);
      return  res.json(userBookmarks);
    }
    return res.json({notFound: "User does not exist!"})
  }
  catch(e) {
    res.send(e)
  }
})

app.post("/image", upload.single("image"), async (req, res) => {
  try {
    const imageData = req.file.buffer;
    const heading = req.body.heading;
    const mimeType = req.file.mimetype;
    if (!heading || !imageData) {
      return res.json({ error: "Image without heading" });
    }
    const image = new swipToryImages({
      image: imageData,
      heading: heading,
      mimeType: mimeType,
    });
    await image.save();
    res.status(201).send("Image uploaded successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during image upload.");
  }
});

app.get("/image/:heading", async (req, res) => {
  try {
    const heading = req.params.heading;
    const image = await swipToryImages.findOne({ heading });
    if (!image) {
      return res.status(404).send("Image not found");
    }
    res.set("Content-Type", image.mimeType);
    res.send(image.image);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while retrieving the image");
  }
});

app.post("/verify-token", isAuthenticated, (req, res) => {
  res.send("Token Valid");
});

app.get("/storyid", async (req, res) => {
    try {
      let response = await swipToryStory.find().sort({ _id: -1 }).limit(1);
      if(!response[0]) {
        response = {
          storyID: 0
        }
        return res.json(response);
      }
      response = {
        storyID: response[0].storyID + 1
      }
      res.send(response)
    } catch(e) {
      console.log(e)
    }
}, [])

app.use("/", (req, res) => {
  res.status(404);
  res.json({
    error: "URL NOT FOUND",
  });
});

app.listen(process.env.SERVER_PORT, async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("Connected to the database successfully");
  } catch (e) {
    console.log("Connection to the database is unsuccessful.");
    console.log(e);
  }
});
