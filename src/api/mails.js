const {verify} = require('../jwt');
const fetch = require('node-fetch');
const _ = require('lodash');

module.exports = (router) => {
  router.get('/my-emails', verify, async (req, res) => {
    fetch('https://ent.parisdescartes.fr/api/owa-rest/mail-owa', {
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
          emails: _.map(json.data.ResponseMessages.FindItemResponseMessage[0].RootFolder.Items.Message, (email) => {
            return {
              bcc: email.BccRecipients === null ? null : {
                name: email.From.BccRecipients.Name,
                address: email.From.BccRecipients.EmailAddress
              },
              cc: email.CcRecipients === null ? null : {
                name: email.From.CcRecipients.Name,
                address: email.From.CcRecipients.EmailAddress
              },
              from: {
                name: email.From.Mailbox.Name,
                address: email.From.Mailbox.EmailAddress
              },
              subject: email.Subject,
              read: email.IsRead,
              priority: email.Sensitivity,
              at: email.DateTimeSent
            };
          })
        });
      });
  });
};
