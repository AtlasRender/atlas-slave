import slave_core.config as config
import slave_core.plugin_processing as pp
import slave_core


def render(file, settings):
    print("My name is " + config.PLUGINS[0])
    print("Got file: " + file)
    print("With settings:", settings)
    for i in range(settings['frame_start'], settings['frame_end'] + 1):
        print(f"Processing frame {i}")
        if i == 15:
            pp.events.onError("just hate 15th frame")
            break
    print("Done..")
    return f"Rendered_{file}"
