#!/bin/bash

# Unlike eslint-watch, this script will always perform a full lint check.

GREEN=`tput setaf 2`
RESET=`tput sgr0`
echo "Running eslint..."
eslint --max-warnings 0 --ext 'js,jsx,ts,tsx' src/ --color && echo "${GREEN}✔ Lint passed${RESET}"
