const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Story = require("../model/story");
//@desc Show add page
//@desc GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});
//@desc Show add page
//@desc POST /stories/add
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    console.log(req.body.user);
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.render("/error/500");
  }
});
//@desc Show all stories
//@desc GET /stories/add
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("stories/index", {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});
//@desc Show single story 
//@desc GET /stories/add
router.get("/:id", ensureAuth, async(req, res) => {
 try {
   let story = await Story.findById(req.params.id).populate('user').lean()

  if(!story){
   return res.render('error/404')
    }
  if(story.user._id != req.user.id && story.status == 'private')
  {
    res.render('error/404')
  }
  else{
    res.render('stories/show',{
      story,
    })
  }
 } catch (error) {
   console.log(err)
   res.render('/error/404')
   
 }
});
//@desc Show edit page
//@desc GET /stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const storys = await Story.findOne({
      _id: req.params.id,
    }).lean();
    if (!storys) {
      return res.render("/error/400");
    }
    if (storys.user != req.user.id) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", { storys });
    }
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
}); // @desc    Update story
// @route   PUT /stories/:id
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});
// @desc    Update story
// @route   PUT /stories/:id
// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      await Story.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})
// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId',ensureAuth,async(req,res)=>{
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    }).populate('user').lean()
    res.render('stories/index',{
      stories,
    })
  } catch (error) {
    console.error(error);
    res.render('error/500')
  }
})
module.exports = router;
