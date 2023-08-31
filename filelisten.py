import os
import sys
import time


class Watcher(object):
    running = True
    delay = 1

    # Constructor
    def __init__(self, watch_file, call_func_on_change=None, *args, **kwargs):
        self._times_changed = 0
        self._cached_stamp = 0
        self.filename = watch_file
        self.call_func_on_change = call_func_on_change
        self.args = args
        self.kwargs = kwargs

    # Look for changes
    def __look(self):
        stamp = os.stat(self.filename).st_mtime
        if stamp != self._cached_stamp:
            self._cached_stamp = stamp
            if self.call_func_on_change is not None:
                if self._times_changed != 0:
                    print(
                        "Updated"
                        + (
                            ""
                            if self._times_changed == 1
                            else f" x{self._times_changed}"
                        )
                    )
                self._times_changed += 1
                self.call_func_on_change(*self.args, **self.kwargs)

    # Keep watching in a loop
    def watch(self):
        while self.running:
            try:
                # Look for changes
                time.sleep(self.delay)
                self.__look()
            except KeyboardInterrupt:
                break
            except FileNotFoundError:
                pass
            except:
                print("Unhandled error: %s" % sys.exc_info()[0])
