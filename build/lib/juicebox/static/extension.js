define(
    ["nbextensions/juicebox/juiceboxjs/juicebox"],
    //["https://cdn.jsdelivr.net/npm/juicebox@2.1.0/dist/juicebox.min.js"],
    function (juicebox) {

        if (!juicebox.browserCache) {
            juicebox.browserCache = {}
        }

        /**
         * Load the IGV.js nbextension
         */
        function load_ipython_extension() {
            registerComm()

            // Load the juicebox css
            var link = document.createElement("link")
            link.type = "text/css"
            link.rel = "stylesheet"
            link.href = "https://cdn.jsdelivr.net/npm/juicebox.js@2.2.0/dist/css/juicebox.css"
            document.getElementsByTagName("head")[0].appendChild(link)

        }

        function registerComm() {

            Jupyter.notebook.kernel.comm_manager.register_target('igvcomm',

                function (comm, msg) {
                    // comm is the frontend comm instance
                    // msg is the comm_open message, which can carry data

                    // Register handlers for later messages:
                    comm.on_msg(function (msg) {
                        var data = JSON.parse(msg.content.data)
                        var method = data.command
                        var id = data.id
                        var browser = getBrowser(id)
                        switch (method) {

                            case "createBrowser":
                                var div = document.getElementById(id)
                                createBrowser(div, data.options, comm)
                                break


                            // ** igv.js methods follow, as examples **
                            //
                            // case "loadTrack":
                            //     loadTrack(id, data.track)
                            //     break
                            //
                            // case "search":
                            //     search(id, data.locus)
                            //     break
                            //
                            // case "zoomIn":
                            //     try {
                            //         browser.zoomIn()
                            //     } catch (e) {
                            //         alert(e.message)
                            //         console.error(e)
                            //     } finally {
                            //         comm.send('{"status": "ready"}')
                            //     }
                            //     break
                            //
                            // case "zoomOut":
                            //     try {
                            //         browser.zoomOut()
                            //     } catch (e) {
                            //         alert(e.message)
                            //         console.error(e)
                            //     } finally {
                            //         comm.send('{"status": "ready"}')
                            //     }
                            //     break
                            //
                            // case "remove":
                            //     try {
                            //         delete juicebox.browserCache[id]
                            //         var div = document.getElementById(id)
                            //         div.parentNode.removeChild(div)
                            //     } catch (e) {
                            //         alert(e.message)
                            //         console.error(e)
                            //     } finally {
                            //         comm.send('{"status": "ready"}')
                            //     }
                            //     break
                            //
                            // case "toSVG":
                            //     try {
                            //         var svg = browser.toSVG()
                            //         var div = document.getElementById(data.div)
                            //         if(div) {
                            //             div.outerHTML += svg
                            //         }
                            //         comm.send(JSON.stringify({
                            //             "svg": svg
                            //         }))
                            //     } catch (e) {
                            //         alert(e.message)
                            //         console.error(e)
                            //     } finally {
                            //         comm.send('{"status": "ready"}')
                            //     }
                            //     break;
                            //
                            // case "on":
                            //     try {
                            //         if ("locuschange" === data.eventName) {
                            //             browser.on(data.eventName, function (referenceFrame) {
                            //                 comm.send(JSON.stringify({
                            //                     "event": data.eventName,
                            //                     "data": referenceFrame
                            //                 }))
                            //             })
                            //         } else {
                            //             alert("Unsupported event: " + data.eventName)
                            //         }
                            //     } catch (e) {
                            //         alert(e.message)
                            //         console.error(e)
                            //     } finally {
                            //         comm.send('{"status": "ready"}')
                            //     }
                            //     break

                            default:
                                console.error("Unrecognized method: " + msg.method)
                        }

                        function getBrowser(id) {
                            return juicebox.browserCache[id]
                        }

                        // ASYNC functino wrappers

                        function createBrowser(div, config) {
                            // TODO -- send message that browser is ready
                            juicebox.createBrowser(div, config)
                                .then(function (browser) {
                                    juicebox.browserCache[config.id] = browser;
                                    if (comm) {
                                        comm.send('{"status": "ready"}')
                                    }

                                    // Uncomment to send locus change events to server object (browser).  This generates a lot of traffic.
                                    //browser.on('locuschange', function (referenceFrame) {
                                    //    comm.send(JSON.stringify({"locus": referenceFrame}))
                                    //});
                                })
                                .catch(function (error) {
                                    comm.send('{"status": "ready"}')
                                    alert(error.message);
                                    console.error(e)
                                })
                        }

                        function loadTrack(id, config) {
                            var browser = getBrowser(id)
                            config.sync = true
                            browser.loadTrack(config)
                                .then(function (track) {
                                    comm.send('{"status": "ready"}')
                                })
                                .catch(function (error) {
                                    comm.send('{"status": "ready"}')
                                    alert(error.message);
                                    console.error(e)
                                })
                        }

                        function search(id, locus) {
                            var browser = getBrowser(id);
                            browser.search(locus)
                                .then(function (ignore) {
                                    comm.send('{"status": "ready"}')
                                })
                                .catch(function (error) {
                                    comm.send('{"status": "ready"}')
                                    alert(error.message)
                                    console.error(e)
                                })
                        }
                    });
                    comm.on_close(function (msg) {
                    });
                });
        }

        return {
            load_ipython_extension: load_ipython_extension,
        };

    });
