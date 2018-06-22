'use strict'

const AWS = require('aws-sdk');
const spinner = require('ora')();

module.exports.uploadToS3 = async (data, options) => {
  if(data.length === 0) {
    console.log('No data, creating empty file.');
  }
  spinner.start();

  var s3 = new AWS.S3();
  const params = {Bucket: options.awsBucket, Key: options.awsPath, Body: data, ContentType: options.contentType,  ACL: options.acl};

  s3.putObject(params, function(err, data) {
      if (err) {
        spinner.stop();
        console.log(err);
        return -1;
      }
      spinner.stop();
  });
}