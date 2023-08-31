from filelisten import Watcher
from eellib import refresh_content
import ujson

with open("./file.json") as f:
    __WATCH_FILE = ujson.load(f)["file"]

def watch_and_refresh():
    watcher = Watcher(__WATCH_FILE, refresh_content)
    watcher.watch()
