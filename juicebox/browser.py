import json
import random
import time
import os.path

from IPython.display import HTML, Javascript, display

def init():

    print("Loading CSS")
    display(HTML("<div>Loading CSS</div>"))

    # juicebox_css = """
    # const link = document.createElement("link")
    # link.type = "text/css"
    # link.rel = "stylesheet"
    # link.href = "https://cdn.jsdelivr.net/npm/juicebox.js@2.2.0/dist/css/juicebox.css"
    # document.getElementsByTagName("head")[0].appendChild(link)
    # """
    # display(Javascript(juicebox_css))
    #
    # display(HTML("Loading FontAwesom"))
    #
    # font_awesome_css = """
    # const link = document.createElement("link")
    # link.type = "text/css"
    # link.rel = "stylesheet"
    # link.href = "https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css"
    # document.getElementsByTagName("head")[0].appendChild(link)
    # """
    # display(Javascript(font_awesome_css))
    #
    # display(HTML("Loading juicebox.js"))
    #
    # juicebox_filepath = os.path.join(os.path.dirname(__file__), 'js/juicebox.js')
    # juicebox_file = open(juicebox_filepath, 'r')
    # juicebox_js = juicebox_file.read()
    # display(Javascript(juicebox_js))
    # #display(Javascript(url="https://cdn.jsdelivr.net/npm/juicebox.js@2.2.0/dist/juicebox.min.js"))
    #
    # display(HTML("Loading messageHandler"))
    #
    # message_filepath = os.path.join(os.path.dirname(__file__), 'js/messageHandler.js')
    # file = open(message_filepath, 'r')
    # message_js = file.read()
    # display(Javascript(message_js))

def init_2():

    print("Loading CSS")
    display(HTML("<div>Loading CSS</div>"))

    # juicebox_css = """
    # const link = document.createElement("link")
    # link.type = "text/css"
    # link.rel = "stylesheet"
    # link.href = "https://cdn.jsdelivr.net/npm/juicebox.js@2.2.0/dist/css/juicebox.css"
    # document.getElementsByTagName("head")[0].appendChild(link)
    # """
    # display(Javascript(juicebox_css))
    #
    # display(HTML("Loading FontAwesom"))
    #
    # font_awesome_css = """
    # const link = document.createElement("link")
    # link.type = "text/css"
    # link.rel = "stylesheet"
    # link.href = "https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css"
    # document.getElementsByTagName("head")[0].appendChild(link)
    # """
    # display(Javascript(font_awesome_css))
    #
    # display(HTML("Loading juicebox.js"))
    #
    # juicebox_filepath = os.path.join(os.path.dirname(__file__), 'js/juicebox.js')
    # juicebox_file = open(juicebox_filepath, 'r')
    # juicebox_js = juicebox_file.read()
    # display(Javascript(juicebox_js))
    # #display(Javascript(url="https://cdn.jsdelivr.net/npm/juicebox.js@2.2.0/dist/juicebox.min.js"))
    #
    # display(HTML("Loading messageHandler"))
    #
    # message_filepath = os.path.join(os.path.dirname(__file__), 'js/messageHandler.js')
    # file = open(message_filepath, 'r')
    # message_js = file.read()
    # display(Javascript(message_js))


def hello_javascript():
    display(Javascript('console.log("hello")'))

def hello_html():
    display(HTML("<div>Hello</div"))



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
        self.config = config
        self.locus = None
        self.show()


    def show(self):


        """
        Create an juicebox.js "Browser" instance on the front end.  This must be done first.
        """
        display(HTML("""<div id="%s"></div>""" % (self.igv_id)))

        self._send({
            "id": self.igv_id,
            "command": "createBrowser",
            "data": self.config
        })

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


    def _send(self, msg):
        javascript = """window.JuiceboxMessageHandler.on(%s)""" % (json.dumps(msg))
        # print(javascript)
        display(Javascript(javascript))

    def _gen_id(self):
        return 'jb_' + str(random.randint(1, 10000000))
