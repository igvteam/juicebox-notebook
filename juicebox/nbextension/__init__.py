def _jupyter_nbextension_paths():
    return [dict(
        section="notebook",
        # the path is relative to the `juicebox-jupyter` directory
        src="nbextension/static",
        # directory in the `nbextension/` namespace
        dest="juicebox",
        # also_ in the `nbextension/` namespace
        require="juicebox/extension")]
