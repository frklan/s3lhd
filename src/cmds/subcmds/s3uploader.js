'use strict'

const AWS = require('aws-sdk');
const chalk = require('chalk');

module.exports.uploadToS3 = async (data, options) => {
  if(data.length === 0) {
    console.error('No data, creating empty file.');
  }

  var s3 = new AWS.S3();
  const params = {Bucket: options.awsBucket, Key: options.awsPath, Body: data, ContentType: options.contentType,  ACL: options.acl};
  s3.putObject(params, function(err, data) {
      if (err) {
        console.error(chalk.red(`Error uploading ${options.awsPath} (${err.message})`) );
        return;
      }
  });
}