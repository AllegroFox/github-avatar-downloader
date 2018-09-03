const request = require('request');
const GITHUB_TOKEN = require('./secrets')
const fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName +"/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    var info = JSON.parse(body)
    cb(err, info);

  });
}

function output(err, info) {
  info.forEach(function(user){
    console.log(user.avatar_url);
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

downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg");
getRepoContributors("jquery", "jquery", output);