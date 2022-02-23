/**
 * Global handler for juicebox messages.  Messages have the form
 * {
 *     command  -- the command to execute
 *     id -- the id of the juicebox browser, if applicable
 *     data -- any data needed for the command
 * }
 */

window.JuiceboxMessageHandler =
    {
        browserCache: new Map(),

        on: async function (msg) {
            const command = msg.command
            const id = msg.id
            const data = msg.data
            let browser
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

                    default:
                        console.error("Unrecognized method: " + msg.command)
                }
            } catch (e) {
                console.error(e)
            }
        }
    }

