const express = require('express');
const response = require('@utils/response');
const v1Routes = require('@routes/v1');

const router = express.Router();

const defaultResp = (req, res) => {
  response.res404(res);
};

router.use('/api/v1', v1Routes);
router.all('*', defaultResp);

module.exports = router;
