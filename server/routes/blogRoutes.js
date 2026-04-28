import express from 'express';
import {
  addBlog,
  addComment,
  deleteBlogById,
  generateContent,
  getAllBlogs,
  getBlogById,
  getBlogComments,
  togglePublish
} from '../controllers/blogController.js';

import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js';

const blogRouter = express.Router();

// Add blog
blogRouter.post(
  "/add",
  auth,
  upload.single('image'),
  addBlog
);

// Get all blogs
blogRouter.get('/all', getAllBlogs);

// Get blog by ID  ✅ FIXED
blogRouter.get('/:id', getBlogById);

// Delete blog
blogRouter.post('/delete', auth, deleteBlogById);

// Toggle publish
blogRouter.post('/toggle-publish', auth, togglePublish);

blogRouter.post('/add-comment', addComment);
blogRouter.post('/comments', getBlogComments);

blogRouter.post('/generate',auth,generateContent);




export default blogRouter;


