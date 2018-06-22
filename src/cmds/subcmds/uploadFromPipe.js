'use strict'

const spawn = require('child_process').spawn;
const AWS = require('aws-sdk');
const fs = require('fs');
const mime = require('mime-types');
const path = require('path');
const uploader = require('./s3uploader');

module.exports = async (args) => {
  const options = extractOptions(args);
  if(options === null)
    return -1;

  uploadDataFromPipe(options);
}

function extractOptions(args) {
  let options = {};

  /* Mandatory options: */

  options.file = args.awsfile || null;
  if(options.file === null) {
    console.error("remote file not defined");
    return null;
  }
  console.log(`Remote file: ${options.file}`);
  
  options.awsBucket = args.awsbucket || null;
  if(options.awsBucket == null) {
    console.error('AWS bucket not defined, can\'t continue.');
    return null;
  }
  console.log(`Receiving bucket is ${options.awsBucket}`);

  /* The following are optional and will be set to default values if the user don't care */
  options.contentType = args.contenttype  || mime.lookup(options.file) || 'application/octet-stream';
  console.log(`Content type: ${options.contentType}`);
  
  options.awsPath =  path.join(args.awsdir || '/', path.basename(options.file));
  console.log(`AWS path: ${options.awsPath}`);

  options.acl = args.awsacl || 'public-read';
  console.log(`access is: ${options.acl}`);

  return options;
}


async function uploadDataFromPipe(options) {
  let data = Buffer.alloc(0);

  process.stdin.on('data', (chunk) => {
    //console.log(chunk);
    let tempdata = Buffer.alloc(data.length + chunk.length);
    data.copy(tempdata, 0);
    chunk.copy(tempdata, data.length);
    data = tempdata;
  });
  
  process.stdin.on('end', function () {
    //save(data, options);
    uploader.uploadToS3(data, options);
  });
}

// Test method to save local copy
function save(data, options) {
  fs.writeFileSync(options.awsPath, data);
}