# S3LHD
[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](https://github.com/frklan/s3lhd/blob/master/LICENSE)

**N.B. Still in Beta! Beware of bugs and unexpected behaviour.**

A simple CLI app for easy file upload to an AWS S3 bucket. Created mainly to make it easy to upload images from a raspberry pi camera without having any writes to the SD card.

## Running the app

### Prerequisites

* NodeJS

### Running

1. Create an AWS S3 credetial file in  ````~/.aws/credentials````containing:

		[default]
		aws_access_key_id = <YOUR-ACCESS_KEY>
		aws_secret_access_key = <YOUR-SECRET-AWS-KEY>

2. Install the app with ````$npm install s3lhd -g````

3. run ```$ s3lhd [local file]  --awsbucket [aws bucket name]```


You can also read the local file from stdin, e.g. to upload camera images from an raspberry pi:

	$ /opt/vc/bin/raspistill -o - | s3lhd --awsbucket [aws bucket name] --awsfile photo.jpg

## TODO's

- [ ] Read config from file
  - [ ] AWS access key and secret
  - [ ] bucket name
- [ ] Improved error handling
 
  
## Contributing

Contributions are always welcome!

When contributing to this repository, please first discuss the change you wish to make via the issue tracker, email, or any other method with the owner of this repository before making a change.

Please note that we have a code of conduct, you are required to follow it in all your interactions with the project.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/frklan/s3lhd/tags).

## Authors

* **Fredrik Andersson** - *Initial work* - [frklan](https://github.com/frklan)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details