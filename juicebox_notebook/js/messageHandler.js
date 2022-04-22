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

    const isColab = window.google !== undefined && window.google.colab
    const isNotebook = window.Jupyter !== undefined

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
                    const browser = this.browserCache.get(id)
                    try {
                        switch (command) {
                            case "createBrowser":
                                var div = document.getElementById(id)  // <= created from python
                                convert(data)
                                if (data.tracks) {
                                    for(let t of data.tracks) {
                                        convert(t)
                                        if (t.indexURL) {
                                            convert(t, "index")
                                        } else {
                                            t.indexed = false
                                        }
                                    }
                                }

                                const newBrowser = await juicebox.createBrowser(div, data)
                                this.browserCache.set(id, newBrowser)
                                break

                            case "loadMap":
                                convert(data)
                                await browser.loadHicFile(data)
                                break

                            case "loadTrack":
                                convert(data)
                                if (data.indexURL) {
                                    convert(t, "index")
                                } else {
                                    data.indexed = false
                                }
                                await browser.loadTracks([data])
                                break

                            case "loadTrackList":
                                for (let t of data) {
                                    if (t.indexURL) {
                                        convert(t, "index")
                                    } else {
                                        t.indexed = false
                                    }
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
     * Convert relative URLs to absolute.  Primarily for Jupyter Lab, not generally needed for Jupyter Notebook
     * @param url
     * @returns {*}
     */
    function convertURL(url) {

        const pageURL = window.location.href

        if (!url ||
            url.startsWith("https://") ||
            url.startsWith("http://") ||
            url.startsWith("gs://") ||
            url.startsWith("data:")) {
            return url
        } else if (isColab) {
            // Interpret url as a path.  Its actually an error for user to use "urls" with colab
            igv.createNotebookLocalFile({path: url})
        } else if (isNotebook) {
            // Jupyter Notebook
            //
            // Examples
            // https://hub-binder.mybinder.ovh/user/igvteam-igv-notebook-tnlb45ie/notebooks/examples/BamFiles-Jupyter.ipynb
            //   => https://hub-binder.mybinder.ovh/user/igvteam-igv-notebook-tnlb45ie/files/examples/data/gstt1_sample.bam",

            const baseURL = document.querySelector('body').getAttribute('data-base-url')
            const notebookPath = document.querySelector('body').getAttribute('data-notebook-path')
            const notebookName = document.querySelector('body').getAttribute('data-notebook-name')
            const notebookDir = notebookPath.slice(0, -1 * notebookName.length)

            //`${location.origin}${base_path}files/${nb_dir}${url}`
            if (url.startsWith("/")) {
                url = `files${url}`
                return encodeURI(`${location.origin}${baseURL}${url}`)
            } else {
                // URL is relative to notebook
                return encodeURI(`${location.origin}${baseURL}files/${notebookDir}${url}`)
            }
        } else if (pageURL.includes("/lab/")) {
            // Jupyter Lab

            // Examples
            // http://localhost:8888/lab/workspaces/auto-N/tree/examples/BamFiles.ipynb
            //     =>  http://localhost:8888/files/examples/data/gstt1_sample.bam
            //
            // https://hub.gke2.mybinder.org/user/igvteam-igv-notebook-5ivkyktt/lab/tree/examples/BamFiles.ipynb
            //    => https://hub.gke2.mybinder.org/user/igvteam-igv-notebook-5ivkyktt/files/examples/data/gstt1_sample.bam

            const baseIndex = pageURL.indexOf("/lab/")
            const baseURL = pageURL.substring(0, baseIndex)

            if (url.startsWith("/")) {
                return encodeURI(`${baseURL}/files${url}`)
            } else if (pageURL.includes("/tree/")) {
                // Interpret URL as relative to notebook location.  This is not reliable, '/tree/' is not always in the page URL
                const treeIndex = pageURL.indexOf("/tree/") + 6
                const lastSlashIndex = pageURL.lastIndexOf("/")
                const notebookDir = pageURL.substring(treeIndex, lastSlashIndex)
                return encodeURI(`${baseURL}/files/${notebookDir}/${url}`)
            } else {
                // We don't know how to determine the notebook path
                console.warn("Page url missing '/tree/'.  Can't determine notebook path.")
                return encodeURI(`${baseURL}/files/${url}`)
            }
        } else {
            // We should never get here,
            return encodeURI(url)
        }
    }

    /**
     * Potentially convert a path to a local File-like object.
     * @param path
     * @returns {*}
     */
    function createNotebookFile(path) {
        if (!path ||
            path.startsWith("https://") || path.startsWith("http://") || path.startsWith("gs://") || path.startsWith("data:")) {
            return path
        } else {
            // Try to create a notebook file.  If no notebook file implementation is available for the kernel in
            // use (e.g. Jupyter Lab) treat as a URL.
            const nbFile = juicebox.createNotebookLocalFile({path})
            if (nbFile != null) {
                return nbFile
            } else {
                // Try to treat as relative URL.  This may or may not work
                return convertURL(url)
            }
        }
    }


    function convert(config, prefix) {
        const urlProp = prefix ? prefix + "URL" : "url"
        const pathProp = prefix ? prefix + "Path" : "path"
        if (config[urlProp]) {
            config[urlProp] = convertURL(config[urlProp])
        } else if (config[pathProp]) {
            config[urlProp] = createNotebookFile(config[pathProp])
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
