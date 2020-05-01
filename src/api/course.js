const {verify} = require('../jwt');
const fetch = require('node-fetch');
const _ = require('lodash');

module.exports = (router) => {
  router.get('/my-courses', verify, async (req, res) => {
    fetch('https://ent.parisdescartes.fr/api/moodle-rest/mycourse', {
      headers: {
        cookie: req.userCookies
      }
    })
      .then(response => response.json())
      .then(json => {
        if (json.success === false) {
          return res.status(403).json({error: json.flashMessages.error});
        }

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
};

