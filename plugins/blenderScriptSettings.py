from datetime import datetime
from bpy.app import handlers
import bpy
import os
import json
import sys
import time


FRAME_START_TIME = None
RENDER_START_TIME = None
outputDir = bpy.context.scene.render.filepath


bpy.types.RenderSettings.resolution_x = 1920
bpy.types.RenderSettings.resolution_y = 1080