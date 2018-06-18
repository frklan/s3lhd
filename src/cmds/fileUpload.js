'use strict'

const fs = require('fs');
const mime = require('mime-types');
const path = require('path');
const uploader = require('../s3uploader');

module.exports = async (files, args) => {
    if(files.length > 0) {
      files.forEach(file => {
        const options = extractOptions(file, args);
        if(options != null) {
          uploadFile(String(file), options);
        }
      });
    } else {
      console.error('No input file, unable to continue.');
      return -1;
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
  
  options.awsBucket = args.awsbucket || null;
  if(options.awsBucket == null) {
    console.error('AWS bucket not defined, can\'t continue.');
    return null;
  }
  console.log(`Receiving bucket is ${options.awsBucket}`);

  /* The following are optional and will be set to default values if the user don't care */
  options.contentType = args.contenttype  || mime.lookup(localFile) || 'application/octet-stream';
  console.log(`Content type: ${options.contentType}`);
  
  options.awsPath =  path.join(args.awsdir || '/', options.file);
  console.log(`AWS path: ${options.awsPath}`);

  options.acl = args.awsacl || 'public-read';
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