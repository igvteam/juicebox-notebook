/**
 * Global handler for juicebox messages.  Messages have the form
 * {
 *     command  -- the command to execute
 *     id -- the id of the juicebox browser, if applicable
 *     data -- any data needed for the command
 * }
 */

// Use a self-evaluating function to keep variables in this file scope, with the execption of the global handler

(function () {

    console.log("Installing juicebox.JuiceboxMessageHandler")

    class MessageHandler {

        constructor() {
            this.browserCache = new Map()
            this.messageQueue = new Queue()
        }

        on(msg) {
            console.log(`Message received ${msg}`)
            this.messageQueue.enqueue(msg)
            this.processQueue()
        }

        async processQueue() {
            if (!this.processing) {
                this.processing = true
                while (!this.messageQueue.isEmpty()) {
                    const msg = this.messageQueue.dequeue()
                    const command = msg.command
                    const id = msg.id
                    const data = msg.data
                    let browser
                    console.log(data)
                    convertPaths(data)
                    try {
                        switch (command) {
                            case "createBrowser":
                                var div = document.getElementById(id)  // <= created from python
                                browser = await juicebox.createBrowser(div, data)
                                this.browserCache.set(id, browser)
                                break

                            case "loadMap":
                                browser = this.browserCache.get(id)
                                await browser.loadHicFile(data)
                                break

                            case "loadTrack":
                                browser = this.browserCache.get(id)
                                await browser.loadTracks([data])
                                break

                            case "loadTrackList":
                                browser = this.browserCache.get(id)
                                await browser.loadTracks(data)
                                break

                            default:
                                console.error("Unrecognized method: " + msg.command)
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
                this.processing = false
            }
        }
    }

    function convertPaths(config) {

        function convert (path)  {
            if (!path) {
                return path
            } else if (path.startsWith("https://") ||
                path.startsWith("http://") ||
                path.startsWith("gs://") ||
                path.startsWith("data:")) {
                return path
            } else {
                // Try to create a notebook file.  If no notebook file implementation is available for the kernel in
                // use (e.g. JupyterLab) just return 'path'
                const nbFile = juicebox.createNotebookLocalFile({path})
                return nbFile || path
            }
        }

        // The map
        if(config.url) config.url = convert(config.url)

        // Tracks
        if(config.tracks) {
            for(let t of config.tracks) {
                if(t.url) t.url = convert(t.url)
                if(t.indexURL) t.indexURL = convert(t.indexURL)
            }
        }
        console.log(config)
    }


    class Queue {
        constructor() {
            this.elements = []
        }

        enqueue(e) {
            this.elements.push(e)
        }

        dequeue() {
            return this.elements.shift()
        }

        isEmpty() {
            return this.elements.length == 0
        }

        peek() {
            return !this.isEmpty() ? this.elements[0] : undefined
        }

        length() {
            return this.elements.length
        }
    }

    window.juicebox.JuiceboxMessageHandler = new MessageHandler()

    console.log("JuiceboxMessageHandler installed")

})()
