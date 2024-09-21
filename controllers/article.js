const Article = require('../models/Article');

// Create a new article
exports.createArticle = async (req, res) => {
  const { title, content, media } = req.body;
  const article = new Article({
    title,
    content,
    media,
    author:req.user.name,
    author: req.user.id,
  });

  await article.save();
  res.json(article);
};

// Update an article (Editor or Admin)
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ msg: 'Article not found' });

    article.title = req.body.title || article.title;
    article.content = req.body.content || article.content;
    
    await article.save();
    res.json(article);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete an article (Writer, Editor, or Admin)
// exports.deleteArticle = async (req, res) => {
//   try {
//     const article = await Article.findById(req.params.id);
//     if (!article) return res.status(404).json({ msg: 'Article not found' });

//     if (req.user.role !== 'admin' && article.author.toString() !== req.user.id) {
//       return res.status(403).json({ msg: 'Not authorized' });
//     }

//     await article.remove();
//     res.json({ msg: 'Article removed' });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };
exports.deleteArticle = async (req, res) => {
    try {
      const article = await Article.findById(req.params.id);
      if (!article) return res.status(404).json({ msg: 'Article not found' });
  
      // Check authorization
      if (req.user.role !== 'admin' && article.author.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Not authorized' });
      }
  
      // Use deleteOne instead of remove
      await Article.deleteOne({ _id: req.params.id });
      res.json({ msg: 'Article removed' });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  };

// Get all articles
exports.getArticles = async (req, res) => {
  const articles = await Article.find().populate('author', 'name');
  res.json(articles);
};
