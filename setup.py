import setuptools

with open("README.md", "r") as fh:
    long_description =  fh.read()

setuptools.setup(name='juicebox-notebook',
                 packages=['juicebox_notebook'],
                 version='0.2.0',
                 description='Package for embedding the juicebox.js hic visualization in IPython notebooks',
                 long_description=long_description,
                 long_description_content_type="text/markdown",
                 license='MIT',
                 author='Jim Robinson',
                 url='https://github.com/igvteam/juicebox-notebook',
                 # download_url='https://github.com/igvteam/juicebox/archive/0.2.1.tar.gz',
                 keywords=['juicebox', 'bioinformatics', 'genomics', 'visualization', 'ipython', 'jupyter', 'colab'],
                 classifiers=[
                     'Development Status :: 4 - Beta',
                     'Intended Audience :: Science/Research',
                     'Intended Audience :: Developers',
                     'License :: OSI Approved :: MIT License',
                     'Programming Language :: Python',
                     'Framework :: IPython',
                 ],
                 # install_requires=[
                 #     'jupyter',
                 #     'notebook>=4.2.0',
                 # ],
                 package_data={'juicebox_notebook': ['js/messageHandler.js', 'js/localNotebookFile.js', 'js/juicebox.min.js']},
                 )
