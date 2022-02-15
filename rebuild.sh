#!/bin/bash

# Use this script to do a clean rebuild

set -o verbose

rm -fr dist
rm -fr build
rm -fr juicebox.egg-info

python setup.py install
pip install -e .

jupyter nbextension install --py juicebox
jupyter nbextension enable --py juicebox
