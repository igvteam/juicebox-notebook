
# juicebox Jupyter Extension

[![Binder](https://beta.mybinder.org/badge.svg)](https://mybinder.org/v2/gh/igvteam/juicebox-jupyter/main?filepath=examples)
=======


juicebox is an module for [Jupyter Notebook](http://jupyter.org/) which
wraps [juicebox.js](https://github.com/igvteam/juicebox.js).  The module exposes a python API that 
enables creation and interaction with a juicebox.js instance in a cell.  

## Installation

Requirements:
* python >= 3.6.4
* jupyter >= 4.2.0

```bash
pip install juicebox
```

## Initialization

To insert a juicebox instance into a cell:  


Example:

```python
import juicebox
juicebox.init()
b = juicebox.Browser({})
```

The juicebox.Browser initializer takes a configuration object which is converted to JSON and passed to the juicebox.js
createBrowser function.   The configuration object is described in the
[juicebox.js documentation](https://github.com/igvteam/juicebox.js#usage).  To open an empty "browser" to dynamically
load maps pass an empty dictionary


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
```

#### If you need a clean start, this is python after all
```bash
conda deactivate
conda env remove -n juicebox
```

```bash
./updateJuicebox.sh

```



