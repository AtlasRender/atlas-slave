bpy.context.scene.render.filepath = "/Projects/" + str(frame).zfill(4)
bpy.context.scene.frame_set(frame)
bpy.ops.render.render(write_still=True, use_viewport=True)