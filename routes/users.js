import express from 'express';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const router = express.Router();

const __dirname = dirname(fileURLToPath(import.meta.url));
router.use(express.static(path.join(__dirname, '/../public')));
const rawdata = fs.readFileSync(__dirname+'/../public/json/blogPosts.json', 'utf8');
const blogPosts = JSON.parse(rawdata).reverse();
const postTiles = blogPosts.map(({ image_path, heading, url }) => ({
  image_path,
  heading,
  url
}));


/* GET users listing. */
router.get('/', (req, res) => {
  const pageData = {title: 'User Login'};
  console.log();
  if (req.query['cred-error'] === 'error'){
    pageData['warning'] = 'Incorrect username or paord ¬_¬'
  }
  res.render('login', pageData);
});

router.post('/post-manager', (req, res) => {
  if (req.body["username"] === "ShivanshKothari" && req.body["password"] === "Skothari")
    res.render('postmanager', {postTiles: postTiles});
  else
    res.redirect(`./?cred-error`);

});

router.post('/editor', (req, res) => {
  if (req.body["username"] === "ShivanshKothari" && req.body["password"] === "Skothari")
    res.render('postmanager', {postTiles: postTiles});
  else
    res.redirect(`./?cred-error`);

});


export default router;
