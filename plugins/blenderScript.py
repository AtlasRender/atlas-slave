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
frame = 7
bpy.context.scene.render.filepath = "/Projects/" + str(frame).zfill(4)
bpy.context.scene.frame_set(frame)
bpy.ops.render.render(write_still=True, use_viewport=True)