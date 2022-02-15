
# juicebox Jupyter Extension

[![Binder](https://beta.mybinder.org/badge.svg)](https://mybinder.org/v2/gh/igvteam/juicebox-jupyter/master?filepath=examples/LoadMap.ipynb)
=======


juicebox is an extension for [Jupyter Notebook](http://jupyter.org/) which
wraps [juicebox.js](https://github.com/igvteam/juicebox.js).  With this
extension you can render juicebox.js in a cell and call its API from
the notebook. The extension exposes a python API that mimics the juicebox.js 
Browser creation and control APIs.   Dictionaries are used for browser and track 
configuration objects.   Track data can be loaded from local or remote 
URLs,  or supplied directly as lists of objects.

## Installation

Requirements:
* python >= 3.6.4
* jupyter >= 4.2.0


```bash
pip install juicebox

# To install to configuration in your home directory
jupyter serverextension enable --py juicebox
jupyter nbextension install --py juicebox
jupyter nbextension enable --py juicebox


# If using a virtual environment
jupyter serverextension enable --py juicebox --sys-prefix
jupyter nbextension install --py juicebox --sys-prefix
jupyter nbextension enable --py juicebox --sys-prefix

```

## Initialization

To insert a juicebox instance into a cell:  

(1) create an juicebox.Browser object,and (2) call showBrowser on the instance.

Example:

```python
import juicebox

b = juicebox.Browser({})
```

The juicebox.Browser initializer takes a configuration object which is converted to JSON and passed to the juicebox.js
createBrowser function.   The configuration object is described in the
[juicebox.js documentation](https://github.com/igvteam/juicebox.js#usage).  To open an empty "browser" to dynamically
load maps pass an empty dictionary


To instantiate the client side juicebox instance in a cell call show()


```python
b.show()
```

## Maps

To load a map pass a hic file configuration objec to load_map

```python
b.load_map(
    {
         "url": "https://hicfiles.s3.amazonaws.com/hiseq/gm12878/in-situ/primary.hic"
    }
)
```

## Tracks

To load a track pass a track configuration object to load_track().  Track configuration
objects are described in the [juicebox.js documentation](https://github.com/igvteam/juicebox.js#usage).
The configuration object will be converted to JSON and passed to the juicebox.js browser
instance.


**Example: remote URL**

```python
b.load_track(
    {
    "url": "https://www.encodeproject.org/files/ENCFF000ARJ/@@download/ENCFF000ARJ.bigWig",
    "name": "CTCF",
    "color": "#ff8802"
    }
)
```

**Example: local file**

Tracks can be loaded from local files using the Jupyter web server by prepending "files" to the path.  The path
is relative to the notebook file.  

```python

b.load_track(
    {
    "url": "files/data/ENCFF000ARJ.bigWig",
    "name": "CTCF",
    "color": "#ff8802"
    }
)
```



### Development

#### Update juicebox.js from NPM, or elsewhere.

(1) Edit script updateJuicebox.sh as needed to download juicebox.js, or juicebox.min.js.  Note: Mush use the AMD module, not ES6
(2) Update manual load of corresponding juicebox.css in juicebox/static/extension.js as needed

```bash
./updateJuicebox.sh

```


#### Creating a conda environment:
```bash
conda create -n juicebox python=3.9.1
conda activate juicebox
conda install pip
conda install jupyter
```

#### Build and install from source:

```bash
python setup.py build
pip install -e .
jupyter nbextension install --py juicebox
jupyter nbextension enable --py juicebox
```

#### To rebuild after code changes

./rebuild.sh

#### If you need a clean start, this is python after all
```bash
conda deactivate
conda env remove -n juicebox
```



