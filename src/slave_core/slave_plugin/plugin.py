import importlib
import os
import logging
import slave_core.config as config

logger = logging.getLogger('slave_plugin')


def run_plugin(plugin_name):
    FILENAME = f"plugins/{plugin_name}"
    # TODO:
    # logger.debug(os.path.('/'))
    # if not os.path.exists(os.path.join(os.path.abspath(), FILENAME)):
    # raise ModuleNotFoundError("Plugin not exists")

    plugin = importlib.import_module(FILENAME.replace('/', '.'), package=f"slave_plugin.{plugin_name}")

    fun = getattr(plugin, 'render')
    # TODO: run render() in another thread
    result = fun("test", { 'frame_start': 10, "frame_end": 15 })
    return result
