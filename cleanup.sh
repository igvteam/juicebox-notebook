#!/bin/bash

set -o verbose

cd dist
rm -rf *
cd ../build
rm -rf *
cd ..
rm -fr juicebox_jupyter.egg-info
