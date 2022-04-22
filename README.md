
# juicebox notebook module

[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/igvteam/juicebox-notebook/main?filepath=examples)   _**Jupyter Notebook**_

[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/igvteam/juicebox-notebook/main?urlpath=lab/tree/examples)  _**JupyterLab**_

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1ebC3QUJiDGNUON34V2O99cGIdc11D3D5?usp=sharing)

----

juicebox-notebook is an module for Jupyter and Colab notesbooks which exposes a python API that 
enables creation and interaction with a [juicebox.js](https://github.com/igvteam/juicebox.js) instance in a cell.  

### Examples

Example notebooks are available in the github repository in the "examples" directory of the [github repository](https://github.com/igvteam/juicebox-notebook/tree/main/examples).

## Installation

Requirements:
* python >= 3.6.4
* jupyter >= 4.2.0

```bash
pip install juicebox-notebook
```

### Initialization

After installing import and intialize igv_notebook as follows. 

```python
import juicebox_notebook
juicebox_notebook.init()
```
For a Jupyter notebook this should be done once per notebook.   Colab notebooks display output in a sandboxed iFrame 
for each cell, so these steps must be repeated for each cell in which  juicebox-notebook is used.


### Browser creation

The juicebox_notebook.Browser constructor takes a configuration object which is converted to JSON and passed to the juicebox.js
createBrowser function.   The configuration object is described in the
[juicebox.js documentation](https://github.com/igvteam/juicebox.js#usage).  To open an empty "browser" to dynamically
load maps pass an empty dictionary.

**Example:**

```python
import juicebox_notebook
juicebox_notebook.init()
b = juicebox_notebook.Browser(
    {
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




### Dynamically loading maps and tracks

Typically maps and tracks are loaded in the initial ```juicebox.Browser``` creation.  However its also possible to 
load them post creation using the ```b.load_map(config``` and ```b.load_track``` functions.  


**Maps**

To load a map into an existing browser pass a hic file configuration object to the load_map function

```python
import juicebox_notebook
juicebox_notebook.init()
b = juicebox_notebook.Browser({})
b.load_map(
    {
         "url": "https://hicfiles.s3.amazonaws.com/hiseq/gm12878/in-situ/primary.hic"
    }
)
```

**Tracks**

To load a track pass a track configuration object to load_track.  Track configuration
objects are described in the [juicebox.js documentation](https://github.com/igvteam/juicebox.js#usage).
The configuration object will be converted to JSON and passed to the juicebox.js browser
instance.



```python
import juicebox_notebook
juicebox_notebook.init()
b = juicebox_notebook.Browser({
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


### URLS and paths

Configuration objects for juicebox.js maps (.hic files) and tracks have properties to specify URLs to files for 
data and indexes.  These properties are  supported in juicebox-notebook, however juicebox-notebook also provides 
equivalent ```path``` properties for specfiying paths to  local files when used with Jupyter Notebook or Colab.  
The ```path``` properties are useful for

1. Loading data in a Colab notebook from the local Colab file system or a mounted Google Drive
1. Loading data in Jupyter Notebook from the local file system that is outside the Jupyter file tree. 


**URL and Path properties**

| juicebox.js url property  | juicebox-notebook path property | notes
| --------- | ----------- | -------- |
| url  | path |
| indexURL | indexPath | Used in some track configurations.  See [igv.js](https://github.com/igvteam/igv.js/wiki)


(_**Note**_: The ```path``` properties cannot be used with JupyterLab, however local files can
be loaded by URL).

For Jupyter servers (Notebook and Lab) local files can be also be loaded via the url property if the file is in 
Jupyter  directory tree.  This will usually yield better performance than using ```path``` properties.  URLs that begin 
with a "/" are relative to the Jupyter server startup directory, that is the directory from where you started 
Jupyter Notebook or JupyterLab.  URL paths without a leading slash are assumed to be relative to the notebook directory.  
See below for examples.  You can also use the JupyterLab "download url" for the file, obtainable through the JupyterLab UI, as the 
URL for juicebox.


**Examples:** 

----

Jupyter Notebook and Colab.  Local files using absolute file paths, potentially outside the Jupyter file tree.  Note the use 
of ```path``` instead of ```url```.

```python
import juicebox_notebook

juicebox_notebook.init()
b = juicebox_notebook.Browser(
    {
        "name": "GM12878",
        "path": "/TestData/juicebox/HCT-116_Untreated.hic",
        "tracks": [
            {
                "path": "/TestData/juicebox/CTCF_Untreated.bw",
                "type": "wig",
                "name": "CTCF",
                "color": "rgb(22, 129, 198)"
            }
        ]
    }
)
```

----

Jupyter Notebook and JupyterLab.  Local files using urls relative to the startup directory of the Jupyter server. 

```python
import juicebox_notebook

juicebox_notebook.init()
b = juicebox_notebook.Browser(
    {
        "name": "GM12878",
        "url": "/TestData/juicebox/HCT-116_Untreated.hic",
        "tracks": [
            {
                "url": "/TestData/juicebox/CTCF_Untreated.bw",
                "type": "wig",
                "name": "CTCF",
                "color": "rgb(22, 129, 198)"
            }
        ]
    }
)
```
----

Jupyter Notebook and Lab. Local files using urls relative to the directory of the notebook.

```python
import juicebox_notebook

juicebox_notebook.init()
b = juicebox_notebook.Browser(
    {
        "name": "GM12878",
        "url": "TestData/juicebox/HCT-116_Untreated.hic",
        "tracks": [
            {
                "path": "TestData/juicebox/CTCF_Untreated.bw",
                "type": "wig",
                "name": "CTCF",
                "color": "rgb(22, 129, 198)"
            }
        ]
    }
)
```
----

All platforms. Remote files using urls.

```python
import juicebox_notebook
juicebox_notebook.init()
b = juicebox_notebook.Browser(
    {
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


