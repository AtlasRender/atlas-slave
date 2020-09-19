import logging
import importlib
import src.slave_core.config as config

logging.basicConfig(level=logging.DEBUG)

# FILENAME = os.path.basename("./plugins/test/src/__main__").replace('\\', '.')
FILENAME = f"plugins/{config.PLUGINS[0]}".replace('/', '.')


def main():
    logging.info('Starting...')
    logging.debug('Filename: ' + FILENAME)
    logging.debug(config.PLUGINS)
    plugin = importlib.import_module(FILENAME, package="src.")
    fun = getattr(plugin, 'render')
    result = fun("test", { 'frame_start': 10, "frame_end": 15 })
    logging.debug("result: " + result)
    return 0


if __name__ == '__main__':
    main()
