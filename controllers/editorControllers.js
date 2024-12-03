import { Blog } from "../models/blogsData.js";
import { draftBlog } from "../models/draftBlogs.js";
import uploadImage from "../utilities/uploadImage.js";
import { transport, sendApprovalNotification } from "../utilities/mailFunctions.js";

// Editor controller function (handles editor routing)
export const editorController = async (req, res) => {
  // Check if user is logged in
  if (req.session.authorized) {
    const pageProps = {
      author: req.session.user.email,
      lastPath: req.params.lastPath,
      editorCSS: "/stylesheets/editor.css",
      isAdmin: req.session.isAdmin
    };
    
    // Check if existing post is to be edited
    const [blogData, draftData] = await Promise.all([
      Blog.findOne({ url: req.params.lastPath }),
      draftBlog.findOne({ url: req.params.lastPath })
    ]);

    if (req.params.lastPath === "new-post") {
      res.render("editor", pageProps);
    } else if (blogData) {
      blogData.post_text = blogData.post_text.replaceAll("<br>", "\n");
      pageProps["blogData"] = blogData;
      res.render("editor", pageProps);
    } else if (draftData && req.session.isAdmin) {
      draftData.post_text = draftData.post_text.replaceAll("<br>", "\n");
      draftData.isDraft = true;
      pageProps["blogData"] = draftData;
      res.render("editor", pageProps);
    } else {
      res.redirect("/404");
    }
  } else {
    res.redirect("/u");
  }
};

// Publish post controller
export const publishController = async (req, res) => {
  if (!req.session.authorized) {
    return res.redirect("/u");
  }

  try {
    let imageUrl = "/images/1.png";
    let tags = [];
    
    // Handle image upload if present
    if (req.files && req.files.image_path) {
      const uploadedFile = req.files.image_path;
      
      console.log('Received file:', {
        name: uploadedFile.name,
        size: uploadedFile.size,
        mimetype: uploadedFile.mimetype,
        encoding: uploadedFile.encoding,
        tempFilePath: uploadedFile.tempFilePath,
        truncated: uploadedFile.truncated,
        md5: uploadedFile.md5
      });

      // Validate file
      if (!uploadedFile.tempFilePath) {
        throw new Error('Invalid file: no temp file path received');
      }

      if (uploadedFile.size === 0) {
        throw new Error('Invalid file: file size is 0 bytes');
      }

      imageUrl = await uploadImage(uploadedFile, "single");
    }

    // Process tags
    if (req.body.tags && req.body.tags.split(",").length >= 1) {
      tags = req.body.tags.split(",").map(tag => tag.trim());
    }

    // Check if this is an edit of an existing post
    if (req.params.id) {
      // Find existing blog post
      const existingBlog = await Blog.findById(req.params.id);
      if (!existingBlog) {
        return res.status(404).render('error', {
          message: 'Blog post not found',
          error: { status: 404 }
        });
      }

      // Create draft with existing post data
      const draftBlogData = {
        url: existingBlog.url,
        heading: req.body.heading,
        email: req.session.user.email,
        post_text: req.body.post_text.replaceAll("\n", "<br>"),
        tags: tags.length > 0 ? tags : existingBlog.tags
      };

      // Only update image if a new one was uploaded
      if (req.files && req.files.image_path) {
        draftBlogData.image_path = imageUrl;
      } else {
        draftBlogData.image_path = existingBlog.image_path;
      }

      await draftBlog.create(draftBlogData);
      return res.redirect('/u');
    } else {
      // This is a new post
      // Create post URL from heading
      let postUrl = encodeURIComponent(req.body.heading.trim());
      
      // Check for URL conflicts
      const urlExists = await Promise.all([
        Blog.findOne({ url: postUrl }),
        draftBlog.findOne({ url: postUrl })
      ]);
      
      if (urlExists[0] || urlExists[1]) {
        postUrl += Date.now(); // Add timestamp to make URL unique
      }

      // Create draft blog post
      const draftBlogData = {
        url: postUrl,
        image_path: imageUrl,
        heading: req.body.heading,
        email: req.session.user.email,
        post_text: req.body.post_text.replaceAll("\n", "<br>"),
        tags: tags
      };

      await draftBlog.create(draftBlogData);
      return res.redirect('/u');
    }
  } catch (error) {
    console.error('Error in publishController:', error);
    return res.status(500).render('error', {
      message: 'Error publishing post',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Delete post controller
export const deleteController = async (req, res) => {
  if (req.session.authorized) {
    try {
      const postId = req.params.id;
      
      // Find and delete from both Blog and draftBlog collections
      const [blog, draft] = await Promise.all([
        Blog.findById(postId),
        draftBlog.findById(postId)
      ]);

      if (blog) {
        await Blog.findByIdAndDelete(postId);
      }
      if (draft) {
        await draftBlog.findByIdAndDelete(postId);
      }

      if (!blog && !draft) {
        return res.status(404).json({ 
          success: false, 
          message: 'Post not found' 
        });
      }

      // Send success response
      res.status(200).json({ 
        success: true, 
        message: 'Post deleted successfully' 
      });

    } catch (error) {
      console.error('Error in deleteController:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error deleting post',
        error: error.message 
      });
    }
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Unauthorized' 
    });
  }
};

// Handle approve/reject actions
export const reviewController = async (req, res) => {
  if (req.session.authorized && req.session.isAdmin) {
    try {
      const postId = req.params.id;
      const action = req.body.action;
      
      const draftPost = await draftBlog.findById(postId);
      
      if (!draftPost) {
        return res.status(404).json({
          success: false,
          message: 'Draft post not found'
        });
      }

      if (action === 'approve') {
        // Check if this is an edit of an existing post
        const existingPost = await Blog.findOne({ url: draftPost.url });
        
        try {
          if (existingPost) {
            // Update existing post
            await Blog.findByIdAndUpdate(existingPost._id, {
              heading: draftPost.heading,
              post_text: draftPost.post_text,
              image_path: draftPost.image_path,
              tags: draftPost.tags,
              email: draftPost.email,
              lastModified: new Date()
            });
          } else {
            // Create new blog post
            const blogPost = new Blog(draftPost.toObject());
            await blogPost.save();
          }

          // Send notification email to author
          await sendApprovalNotification(
            draftPost.email,
            draftPost.heading,
            draftPost.url
          );

          // Delete the draft after approval
          await draftBlog.findByIdAndDelete(postId);
          
          res.status(200).json({
            success: true,
            message: existingPost ? 'Post updated and published' : 'Post approved and published'
          });
        } catch (error) {
          console.error('Error in approval process:', error);
          res.status(500).json({
            success: false,
            message: 'Error during approval process',
            error: error.message
          });
        }
      } else if (action === 'reject') {
        // Delete from draftBlog
        await draftBlog.findByIdAndDelete(postId);
        
        res.status(200).json({
          success: true,
          message: 'Draft post rejected and deleted'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
      }
    } catch (error) {
      console.error('Error in reviewController:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing review action',
        error: error.message
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
};

// Preview draft post
export const previewController = async (req, res) => {
  if (req.session.authorized && req.session.isAdmin) {
    try {
      const postId = req.params.id;
      const draftPost = await draftBlog.findById(postId);
      
      if (!draftPost) {
        return res.status(404).render('error', {
          message: 'Draft post not found',
          error: { status: 404 }
        });
      }

      // Render using blog template
      res.render('blog', {
        blogPost: draftPost,  
        isPreview: true,
        blogCSS: "/stylesheets/blog.css"
      });

    } catch (error) {
      console.error('Error in previewController:', error);
      res.status(500).render('error', {
        message: 'Error previewing draft',
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    }
  } else {
    res.redirect('/u');
  }
};
