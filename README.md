# juicebox Jupyter Extension

[![Binder](https://beta.mybinder.org/badge.svg)](https://mybinder.org/v2/gh/igvteam/juicebox-jupyter/master?filepath=examples/BamFiles.ipynb)
=======


juicebox-jupyter is an extension for [Jupyter Notebook](http://jupyter.org/) which
wraps [juicebox-jupyter.js](https://github.com/igvteam/juicebox-jupyter.js). With this
extension you can render juicebox-jupyter.js in a cell and call its API from
the notebook. The extension exposes a python API that mimics the juicebox-jupyter.js 
Browser creation and control APIs. Dictionaries are used for browser and track 
configuration objects. Track data can be loaded from local or remote 
URLs, or supplied directly as lists of objects.

## Installation

Requirements:
* python >= 3.6.4
* jupyterlab >= 3.0


```bash
pip install juicebox-jupyter

# To install to configuration in your home directory
jupyter serverextension enable --py juicebox-jupyter
jupyter labextension enable juicebox-jupyter
jupyter nbextension install --py juicebox-jupyter
jupyter nbextension enable --py juicebox-jupyter


# If using a virtual environment
jupyter serverextension enable --py juicebox-jupyter --sys-prefix
jupyter labextension enable juicebox-jupyter --level sys_prefix
jupyter nbextension install --py juicebox-jupyter --sys-prefix
jupyter nbextension enable --py juicebox-jupyter --sys-prefix

```

## Usage

### Examples

Example notebooks are available in the github repository. To download without cloning the repository use 
this [link](https://github.com/igvteam/juicebox-jupyter.js-jupyter/archive/master.zip). Notebooks are available in the
"examples" directory.



### Initialization

To insert an IGV instance into a cell:

(1) create an juicebox-jupyter.Browser object,and (2) call showBrowser on the instance.

Example:

```python
import juicebox-jupyter

b = juicebox-jupyter.Browser({"genome": "hg19"})
```

The juicebox-jupyter.Browser initializer takes a configuration object which is converted to JSON and passed to the juicebox-jupyter.js
createBrowser function. The configuration object is described in the
[juicebox-jupyter.js documentation](https://github.com/igvteam/juicebox-jupyter.js/wiki/Browser-Configuration-2.0).


To instantiate the client side IGV instance in a cell call show()


```python
b.show()
```

### Tracks

To load a track pass a track configuration object to load_track(). Track configuration
objects are described in the [juicebox-jupyter.js documentation](https://github.com/igvteam/juicebox-jupyter.js/wiki/Tracks-2.0).
The configuration object will be converted to JSON and passed to the juicebox-jupyter.js browser
instance.

Data for the track can be loaded by URL or passed directly as an array of JSON objects.


#### Remote URL

```python
b.load_track(
    {
        "name": "Segmented CN",
        "url": "https://data.broadinstitute.org/igvdata/test/juicebox-jupyter-web/segmented_data_080520.seg.gz",
        "format": "seg",
        "indexed": False
    })

```

#### Local File

```python
b.load_track(
    {
        "name": "Local VCF",
        "url": "data/example.vcf",
        "format": "vcf",
        "type": "variant",
        "indexed": False
    })
```

#### Embedded Features

Features can also be passed directly to tracks.

```python
b.load_track({
    "name": "Copy number",
    "type": "seg",
    "displayMode": "EXPANDED",
    "height": 100,
    "isLog": True,
    "features": [
        {
            "chr": "chr20",
            "start": 1233820,
            "end": 1235000,
            "value": 0.8239,
            "sample": "TCGA-OR-A5J2-01"
        },
        {
            "chr": "chr20",
            "start": 1234500,
            "end": 1235180,
            "value": -0.8391,
            "sample": "TCGA-OR-A5J3-01"
        }
    ]
})
```

### Navigation

Zoom in by a factor of 2

```python
b.zoom_in()
```

Zoom out by a factor of 2

```python
b.zoom_out()
```

Jump to a specific locus

```python
b.search('chr1:3000-4000')

```

Jump to a specific gene. This uses the IGV search web service, which currently supports a limited number of genomes:  hg38, hg19, and mm10.
To configure a custom search service see the [juicebox-jupyter.js documentation](https://github.com/igvteam/juicebox-jupyter.js/wiki/Browser-Configuration-2.0#search-object-details)

```python
b.search('myc')

```

### SVG output

Saving the current IGV view as an SVG image requires two calls.

```python
b.get_svg()

b.display_svg()

```


### Events

**_Note: This is an experimental feature._**

```python

def locuschange(data):
    b.locus = data

    b.on("locuschange", locuschange)

    b.zoom_in()

    return b.locus

```

#### Development

To build and install from source:

```bash
pip install jupyter_packaging
python setup.py build
pip install -e .
jupyter labextension develop . --overwrite
jupyter nbextension install --py juicebox-jupyter --symlink
jupyter nbextension enable --py juicebox-jupyter
```

After source changes, the extension can be rebuilt using:

```bash
jupyter labextension build .
```

Creating a conda environment
```bash
conda create -n test python=3.7.1
conda activate test
conda install pip
conda install jupyter

```
