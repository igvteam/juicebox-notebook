from .browser import Browser
from .nbextension import _jupyter_nbextension_paths
from .labextension import _jupyter_labextension_paths
from .version import __version__


def _jupyter_server_extension_paths():
    return [{
        "module": "juicebox"
    }]


def load_jupyter_server_extension(nbapp):
    nbapp.log.info("juicebox enabled!")
