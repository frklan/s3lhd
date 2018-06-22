'use strict'

const fs = require('fs');
const mime = require('mime-types');
const path = require('path');
const uploader = require('./subcmds/s3uploader');
const pipeUploader = require('./subcmds/uploadFromPipe');
const List = require("collections/list");
const chalk = require('chalk');

module.exports = async (files, args) => {
    if(files.length < 1) { // source file not spec'd, expect read data from stdin
      pipeUploader(args);
    } else { // we have a list of files as args (possibly including subdir names)
      let fileList = [];
      if(args.r) { // do we traverese down in subdirs?
        fileList = (await buildRecursiveFileList(files, '')).toArray();
      } else { // no.
        fileList = (await buildFileList(files)).toArray();
      }
      await uploadFiles(fileList, args); // upload all files!
    } 
}

async function buildRecursiveFileList(files, parent) {
  let fileList = new List() ;

  files.forEach(async (file) => {
    file = path.join(parent, file);
    
    if(!fs.existsSync(file)) { return; }

    if(fs.statSync(file).isDirectory()) {
      let subDirContent = fs.readdirSync(file);
      fileList.addEach(await buildRecursiveFileList(subDirContent, file));
    } else {
      fileList.push(file);
    }
  });
  return fileList;
}

async function buildFileList(files) {
  let fileList = new List() ;

  files.forEach(async (file) => {

    if(!fs.existsSync(file)) { return; }

    if(!fs.statSync(file).isDirectory()) {
      fileList.push(file);
    }
  });
  return fileList;
}

function extractOptions(localFile, args) {
  let options = {};
  
  /* Unused option when dealing with files */
  if(args.awsfile != null) {
    console.error('Ignoring --awsfile ..');
  }
  
  /* Mandatory options */ 
  
  //console.log(`Local file: ${localFile}`);
  options.file = localFile;
  //console.log(`Remote file: ${options.file}`);
  
  options.awsBucket = String(args.awsbucket);
  if(options.awsBucket === 'undefined') {
    console.error(('AWS bucket not defined, can\'t continue.'));
    process.exit(-1);
  }
  //console.log(`Receiving bucket is ${options.awsBucket}`);

  /* The following are optional and will be set to default values if the user don't care */
  options.contentType = String(args.contenttype  || mime.lookup(localFile) || 'application/octet-stream');
  //console.log(`Content type: ${options.contentType}`);
  
  options.awsPath =  path.join(String(args.awsdir || ''), options.file);
  //console.log(`AWS path: ${options.awsPath}`);
  if(options.awsPath[0] === '/') {
    console.error(chalk.yellow('I will accept remote paths starting with \'/\', however it might not be what you want!'));
  }
  
  options.acl = String(args.awsacl || 'public-read');
  //console.log(`access is: ${options.acl}`);

  return options;
}

async function uploadFiles(files, args) {
  await files.forEach(async (file) => {
    console.log(`Uploading: ${chalk.green(file)}`);  

    if(!fs.existsSync(file)) {
      console.error(chalk.red(`Skipping, ${file} does not exists.`));
      return;
    }

    if(!fs.statSync(file).isFile()) {
      console.error(chalk.red(`Skipping ${file}, I only know how to upload regular files.`));
      return;
    }

    await uploader.uploadToS3(fs.readFileSync(file), extractOptions(file, args));
  });
}