'use strict';
const minimist = require('minimist')

module.exports = () => {
  const args = minimist(process.argv.slice(2))
  let cmd = args._[0] || 'help';
  let files = args._.slice(1);

  //console.log(`cmd = ${cmd}`);
  //console.log(`files = ${files}`);

  if(args.version || args.v) {
    cmd = 'version';
  } else if(args.help || args.h) {
    cmd = 'help';
  } 
  
  switch (cmd) {  
  case 'version':
    require('./cmds/version')(args)
    break

  case 'help':
    require('./cmds/help')(args)
    break

  case 'upload':
    require('./cmds/upload')(files, args);
    break
    
  default:
    console.error(`"${cmd}" is not a valid command!`)
    break
  }
}

