import requests

remote_url = "https://cdn.jsdelivr.net/npm/juicebox.js@2.2.1/dist/juicebox.min.js"

# Define the local filename to save data
local_file = '../juicebox_notebook/js/juicebox.min.js'

# Make http request for remote file data
data = requests.get(remote_url)

# Replace the UMD magic with a window global definition.  The UMD header is produced by rollup, this might need to be
# modified if rollup changes, but the basic idea is to assign the value returned by the factory function to "window.igv".

tmp = data.text.replace('function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).juicebox=e()}', 'function (global, factory) {window.juicebox = factory()}', 1)

# Save file data to local copy
with open(local_file, 'w')as file:
    file.write(tmp)
