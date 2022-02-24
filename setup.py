import setuptools

with open("README.md", "r") as fh:
    long_description =  fh.read()

setuptools.setup(name='juicebox',
                 packages=['juicebox'],
                 version='0.1.0',
                 description='Package for embedding the juicebox.js genome visualization in IPython notebooks',
                 long_description=long_description,
                 long_description_content_type="text/markdown",
                 license='MIT',
                 author='Jim Robinson',
                 url='https://github.com/igvteam/juicebox',
                 # download_url='https://github.com/igvteam/juicebox/archive/0.2.1.tar.gz',
                 keywords=['juicebox', 'bioinformatics', 'genomics', 'visualization', 'ipython', 'jupyter'],
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
                 package_data={'juicebox': ['js/messageHandler.js', 'js/juicebox.js']},
                 )
