const express = require('express');
const { createArticle, deleteArticle, updateArticle, getArticles } = require('../controllers/article');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth(['writer', 'editor', 'admin']), createArticle);
router.put('/:id', auth(['editor', 'admin']), updateArticle);
router.delete('/:id', auth(['writer', 'editor', 'admin']), deleteArticle);
router.get('/', auth(['reader', 'writer', 'editor', 'admin']), getArticles);

module.exports = router;
