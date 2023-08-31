import sys
import threading
from io import StringIO
import eel
from bs4 import BeautifulSoup
import ujson


class Eel:
    def __init__(self, url: str, port: int) -> None:
        self.__url = url
        self.__port = port

        eel.init("build")
        eel_thread = threading.Thread(
            target=eel.start,
            args=(self.__url,),
            kwargs={"size": (800, 600), "port": self.__port, "mode": "default"},
        )
        eel_thread.daemon = True
        eel_thread.start()

    @property
    def watch_file_path(self):
        return self.__watch_file_path


@eel.expose
def get_string(code: str) -> list[str]:
    def capture_output(code):
        class OutputCapturer(StringIO):
            def __init__(self, *args, **kwargs):
                super().__init__(*args, **kwargs)
                self.output_list = []

            def write(self, s):
                self.output_list.append(s.strip())
                super().write(s)

        original_stdout = sys.stdout

        try:
            output_buffer = OutputCapturer()
            sys.stdout = output_buffer
            exec(code)
            return output_buffer.output_list
        finally:
            # Restore the original sys.stdout
            sys.stdout = original_stdout

    try:
        return list(filter(None, capture_output(rf"{code}")))
    except Exception as e:
        print(e)
        return [str(e)]


### FILE WATCHER ###


@eel.expose
def refresh_content() -> None:
    with open("./file.json") as f:
        __WATCH_FILE = ujson.load(f)["file"]

    with open(__WATCH_FILE, "r") as f:
        html = f.read()

    # Parse the HTML using Beautiful Soup
    soup = BeautifulSoup(html, "html.parser")

    # Extract the head and body tags
    head_tag = soup.head
    body_tag = soup.body

    eel.setHTML(f"{head_tag}{body_tag}")
