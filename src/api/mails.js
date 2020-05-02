const {verify} = require('../jwt');
const {fetch, error} = require('../util/fetch');
const _ = require('lodash');

module.exports = (router) => {
  router.get('/my-emails', verify, async (req, res) => {
    fetch('https://ent.parisdescartes.fr/api/owa-rest/mail-owa', req, res)
      .then(json => {
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
      })
      .catch(e => error(e, req, res));
  });
};
