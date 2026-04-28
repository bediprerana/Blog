import fs from 'fs'
import imagekit from '../configs/imagekit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import main from '../configs/gemini.js';

export const addBlog = async (req,res) =>{
  try {

    const data = req.body.parse ? JSON.parse(req.body.parse) : {};

    const { title, subTitle, description, category, isPublished } = data;

    const imageFile = req.file;

    // check if all field are present
    if(!title || !subTitle || !description || !category || !imageFile){
      return res.json({success: false, message:"Missing required fields"})
    }

    const fileBuffer = fs.readFileSync(imageFile.path)

    // upload image to imagekit
    const response = await imagekit.upload({
      file : fileBuffer,
      fileName : imageFile.originalname,
      folder: "/blogs"
    })
 
    // optimize through imagekit url transformation
    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation : [
        { quality: 'auto' }, 
        { format: 'webp' },
        { width : '1280' }
      ]
    });

    const image = optimizedImageUrl;

    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished
    });

    res.json({ success: true , message: "Blog added successfully" })

  } catch (error){
    res.json({ success: false , message: error.message })
  }
}


// Get All Published Blogs
export const getAllBlogs = async (req,res) => {
  try{

    const blogs = await Blog.find({ isPublished: true });

    res.json({ success:true , blogs })

  } catch(error){

    res.json({ success:false , message:error.message })

  }
}


// Get Blog By ID (FIXED)
export const getBlogById = async (req,res) =>{
  try {

    const { id } = req.params;   // ✅ FIXED

    const blog = await Blog.findById(id);

    if(!blog) {
      return res.json({ success: false , message:"Blog not found" });
    }

    res.json({ success:true, blog })

  } catch (error){

    res.json({ success:false , message: error.message })

  }
}


// Delete Blog
export const deleteBlogById = async (req,res) =>{
  try {

    const { id } = req.body;

    await Blog.findByIdAndDelete(id);


    //delete all comments associated with the blog
    await Comment.deleteMany({blog: id});
    res.json({ success:true, message: 'Blog deleted successfully' })

  } catch (error){

    res.json({ success:false , message: error.message })

  }
}


// Toggle Publish
export const togglePublish = async (req,res) =>{
  try {

    const { id } = req.body;

    const blog = await Blog.findById(id);

    blog.isPublished = !blog.isPublished;

    await blog.save();

    res.json({ success:true, message: 'Blog status updated' })

  } catch (error){

    res.json({ success:false, message:error.message })

  }
}


export const addComment = async (req, res) => {
  try {

    const { blogId, name, content } = req.body   // ✅ FIXED

    if (!blogId || !name || !content) {
      return res.json({
        success: false,
        message: "All fields are required"
      })
    }

    await Comment.create({
      blog: blogId,   // ✅ map correctly
      name,
      content
    })

    res.json({
      success: true,
      message: 'Comment added for review'
    })

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    })
  }
}

export const getBlogComments = async (req, res) => {
  try {

    const { blogId } = req.body

    const comments = await Comment.find({
      blog: blogId,
      isApproved: true
    }).sort({ createdAt: -1 })

    res.json({
      success: true,
      comments    // ✅ SEND DATA
    })

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    })
  }
}

export const generateContent = async (req,res) => {
  try {
    const {prompt} = req.body;
 const content =   await main(prompt + 'Generate a blog content for this topic in simple text format')
 res.json({success:true, content})  
  }catch(error){
    res.json({success: false,message: error.message})
  }
}
