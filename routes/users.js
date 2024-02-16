import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Blog } from '../database/blogsData';


const router = express.Router();

const __dirname = dirname(fileURLToPath(import.meta.url));
router.use(express.static(path.join(__dirname, '/../public')));



/* GET users listing. */
router.get('/', (req, res) => {
  const pageData = {title: 'User Login'};
  console.log();
  if (req.query['cred-error'] === 'error'){
    pageData['warning'] = 'Incorrect username or paord ¬_¬'
  }
  res.render('login', pageData);
});

router.post('/post-manager', async (req, res) => {
  if (req.body["username"] === "ShivanshKothari" && req.body["password"] === "Skothari")
    res.render('postmanager', {postTiles: await Blog.find({}).select('image_path heading url').sort({id: -1})});
  else
    res.redirect(`./?cred-error`);

});

router.post('/editor', async (req, res) => {
  if (req.body["username"] === "ShivanshKothari" && req.body["password"] === "Skothari")
    res.render('postmanager', {postTiles: await Blog.find({}).select('image_path heading url').sort({id: -1})});
  else
    res.redirect(`./?cred-error`);

});


export default router;
