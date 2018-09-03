const request = require('request');
const secrets = require('./secrets')
const fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');


//main function; creates the url to be visited
function getRepoContributors(repoOwner, repoName, cb) {


    var options = {
      url: "https://api.github.com/repos/" + repoOwner + "/" + repoName +"/contributors",
      headers: {
        'User-Agent': 'request',
        'Authorization': secrets.GITHUB_TOKEN
      }
    };


//makes the request, parses the result into a JSON object, & passes that object to the callback function
    request(options, function(err, res, body) {

        const info = JSON.parse(body)
        cb(err, info);

    });
  }


//callback function; loops over the JSON object and runs downloadImageByURL on each key
  function output(err, info) {

    info.forEach(function(user){
      const url = user.avatar_url;
      const filePath = `avatars/${user.login}.jpg`

      downloadImageByURL(url, filePath);
    })
  }


//downloads each file and writes it to the local directory
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

//takes user input
const owner = process.argv[2];
const repo = process.argv[3];

//if loop to verify that input exists
if (owner && repo) {
  getRepoContributors(owner, repo, output);
} else {
  console.log('Please make sure you\'ve entered an owner and a repo in this format: <owner> <repo>');
}




