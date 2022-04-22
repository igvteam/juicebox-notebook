##Development notes

#### Installing into a conda environment:

```bash
conda create -n juicebox_notebook python=3.9.1
conda activate juicebox_notebook
conda install pip
conda install jupyter
pip install -e .
```

#### Deploying to pypi

* Bump version number
*  Add version tag
*  Build the archive

```bash
rm -rf dist
python setup.py sdist bdist_wheel
```
* Upload to test.pypi

```bash
python -m twine upload --repository-url https://test.pypi.org/legacy/ dist/*
```

* Upload to pypi

```bash
python -m twine upload dist/*
```


**Installing from test.pypi**

```bash
pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple juicebox_notebook
```


### Example Notebook

[Colab example](https://colab.research.google.com/drive/1oLrDItsMZAEQmrsXa9A7MiiMjar0aagW?usp=sharing)