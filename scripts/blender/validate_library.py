"""Reopen the saved source and verify exported library collections."""
import bpy
import json
from pathlib import Path
root=Path(__file__).resolve().parents[2]
folder=root/'assets'/'zw-upgrade'
bpy.ops.wm.open_mainfile(filepath=str(folder/'zerowatt-library.blend'))
manifest=json.loads((folder/'manifest.json').read_text())
assert len(manifest['assets'])==13
assert len([c for c in bpy.data.collections if c.name[:2].isdigit()])==13
assert all((folder/(name+'.glb')).is_file() for name in manifest['assets'])
report={'blender':bpy.app.version_string,'reopened':True,'collections':13,
        'meshes':len([o for o in bpy.data.objects if o.type=='MESH']),
        'sourceBytes':(folder/'zerowatt-library.blend').stat().st_size}
(root/'docs'/'upgrade'/'blend-validation.json').write_text(json.dumps(report,indent=2))
print('BLEND_LIBRARY_VERIFIED',json.dumps(report))
