const menu = {
  main: `
    s3lhd [file] <options>

    --version || -v              show package version
    --help || -h                 show this help
    --contenttype                media type (mime type) of uploaded file, exlude to auto detect
    --awsbucket                  which AWS S3 bucket to upload to
    --awsfile                    remote filename, only valid for piped upload
    --awsdir                     remote directory to upload to
    --awsacl                     remote access for uploaded file, defalts to \'public-read\'
    `,

}

module.exports = (args) => {
  console.log(menu.main)
}