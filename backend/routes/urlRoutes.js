const express = require('express');
const router = express.Router();
const { shortenUrl, redirectUrl, getMyUrls, deleteUrl } = require('../controllers/UrlController');
const auth = require('../middleware/authMiddleware');
const verifyToken = require('../middleware/authMiddleware');

router.get('/my-urls', auth, getMyUrls);
router.post('/shorten', auth, shortenUrl);
router.get('/:shortId', redirectUrl);
router.delete('/:id', verifyToken, deleteUrl);

module.exports = router;