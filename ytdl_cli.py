import os
import sys
import json
import time
import platform
import shutil
import webbrowser
import yt_dlp
import click
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, TextColumn, BarColumn, DownloadColumn, TransferSpeedColumn, TimeRemainingColumn, SpinnerColumn
from rich.table import Table
from rich.theme import Theme
from rich import box
from rich.prompt import Prompt, Confirm
from rich.text import Text

# Configuration
CLAUDE_ORANGE = "#D97757"
LANG_DIR = os.path.join(os.path.dirname(__file__), "languages")

# UI Theme
custom_theme = Theme({
    "info": "white",
    "warning": f"bold {CLAUDE_ORANGE}",
    "error": "bold red",
    "success": f"bold {CLAUDE_ORANGE}",
    "header": f"bold white on {CLAUDE_ORANGE}",
    "label": "bold white",
    "dim": "dim white",
    "brand": CLAUDE_ORANGE,
})

console = Console(theme=custom_theme)

def load_languages():
    langs = {}
    if not os.path.exists(LANG_DIR):
        return {}
    for file in os.listdir(LANG_DIR):
        if file.endswith(".json"):
            code = file.split(".")[0]
            try:
                with open(os.path.join(LANG_DIR, file), "r", encoding="utf-8") as f:
                    langs[code] = json.load(f)
            except:
                continue
    return langs

ALL_LANGS = load_languages()

def get_os():
    sys_name = platform.system()
    if sys_name == "Linux":
        if "ANDROID_ROOT" in os.environ or "TERMUX_VERSION" in os.environ:
            return "Android"
    return sys_name

CURRENT_OS = get_os()

def get_download_dir():
    home = os.path.expanduser("~")
    if CURRENT_OS == "Windows":
        return os.path.join(home, "Desktop", "NixDownload")
    elif CURRENT_OS == "Android":
        storage_path = os.path.join(home, "storage")
        if os.path.exists(storage_path):
            try:
                # Try accessing internal SD card
                test_file = "/sdcard/.nixtest"
                with open(test_file, "w") as f: f.write("test")
                os.remove(test_file)
                return "/sdcard/NixDownload"
            except:
                pass
            return os.path.join(storage_path, "downloads", "NixDownload")
    return os.path.join(home, "NixDownload")

def check_python_init(lang):
    init_file = os.path.join(os.path.dirname(__file__), ".nix_init")
    if os.path.exists(init_file):
        return

    console.print(f"\n[warning]●[/warning] [white]{lang.get('python_check', 'Is Python installed correctly?')}[/white]\n")
    
    if CURRENT_OS == "Windows":
        console.print("[info]Tutorial Windows:[/info] https://youtu.be/Qg05y10APwA")
    elif CURRENT_OS == "Mac":
        url = "https://www.google.com/search?q=python+mac+os+install"
        if shutil.which("open"):
            os.system(f"open '{url}'")
        else:
            webbrowser.open(url)
    elif CURRENT_OS == "Android":
        console.print("[info]Configuring Python for Android...[/info]")
        os.system("pkg install python -y")
    elif platform.system() == "Linux":
        console.print("[info]Configuring Python for Linux...[/info]")
        os.system("sudo apt install python3 -y")

    try:
        with open(init_file, "w") as f: f.write("1")
    except: pass
    time.sleep(1)

def get_banner(lang_data, status_text=None):
    desc = lang_data.get("description", "Modern Video Downloader")
    name = lang_data.get("lang_name", "English")

    grid = Table.grid(expand=True)
    grid.add_column(justify="center")
    grid.add_row(Text(" Nixtub - Razael Labs ", style="header"))
    grid.add_row(Text(desc, style="white"))
    grid.add_row(Text.assemble((f"Language: {name}", "dim"), (" | ", "white"), (f"System: {CURRENT_OS}", "dim")))
    
    if status_text:
        grid.add_row(Text(""))
        grid.add_row(Text(status_text, style="bold orange3"))

    return Panel(grid, box=box.ROUNDED, border_style=CLAUDE_ORANGE, padding=(1, 2), expand=True)

class MyLogger:
    def debug(self, msg): pass
    def info(self, msg): pass
    def warning(self, msg): pass
    def error(self, msg):
        if "No supported JavaScript runtime" not in msg:
            console.print(f"[error]✘ ERROR:[/error] {msg}")

@click.command(context_settings=dict(ignore_unknown_options=True, allow_interspersed_args=True))
@click.argument('url', required=False)
@click.option('--format', '-f', default=None, help='Format (best, mp4, mp3)')
@click.option('--output', '-o', default='%(title)s.%(ext)s', help='Output template')
@click.argument('lang_flags', nargs=-1, type=click.UNPROCESSED)
def main(url, format, output, lang_flags):
    """Nixtub - Razael Labs: Modern Downloader."""
    
    # Language Parsing
    selected_code = None
    flags = list(lang_flags)
    if url and url.startswith("--"):
        flags.append(url)
        url = None
    
    for flag in flags:
        if flag.startswith("--"):
            q = flag[2:].lower()
            if q in ALL_LANGS: selected_code = q
            else:
                for c, d in ALL_LANGS.items():
                    if d.get("lang_name", "").lower() == q:
                        selected_code = c
                        break
            if selected_code: break
    
    lang = ALL_LANGS.get(selected_code, ALL_LANGS.get("en", list(ALL_LANGS.values())[0] if ALL_LANGS else {}))
    
    # Init
    check_python_init(lang)
    download_dir = get_download_dir()
    os.makedirs(download_dir, exist_ok=True)
    out_tmpl = os.path.join(download_dir, output)
    
    console.clear()

    # Input Phase
    try:
        if not url:
            console.print(get_banner(lang))
            console.print(f"\n[brand]●[/brand] [white]{lang.get('welcome')}[/white] [dim](CTRL+D to exit)[/dim]")
            url = Prompt.ask(f"[{CLAUDE_ORANGE}]{lang.get('prompt_url')}[/{CLAUDE_ORANGE}]")
            if not url: return

        if not format:
            choice = Prompt.ask(f"[{CLAUDE_ORANGE}]{lang.get('prompt_format')}[/{CLAUDE_ORANGE}]", 
                               choices=["best", "mp4", "mp3", "manual"], default="best")
            if choice == "best": format = "bestvideo+bestaudio/best"
            elif choice == "mp4": format = "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"
            elif choice == "mp3": format = "bestaudio/best"
            elif choice == "manual": format = Prompt.ask(f"[{CLAUDE_ORANGE}]{lang.get('manual_format')}[/{CLAUDE_ORANGE}]")
    except (EOFError, KeyboardInterrupt):
        console.print(f"\n\n[brand]●[/brand] [white]{lang.get('exit_msg', 'Goodbye!')}[/white]")
        sys.exit(0)

    # Download Logic
    ydl_opts = {
        'format': format, 'outtmpl': out_tmpl, 'logger': MyLogger(),
        'quiet': True, 'no_warnings': True, 'noprogress': True,
    }
    if format == "bestaudio/best":
        ydl_opts['postprocessors'] = [{'key': 'FFmpegExtractAudio', 'preferredcodec': 'mp3', 'preferredquality': '192'}]

    try:
        with console.status(f"[{CLAUDE_ORANGE}]{lang.get('analyzing')}[/{CLAUDE_ORANGE}]", spinner_style=CLAUDE_ORANGE):
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)

        console.clear()
        console.print(get_banner(lang))
        table = Table(show_header=False, box=box.SIMPLE, border_style=CLAUDE_ORANGE, expand=True)
        table.add_column("K", style=f"bold {CLAUDE_ORANGE}", width=15)
        table.add_column("V", style="white")
        table.add_row(lang.get("table_title"), (info.get('title')[:60] + "...") if len(info.get('title', '')) > 60 else info.get('title'))
        table.add_row(lang.get("table_uploader"), info.get('uploader'))
        d = info.get('duration')
        table.add_row(lang.get("table_duration"), f"{d//60}:{d%60:02d}" if d else "--")
        table.add_row(lang.get("table_views"), f"{info.get('view_count', 0):,}")
        console.print(Panel(table, border_style="white", padding=(0, 1)))
        
        try:
            if not Confirm.ask(f"[{CLAUDE_ORANGE}]{lang.get('confirm_download')}[/{CLAUDE_ORANGE}]", default=True): return
        except (EOFError, KeyboardInterrupt): sys.exit(0)

        console.print(f"\n[brand]●[/brand] [white]{lang.get('processing')}[/white]\n")
        with Progress(SpinnerColumn(style=CLAUDE_ORANGE), TextColumn("[white]{task.description}"), 
                      BarColumn(complete_style=CLAUDE_ORANGE), "[progress.percentage]{task.percentage:>3.0f}%",
                      DownloadColumn(), TransferSpeedColumn(), TimeRemainingColumn(), expand=True, console=console) as progress:
            tid = progress.add_task(lang.get("status_downloading"), total=None)
            def p_hook(d):
                if d['status'] == 'downloading':
                    progress.update(tid, completed=d.get('downloaded_bytes', 0), total=d.get('total_bytes') or d.get('total_bytes_estimate'))
                elif d['status'] == 'finished': progress.update(tid, completed=100, total=100, description=lang.get("status_finishing"))
            def pp_hook(d):
                if d['status'] == 'started': progress.update(tid, description=lang.get("status_finishing"))
                elif d['status'] == 'finished': progress.update(tid, description=lang.get("status_done"))
            ydl_opts['progress_hooks'], ydl_opts['postprocessor_hooks'] = [p_hook], [pp_hook]
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl_d:
                ydl_downloader = ydl_d
                ydl_d.download([url])
                if CURRENT_OS == "Android":
                    try:
                        f = ydl_d.prepare_filename(info)
                        if format == "bestaudio/best" and not f.endswith(".mp3"): f = os.path.splitext(f)[0] + ".mp3"
                        if os.path.exists(f): os.system(f"termux-media-scan \"{f}\" > /dev/null 2>&1")
                    except: pass

        console.print(Panel(f"[success]{lang.get('success')}[/success]", box=box.ROUNDED, border_style=CLAUDE_ORANGE, padding=(0, 2), expand=False))
    except Exception as e:
        console.print(f"\n[error]✘ Error:[/error] [white]{str(e)}[/white]"); sys.exit(1)

if __name__ == '__main__':
    main()
