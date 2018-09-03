const request = require('request');
const GITHUB_TOKEN = require('./secrets')

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

getRepoContributors("jquery", "jquery", output);