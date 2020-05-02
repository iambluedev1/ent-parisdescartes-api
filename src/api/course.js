const {verify} = require('../jwt');
const {fetch, error} = require('../util/fetch');
const _ = require('lodash');

module.exports = (router) => {
  router.get('/my-courses', verify, async (req, res) => {
    fetch('https://ent.parisdescartes.fr/api/moodle-rest/mycourse', req, res)
      .then(json => {
        res.json({
          courses: _.map(json.data[0].courses, (course) => {
            return {
              id: parseInt(course.id),
              name: course.fullName
            };
          })
        });
      })
      .catch(e => error(e, req, res));
  });
};

