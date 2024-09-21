const express = require('express');
const { register, login, manageUser, getUser, getUserRole, getMe } = require('../controllers/user');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/manage/:id', auth(['admin']), manageUser);  // Admin-only route for promoting users
router.get('/', auth(['admin']), getUser);
router.get('/role', auth(['admin','editor','writer','reader']), getUserRole);
router.get('/me', auth(['admin','editor','writer','reader']),getMe);
module.exports = router;
