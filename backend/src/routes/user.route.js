const express = require("express");
const { isUserAuthenticated } = require("../middleware/auth.middleware");

const {
  getSingleUser,
  getLoggedInUserDetails,
  uploadProfilePicture,
  uploadImageToCloud,
  getSingleUserDirectly,
  updateUserProfileDetails,
} = require("../controller/user.controller");
const upload = require("../middleware/multer.middleware");



const router = express.Router();




router.get("/getSingleUser", isUserAuthenticated, getSingleUserDirectly);

// Request to get a single user by their ID
router.get("/getSingleUser/:id", isUserAuthenticated, getSingleUser);

// Request to update a user's details by their ID
// router.put("/updateUser/:id", isUserAuthenticated, updateUserProfileDetails);

// Request to get details of the logged-in user
router.get("/getLoggedInUserDetails",isUserAuthenticated,getLoggedInUserDetails);

// Request to update the profile details of a user by their ID
router.patch("/updateUserProfileDetails",isUserAuthenticated,updateUserProfileDetails);

// Request to upload a profile picture


router.patch(
  "/uploadProfilePicture",
  upload.single("image"), //Handles file upload using multer middleware // Process uploaded file (optional)
  isUserAuthenticated,
  uploadProfilePicture // Handle uploading image to Cloudinary
);

module.exports = router;