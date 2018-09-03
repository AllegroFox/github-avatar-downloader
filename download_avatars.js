const request = require('request');
const secrets = require('./secrets')
const fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {


    var options = {
      url: "https://api.github.com/repos/" + repoOwner + "/" + repoName +"/contributors",
      headers: {
        'User-Agent': 'request',
        'Authorization': secrets.GITHUB_TOKEN
      }
    };

    request(options, function(err, res, body) {

        const info = JSON.parse(body)
        cb(err, info);

    });
  }

  function output(err, info) {

    info.forEach(function(user){
      const url = user.avatar_url;
      const filePath = `avatars/${user.login}.jpg`

      downloadImageByURL(url, filePath);
    })
  }

  function downloadImageByURL(url, filePath) {

    request.get(url)

       .on('error', function (err) {
         throw err;
       })

       .on('response', function (response) {
         console.log('Response Status Code: ', response.statusCode);
         console.log('Response Status Message: ', response.statusMessage);
         console.log('Response Headers: ', response.headers['content-type']);
         console.log('\n' + 'Downloading image...');
       })

       .on('end', function (end) {
         console.log('\n' + 'Download complete!')
       })


       .pipe(fs.createWriteStream(filePath));
}


const owner = process.argv[2];
const repo = process.argv[3];

if (owner && repo) {
  getRepoContributors(owner, repo, output);
} else {
  console.log('Please make sure you\'ve entered an owner and a repo in this format: <owner> <repo>');
}




