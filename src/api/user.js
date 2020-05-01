const {verify} = require('../jwt');
const fetch = require('node-fetch');

module.exports = (router) => {
  router.get('/me', verify, async (req, res) => {
    fetch('https://ent.parisdescartes.fr/api/info-rest', {
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
          user: {
            uid: json.infoUser.uid[0],
            firstName: json.infoUser.cn[0].split(' ')[1].trim().toLowerCase(),
            lastName: json.infoUser.cn[0].split(' ')[0].trim().toLowerCase(),
            birthDay: [json.infoUser.p5birthday[0].slice(6, 8), json.infoUser.p5birthday[0].slice(4, 6), json.infoUser.p5birthday[0].slice(0, 4)].join('-'),
            gender: json.infoUser.title[0] === 'Monsieur' ? 'man' : 'woman',
          },
          mails: {
            addresses: {
              main: json.infoUser.mail[0],
              alternate: json.infoUser.mailalternateaddress[0],
              personal: json.infoUser.supannmailperso[0]
            },
            host: json.infoUser.mailhost[0]
          },
          establishment: {
            name: json.infoUser.ou[0],
            job: json.infoUser.edupersonprimaryaffiliation
          }
        });
      });
  });
};
