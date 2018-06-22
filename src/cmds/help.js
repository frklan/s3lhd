const menu = {
  main: `
  usage: s3lhd [--version] [--help]
               <command> [<args>]

  These are the available commands, see s3lhd help [command] for details.

    upload                       upload file(s) to AWS S3 bucket
    version                      show version string
    `,

    upload: `
  s3lhd upload <file> <options>

    Uploads one or more files to a specified AWS S3 bucket. Wildcards are allowed.

    --contenttype                media type (mime type) of uploaded file, exlude to auto detect
    --awsbucket                  which AWS S3 bucket to upload to
    --awsfile                    remote filename, only valid for piped upload
    --awsdir                     remote directory to upload to upload to
    --awsacl                     remote access for uploaded file, defalts to \'public-read\'
    `

}

module.exports = (args) => {
  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0]

  console.log(menu[subCmd] || menu.main);
}