import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import validateObjectId from "../middlewares/validateObectId.js";
import cloudinaryUploadImg from "../utils/cloudinary.js";

const createBlog = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.json({
      status: "success",
      blog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);
  try {
    const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.json({
      status: "success",
      blog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);
  try {
    const getblog = await Blog.findById(id)
      .populate("likes")
      .populate("disLikes");
    await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json(getblog);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);
  try {
    const blog = await Blog.findByIdAndDelete(id);
    res.json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateObjectId(blogId);

  //Find the blog which you want to be liked
  const blog = await Blog.findById(blogId);
  //Find the login user
  const loginUserId = req?.user?._id;
  // Find if the user has liked the blog
  const isLiked = blog?.isLiked;
  // Find if the user has disliked the blog
  const alreadyDisliked = blog?.disLikes.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }

  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

const disLikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateObjectId(blogId);

  //Find the blog which you want to be liked
  const blog = await Blog.findById(blogId);
  //Find the login user
  const loginUserId = req?.user?._id;
  // Find if the user has liked the blog
  const isDisLiked = blog?.isDisLiked;
  // Find if the user has disliked the blog
  const alreadyLiked = blog?.likes.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }

  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { disLikes: loginUserId },
        isDisLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  // console.log(req.files);
  const { id } = req.params;
  validateObjectId(id);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const findBlog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    res.json(findBlog);
  } catch (error) {
    throw new Error(error);
  }
});

export {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  disLikeBlog,
  uploadImages,
};
