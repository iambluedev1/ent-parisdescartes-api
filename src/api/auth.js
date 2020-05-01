const express = require('express');
const router = express.Router();
const {open} = require('../browser');
const {sign} = require('../jwt');
const _ = require('lodash');

router.post('/login', async (req, res) => {
  let username = req.body.username || '';
  let password = req.body.password || '';

  if (username === '' || password === '') {
    return res.status(422).json({
      error: 'Please specify a valid username and password'
    });
  }

  let page = await open();

  await page.goto('https://servauth.univ-paris5.fr/cas/login?service=https%3A%2F%2Fent.parisdescartes.fr%2Fapi%2Flogin%3FredirectTo%3Dhttps%253A%252F%252Fent.parisdescartes.fr%252F', {
    waitUntil: 'networkidle2'
  });

  await page.type('input[name=\'username\']', username);
  await page.type('input[name=\'password\']', password);
  await page.click('input[name=\'submit\']');

  await Promise.race([page.waitFor('#container-search-form'), page.waitFor('#status')]);

  const result = await page.evaluate(() => {
    const alert = document.querySelector('#status');

    if (alert === null) {
      return Promise.resolve('success');
    }

    return Promise.resolve(document.querySelector('#status').innerText);
  });

  if (result === 'success') {
    let cookies = await page.cookies();
    cookies = _.map(cookies, (cookie) => {
      return {
        name: cookie.name,
        value: cookie.value
      };
    });

    let token = sign({username, password, cookies});

    res.json({result, token});
  } else {
    res.status(422).json({error: result});
  }

  await page.close();
});

module.exports = router;
