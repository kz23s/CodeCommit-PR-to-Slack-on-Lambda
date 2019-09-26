const request = require('request');

var slack_webhook_url = '';
var slack_channel  = '';

exports.handler = function(event, context) {

  var message = event.Records[0].Sns.Message;
  var url = message.match(/go to the AWS CodeCommit console (.+)\"/)[1];

  if ( message.match(/The pull request was created with the following information/) ) {
    var tmp = message.match(/CodeCommit repository: (.+)\. (.+) made the following PullRequest/);
    var repo   = tmp[1];
    var author = tmp[2];
    var post_message = author + ' が ' + repo + ' にプルリクを送ったよ。 \n'  + url;
  }
  else if ( message.match(/made a comment or replied to a comment/) ) {
    var tmp = message.match(/CodeCommit repository: (.+)\. (.+) made a comment or replied to a comment/);
    var repo   = tmp[1];
    var author = tmp[2];
    var post_message = author + ' が ' + repo + ' のプルリクにコメントを付けたよ。 \n'  + url;
  }
  else if ( message.match(/The pull request merge status has been updated. The status is merged./) ) {
    var tmp = message.match(/CodeCommit repository: (.+)\. (.+) updated the following PullRequest/);
    var repo   = tmp[1];
    var author = tmp[2];
    var post_message = author + ' が ' + repo + ' のプルリクをマージしたよ。 \n'  + url;
  }
  else if ( message.match(/The pull request status has been updated. The status is closed./) ) {
    var tmp = message.match(/CodeCommit repository: (.+)\. (.+) updated the following PullRequest/);
    var repo   = tmp[1];
    var author = tmp[2];
    var post_message = author + ' が ' + repo + ' のプルリクをクローズしたよ。 \n'  + url;
  }
  else {
    var post_message = 'Other event occured. ' + url;
  }

  const options = {
    url: slack_webhook_url,
    headers: {
      'Content-type': 'application/json'
    },
    body: {
      "text": post_message,
      "channel": slack_channel
    },
    json: true
  };

  request.post(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('success');
    } else {
      console.log('error: ' + response.statusCode);
    }
  });
};
