
# juicebox notebook module

[![Binder](https://beta.mybinder.org/badge.svg)](https://mybinder.org/v2/gh/igvteam/juicebox-notebook/main?filepath=examples)
=======

juicebox-notebook is a module for Jupyter and Colab notesbooks which exposes a python API that 
enables creation and interaction with a [juicebox.js](https://github.com/igvteam/juicebox.js) instance in a cell.  

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
b = juicebox.Browser({
        "name": "GM12878",
        "url": "https://www.encodeproject.org/files/ENCFF179HVU/@@download/ENCFF179HVU.hic",
        "tracks": [
            {
                "url": "https://www.encodeproject.org/files/ENCFF000ARJ/@@download/ENCFF000ARJ.bigWig",
                "name": "CTCF",
                "color": "rgb(22, 129, 198)"
            }
        ]
    }
)
```

The juicebox.Browser initializer takes a configuration object which is converted to JSON and passed to the juicebox.js
createBrowser function.   The configuration object is described in the
[juicebox.js documentation](https://github.com/igvteam/juicebox.js#usage).  To open an empty "browser" to dynamically
load maps pass an empty dictionary

## Maps

To load a map into an existing browser pass a hic file configuration object to the load_map function

```python
import juicebox
juicebox.init()
b = juicebox.Browser({})
b.load_map(
    {
         "url": "https://hicfiles.s3.amazonaws.com/hiseq/gm12878/in-situ/primary.hic"
    }
)
```

## Tracks

To load a track pass a track configuration object to load_track.  Track configuration
objects are described in the [juicebox.js documentation](https://github.com/igvteam/juicebox.js#usage).
The configuration object will be converted to JSON and passed to the juicebox.js browser
instance.

```python
import juicebox
juicebox.init()
b = juicebox.Browser({
        "name": "GM12878",
        "url": "https://www.encodeproject.org/files/ENCFF179HVU/@@download/ENCFF179HVU.hic"
    }
)

b.load_track({
    "url": "https://www.encodeproject.org/files/ENCFF000ARJ/@@download/ENCFF000ARJ.bigWig",
    "name": "CTCF",
    "color": "#ff8802"
  }
)
```

## Live Google Colab Notebook README
This notebook demonstrates the use of juicebox-notebook in Google Colob
[Juicebox Notebook Live README](https://colab.research.google.com/drive/1eHeavVN1m6SvF7dvXInnJD3aIVnMCIry?usp=sharing)


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




