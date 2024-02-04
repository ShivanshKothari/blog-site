import express from 'express';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));
router.use(express.static(path.join(__dirname + '/../public')));
const rawdata = fs.readFileSync(__dirname+'/../public/json/blogPosts.json', 'utf8');
const blogPosts = JSON.parse(rawdata).reverse();
const postTiles = blogPosts.map(({ image_path, heading, url }) => ({
  image_path,
  heading,
  url
}));


/* GET home page. */
router.get('/', (req, res, next) => {
  const data = {
    title: 'Home | Blogster',
    postTiles: postTiles,
    homeCSS: 'y'
  };
  res.render('index', data);
});

router.get('/blog/:postPath', (req, res) => {
  const lastPartOfPath = 'blog/' + req.params.postPath;
  console.log("stdhnenhdtdhne",lastPartOfPath);
  const data = {
    title: 'Home | Blogster',
    blogPost: blogPosts.find(post => post.url === lastPartOfPath),
    postTiles: postTiles,
    path: lastPartOfPath
  };
  res.render('blog', data);
});

export default router;
