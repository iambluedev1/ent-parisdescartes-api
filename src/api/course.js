const express = require('express');
const router = express.Router();
const {verify} = require('../jwt');
const fetch = require('node-fetch');
const _ = require('lodash');

router.get('/my-courses', verify, async (req, res) => {
  fetch('https://ent.parisdescartes.fr/api/moodle-rest/mycourse', {
    headers: {
      cookie: req.userCookies
    }
  })
    .then(response => response.json())
    .then(json => {
      res.json({
        courses: _.map(json.data[0].courses, (course) => {
          return {
            id: parseInt(course.id),
            name: course.fullName
          };
        })
      });
    });
});

module.exports = router;
