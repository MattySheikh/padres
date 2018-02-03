* [Install brew](https://brew.sh/)
* Install sqlite
	* `brew install sqlite`
	* Note - I'm using sqlite 3.1.13
* Install nvm
	* `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash`
* Install and use node 8.9.3
	* `nvm install 8.9.3`
	* `nvm use`
* Install yarn
	* `brew install -g yarn`
* Install dependencies by running `yarn` from the repo root
* Run `yarn` to install dependencies
* Run `yarn watch` and you're all set! The server will restart automatically on file changes

* To import data
	* Drop `pitches.csv` into the root of this repo
	* Run `yarn run import /path/to/file.csv` to import the csv and split it into tables