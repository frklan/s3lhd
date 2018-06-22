'use strict'

const fs = require('fs');
const mime = require('mime-types');
const path = require('path');
const uploader = require('./subcmds/s3uploader');
const pipeUploader = require('./subcmds/uploadFromPipe');

module.exports = async (files, args) => {
    if(files.length < 1) { // source file not spec'd, expect read data from stdin
      pipeUploader(args);
    } else {
      files.forEach(file => {
        const options = extractOptions(file, args);
        if(options != null) {
          uploadFile(String(file), options);
        }
      });
    } 
}

function extractOptions(localFile, args) {
  let options = {};
  
  /* Unused option when dealing with files */
  if(args.awsfile != null) {
    console.error('Ignoring --awsfile ..');
  }
  
  /* Mandatory options */ 
  
  console.log(`Local file: ${localFile}`);
  options.file = path.basename(localFile);
  console.log(`Remote file: ${options.file}`);
  
  options.awsBucket = String(args.awsbucket);
  if(options.awsBucket == undefined) {
    console.error('AWS bucket not defined, can\'t continue.');
    return null;
  }
  console.log(`Receiving bucket is ${options.awsBucket}`);

  /* The following are optional and will be set to default values if the user don't care */
  options.contentType = String(args.contenttype  || mime.lookup(localFile) || 'application/octet-stream');
  console.log(`Content type: ${options.contentType}`);
  
  options.awsPath =  path.join(String(args.awsdir || ''), options.file);
  console.log(`AWS path: ${options.awsPath}`);
  if(options.awsPath[0] === '/') {
    console.error('I will accept remote paths starting with \'/\', however it might not be what you want!');
  }
  
  options.acl = String(args.awsacl || 'public-read');
  console.log(`access is: ${options.acl}`);

  return options;
}

async function uploadFile(file, options) {
  const localFile = String(file);

  console.log(`Uploading ${localFile}`);
  
  if(!fs.existsSync(localFile)) {
    console.error(`Skipping, ${localFile} does not exists.`);
    return;
  }

  if(!fs.statSync(localFile).isFile()) {
    console.error('Skipping, I only know how to upload regular files.');
    return;
  }

  fs.readFile(localFile, function (err, data) {
    if (err) { 
      throw err; 
    }
    uploader.uploadToS3(data, options);
  });
}