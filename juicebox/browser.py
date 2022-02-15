from IPython.display import HTML, SVG, display
from ipykernel.comm import Comm
import json
import random
import time

class _IGVComm:

    def __init__(self, id):

        # Use comm to send a message from the kernel
        self.comm = Comm(target_name=id, data={})

    def send(self, message):
        self.comm.send(message)


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
        self.comm = _IGVComm("igvcomm")
        self._status = "initializing"
        self.locus = None
        self.eventHandlers = {}
        self.svg = None
        self.message_queue = []

        # Add a callback for received messages.
        @self.comm.comm.on_msg
        def _recv(msg):
            data = json.loads(msg['content']['data'])
            if 'status' in data:
                self.status = data['status']
            elif 'locus' in data:
                self.locus = data['locus']
            elif 'svg' in data:
                self.svg = data['svg']
            elif 'event' in data:
                if data['event'] in self.eventHandlers:
                    handler = self.eventHandlers[data['event']]
                    eventData = None
                    if 'data' in data:
                        eventData = data['data']
                    handler(eventData)

        self.show()

    @property
    def status(self):
        return self._status

    @status.setter
    def status(self, value):
        self._status = value
        if value == "ready" and len(self.message_queue) > 0:
            time.sleep(0.5)
            self._send(self.message_queue.pop(0))

    def show(self):
        """
        Create an juicebox.js "Browser" instance on the front end.  This must be done first.
        """
        display(HTML("""<div id="%s"></div>""" % (self.igv_id)))

        # DON'T check status before showing browser,
        msg = json.dumps({
            "id": self.igv_id,
            "command": "createBrowser",
            "options": self.config
        })
        self.comm.send(msg)

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
            "config": config
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
            "config": config
        })


# def search(self, locus):
    #     """
    #     Go to the specified locus.
    #
    #     :param locus:  Chromosome location of the form  "chromsosome:start-end", or for supported genomes (hg38, hg19, and mm10) a gene name.
    #     :type str
    #
    #     """
    #
    #     self._send({
    #         "id": self.igv_id,
    #         "command": "search",
    #         "locus": locus
    #     })
    #
    # def zoom_in(self):
    #     """
    #     Zoom in by a factor of 2
    #     """
    #
    #     self._send({
    #         "id": self.igv_id,
    #         "command": "zoomIn"
    #     })
    #
    # def zoom_out(self):
    #     """
    #     Zoom out by a factor of 2
    #     """
    #     self._send({
    #         "id": self.igv_id,
    #         "command": "zoomOut"
    #     })
    #
    # def to_svg(self):
    #     """
    #     Fetch the current IGV view as an SVG image and display it in this cell
    #     """
    #     div_id = self._gen_id();
    #     display(HTML("""<div id="%s"></div>""" % div_id))
    #     self._send({
    #         "id": self.igv_id,
    #         "div": div_id,
    #         "command": "toSVG"
    #     })
    #
    # def get_svg(self):
    #     """
    #     Fetch the current IGV view as an SVG image.  To display the message call display_svg()
    #     """
    #     self.svg = "FETCHING"
    #     return self._send({
    #         "id": self.igv_id,
    #         "command": "toSVG"
    #     })
    #
    # def display_svg(self):
    #     """
    #     Display the current SVG image.  You must call get_svg() before calling this method.
    #     """
    #     if self.svg == None:
    #         return "Must call get_svg() first"
    #     elif self.svg == "FETCHING":
    #         return 'Awaiting SVG - try again in a few seconds'
    #     else:
    #         svg = self.svg
    #         self.svg == None
    #         display(SVG(svg))
    #
    #
    # def on(self, eventName, cb):
    #     """
    #     Subscribe to an juicebox.js event.
    #
    #     :param Name of the event.  Currently only "locuschange" is supported.
    #     :type str
    #     :param cb - callback function taking a single argument.  For the locuschange event this argument will contain
    #             a dictionary of the form  {chr, start, end}
    #     :type function
    #     """
    #     self.eventHandlers[eventName] = cb
    #     self._send({
    #         "id": self.igv_id,
    #         "command": "on",
    #         "eventName": eventName
    #     })

    def remove(self):
        """
        Remove the juicebox.js Browser instance from the front end.  The server Browser object should be disposed of after calling
        this method.
        """
        self._send({
            "id": self.igv_id,
            "command": "remove"
        })

    def _send(self, msg):
        if self.status == "ready":
            self.status = "busy"
            self.comm.send(json.dumps(msg))
        else:
            self.message_queue.append(msg)

    def _gen_id(self):
        return 'igv_' + str(random.randint(1, 10000000))