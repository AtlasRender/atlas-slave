import src.slave_core.config as config


def render(file, settings):
    print("My name is " + config.PLUGINS[0])
    print("Got file: " + file)
    print("With settings:", settings)
    return f"Rendered_{file}"
