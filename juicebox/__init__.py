from .browser import Browser

def _jupyter_server_extension_paths():
    return [{
        "module": "juicebox"
    }]


def _jupyter_nbextension_paths():
    return [dict(
        section="notebook",
        # the path is relative to the `juicebox` directory
        src="static",
        # directory in the `nbextension/` namespace
        dest="juicebox",
        # also_ in the `nbextension/` namespace
        require="juicebox/extension")]


def load_jupyter_server_extension(nbapp):
    nbapp.log.info("juicebox enabled!")
