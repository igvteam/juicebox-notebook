import json
import random
import os
from .file_reader import register_filecomm

from IPython.display import HTML, Javascript, display

def init():

    register_filecomm()

    juicebox_css = """
    const link = document.createElement("link")
    link.type = "text/css"
    link.rel = "stylesheet"
    link.href = "https://cdn.jsdelivr.net/npm/juicebox.js@2.2.1/dist/css/juicebox.css"
    document.getElementsByTagName("head")[0].appendChild(link)
    """
    display(Javascript(juicebox_css))

    font_awesome_css = """
    const link = document.createElement("link")
    link.type = "text/css"
    link.rel = "stylesheet"
    link.href = "https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css"
    document.getElementsByTagName("head")[0].appendChild(link)
    """
    display(Javascript(font_awesome_css))

    juicebox_filepath = os.path.join(os.path.dirname(__file__), 'js/juicebox.min.js')
    juicebox_file = open(juicebox_filepath, 'r')
    juicebox_js = juicebox_file.read()
    display(Javascript(juicebox_js))

    message_filepath = os.path.join(os.path.dirname(__file__), 'js/messageHandler.js')
    file = open(message_filepath, 'r')
    message_js = file.read()
    display(Javascript(message_js))

    message_filepath = os.path.join(os.path.dirname(__file__), 'js/localNotebookFile.js')
    file = open(message_filepath, 'r')
    message_js = file.read()
    display(Javascript(message_js))



class Browser(object):

    # Always remember the *self* argument
    def __init__(self, config):

        """Initialize a python Browser object for communicating with a juicebox.js javascript Browser object
        :param: config - A dictionary specifying the browser configuration.  This will be converted to JSON and passed
                to juicebox.js  "juicebox.createBrowser(config)" as described in the juicebox.js documentation.
        :type dict
        """

        id = self._gen_id()
        config["id"] = id
        self.igv_id = id

        """
        Create an juicebox.js "Browser" instance on the front end.  This must be done first.
        """
        display(HTML("""<div id="%s"></div>""" % (self.igv_id)))

        self._send({
            "id": self.igv_id,
            "command": "createBrowser",
            "data": config
        })

    # def set_normalization(self, config):
    #     """
    #     Set normalization
    #     param  config: A string specifying a normalization
    #     :type str
    #     """
    #
    #     # Check for minimal requirements
    #     if isinstance(config, str) == False:
    #         raise Exception("parameter must be a string")
    #
    #     self._send({
    #         "id": self.igv_id,
    #         "command": "setNormalization",
    #         "data": config
    #     })

    # def set_resolution(self, config):
    #     """
    #     Set resolution
    #     param  config: A dictionary specifying a resolution
    #     :type dict
    #     """
    #
    #     # Check for minimal requirements
    #     if isinstance(config, dict) == False:
    #         if isinstance(config, str):
    #             config = {"url": config}
    #         else:
    #             raise Exception("parameter must be a dictionary or string")
    #
    #     self._send({
    #         "id": self.igv_id,
    #         "command": "setResolution",
    #         "data": config
    #     })

    def load_map(self, config):
        """
        Load a map (i.e. hic file).
        param  config: A dictionary specifying map options
        :type dict
        """

        # Check for minimal requirements
        if isinstance(config, dict) == False:
            if isinstance(config, str):
                config = {"url": config}
            else:
                raise Exception("parameter must be a dictionary or string")

        self._send({
            "id": self.igv_id,
            "command": "loadMap",
            "data": config
        })

    def load_track(self, config):
        """
        Load a track.  Corresponds to the juicebox.js Browser function
        :type dict
        """

        # Check for minimal  requirements
        if isinstance(config, dict) == False:

            if isinstance(config, str):
                config = {"url": config}
            else:
                raise Exception("parameter must be a dictionary or string")

        self._send({
            "id": self.igv_id,
            "command": "loadTrack",
            "data": config
        })


    def load_track_list(self, config):
        """
        Load a list of tracks.  Corresponds to the juicebox.js Browser function loadTrackList
        :type list
        """

        # Check for minimal  requirements
        if isinstance(config, list) == False:

            if isinstance(config, str):
                config = {"url": config}
            else:
                raise Exception("parameter must be an array or string")

        self._send({
            "id": self.igv_id,
            "command": "loadTrackList",
            "data": config
        })


    def _send(self, msg):
        javascript = """window.juicebox.JuiceboxMessageHandler.on(%s)""" % (json.dumps(msg))
        # print(javascript)
        display(Javascript(javascript))

    def _gen_id(self):
        return 'jb_' + str(random.randint(1, 10000000))
