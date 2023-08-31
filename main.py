from eellib import Eel
from watcher import watch_and_refresh

Eel("", 4200)

# Start the watcher in the main thread
watch_and_refresh()
