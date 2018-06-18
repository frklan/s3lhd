'use strict';
const minimist = require('minimist')

module.exports = () => {
  const args = minimist(process.argv.slice(2))
  let cmd;
  let files = args._;
  
  if(args.version || args.v) {
    cmd = 'version';
  } else if(args.help || args.h) {
    cmd = 'help';
  } else if(files === undefined || files.length === 0) {
    cmd = 'pipeUpload';
  } else {
    cmd = 'fileUpload';
  }
  

  switch (cmd) {  
    case 'version':
      require('./cmds/version')(args)
      break

    case 'help':
      require('./cmds/help')(args)
      break

    case 'fileUpload':
      require('./cmds/fileUpload')(files, args);
      break
      
    case 'pipeUpload':
      require('./cmds/pipeUpload')(files, args);
      break

    default:
      console.error(`"${cmd}" is not a valid command!`)
      break
  }
}

