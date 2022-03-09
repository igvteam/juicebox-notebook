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
                    // const msg = this.messageQueue.dequeue()
                    // const command = msg.command
                    // const id = msg.id
                    // const data = msg.data

                    const { id, command, data } = this.messageQueue.dequeue()

                    const browser = this.browserCache.get(id)

                    try {
                        switch (command) {

                            case "createBrowser":
                                var div = document.getElementById(id)  // <= created from python

                                data.url = convert(data.url)
                                if (data.tracks) {
                                    for (let t of data.tracks) {
                                        t.url = convert(t.url)
                                        t.indexURL = convert(t.indexURL)
                                    }
                                }
                                const newBrowser = await juicebox.createBrowser(div, data)
                                this.browserCache.set(id, newBrowser)
                                break

                            case "setNormalization":

                                const normalizations = await browser.getNormalizationOptions()
                                const validNormalizations = new Set(normalizations)

                                const param = validNormalizations.has(data) ? data : 'NONE'
                                await browser.setNormalization(param)

                                const index = normalizations.indexOf(param)
                                browser.normalizationSelector.$normalization_selector.get(0).getElementsByTagName('option')[ index ].selected = 'selected'

                                break

                            case "setResolution":

                                // Test using zoom index. It works fine.
                                // const { zoomIndex } = data
                                // await browser.setZoom(parseInt(zoomIndex))

                                const { resolution } = data
                                const targetResolution = parseInt(resolution)
                                const zoomIndex = browser.findMatchingZoomIndex(targetResolution, browser.dataset.bpResolutions)
                                await browser.setZoom(zoomIndex)

                                break

                            case "loadMap":
                                data.url = convert(data.url)
                                await browser.loadHicFile(data)
                                break

                            case "loadTrack":
                                data.url = convert(data.url)
                                data.indexURL = convert(data.indexURL)
                                await browser.loadTracks([data])
                                break

                            case "loadTrackList":
                                for (let t of data) {
                                    t.url = convert(t.url)
                                    t.indexURL = convert(t.indexURL)
                                }
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

    /**
     * Potentially convert a path to a local File-like object.
     * @param path
     * @returns {*}
     */
    function convert(path) {
        if (!path ||
            path.startsWith("https://") || path.startsWith("http://") || path.startsWith("gs://") || path.startsWith("data:")) {
            return path
        } else {
            // Try to create a notebook file.  If no notebook file implementation is available for the kernel in
            // use (e.g. JupyterLab) just return 'path'
            const nbFile = juicebox.createNotebookLocalFile({path})
            return nbFile || path
        }
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
