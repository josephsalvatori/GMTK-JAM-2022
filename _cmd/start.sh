#!/bin/bash
shopt -s nocasematch

# Get current OS and working directory
export DIR=$(builtin cd ../ && pwd -L)
export OSCHECK=$(uname -s)

if [ "$1" = "prod" ]
then

	# Deploy Production
	if [ -f "${DIR}/.env" ]
	then
		# Load Environment Variables
		export $(cat ${DIR}/.env | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}' )
	fi
	
	export NODE_ENV="production"

else

	# Deploy Development
	if [ -f "${DIR}/.env.development" ]
	then
		# Load Environment Variables
		export $(cat ${DIR}/.env.development | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}' )
	fi
	
	export NODE_ENV="development"

fi

# Let's move to our project root
cd "${DIR}"

# OS operations for running the project
case "$OSCHECK" in
	# LINUX
	linux*)

		echo "linux scripts aren't written yet, run watches manually"

		;;

	# OSX
	darwin*)

		echo "osx scripts aren't written yet, run watches manually"

		;;

	# WINDOWS
	msys* | mingw*)

		# Open CMD and start watch process
		start cmd.exe //c "npm run watch"

		# Now let's run our shopify theme
		cd "${DIR}/build"

		# Open a chrome browser window
		start chrome --incognito 127.0.0.1:3000

		# Start our serve and open sync with the editor 
		node app.js
	
		;;

	# UNKNOWN
	*)

		echo "unknown OS, run watches manually"
		
		;;
esac