import logging
import importlib
import dotenv
import os

import slave_core.config as config
from slave_core.connection import *
from slave_core.slave_plugin import *
from slave_core.pathfinder_shell import PathfinderShell

logging.basicConfig(level=logging.DEBUG)


# FILENAME = os.path.basename("./plugins/test/src/__main__").replace('\\', '.')


def main():
    logging.info('Starting...')

    prompt = PathfinderShell()
    prompt.cmdloop('Starting shell...')

    # dotenv.load_dotenv(dotenv_path=config.ENV_PATH)
    # logging.debug(os.getenv('HELLO'))
    # plugin.run_plugin('test')

    return 0


if __name__ == '__main__':
    main()
