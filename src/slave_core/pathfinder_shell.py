import cmd
import argparse
import tempfile
from slave_core.slave_plugin import *


class ArgparseCmdWrapper:
    def __init__(self, parser):
        """Init decorator with an argparse parser to be used in parsing cmd-line options"""
        self.parser = parser
        self.help_msg = ""

    def __call__(self, f):
        """Decorate 'f' to parse 'line' and pass options to decorated function"""
        if not self.parser:  # If no parser was passed to the decorator, get it from 'f'
            self.parser = f(None, None, None, True)

        def wrapped_f(*args):
            line = args[1].split()
            try:
                parsed = self.parser.parse_args(line)
            except SystemExit:
                return
            f(*args, parsed=parsed)

        return wrapped_f


class PathfinderShell(cmd.Cmd):
    intro = 'Welcome to the turtle shell.   Type help or ? to list commands.\n'
    prompt = '> '

    def do_hello(self, args):
        """Says hello. If you provide a name, it will greet you with it."""
        if len(args) == 0:
            name = 'stranger'
        else:
            name = args
        print(f"Hello, {name}")

    __render_parser = argparse.ArgumentParser(prog="render", description="Runs plugin python script for rendering.")
    __render_parser.add_argument('--test', help="test help")

    @ArgparseCmdWrapper(parser=__render_parser)
    def do_render(self, line, parsed):
        """Runs plugin python script."""

        print(parsed)

    def help_render(self):
        self.__render_parser.print_help()
