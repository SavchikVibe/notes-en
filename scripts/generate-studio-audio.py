import asyncio
import json
import subprocess
import tempfile
from pathlib import Path

import edge_tts
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "scripts" / "studio-audio.json"
OUTPUT_DIR = ROOT / "public" / "audio"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()


def run(*args: str) -> None:
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", *args], check=True)


async def synthesize(text: str, voice: str, rate: str, path: Path) -> None:
    for attempt in range(3):
        try:
            communicate = edge_tts.Communicate(text, voice, rate=rate)
            await communicate.save(str(path))
            return
        except Exception:
            if attempt == 2:
                raise
            await asyncio.sleep(1.5)


async def build_track(track: dict) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output = OUTPUT_DIR / f"{track['id']}.mp3"
    if output.exists() and output.stat().st_size > 1000:
        print(f"skip {output.name}")
        return

    with tempfile.TemporaryDirectory() as temp_dir:
        temp = Path(temp_dir)
        silence = temp / "silence.wav"
        run(
            "-f",
            "lavfi",
            "-i",
            "anullsrc=r=44100:cl=mono",
            "-t",
            "0.38",
            "-c:a",
            "pcm_s16le",
            str(silence),
        )

        parts: list[Path] = [silence]
        for index, line in enumerate(track["lines"]):
            print(f"  {track['id']} line {index + 1}: {line['voice']}")
            mp3 = temp / f"{index:02d}.mp3"
            wav = temp / f"{index:02d}.wav"
            await synthesize(line["text"], line["voice"], track.get("rate", "+0%"), mp3)
            run("-i", str(mp3), "-ar", "44100", "-ac", "1", "-c:a", "pcm_s16le", str(wav))
            parts.extend([wav, silence])

        list_file = temp / "list.txt"
        list_file.write_text(
            "\n".join(f"file '{part.as_posix()}'" for part in parts),
            encoding="utf-8",
        )
        combined = temp / "combined.wav"
        run("-f", "concat", "-safe", "0", "-i", str(list_file), "-c", "copy", str(combined))
        run("-i", str(combined), "-codec:a", "libmp3lame", "-b:a", "64k", str(output))

    duration = len(parts) * 0.38
    size = output.stat().st_size / 1024
    print(f"{output.name}: ~{duration:.1f} s of pauses + speech, {size:.0f} KB")


async def main() -> None:
    tracks = json.loads(SOURCE.read_text(encoding="utf-8"))
    for track in tracks:
        await build_track(track)


if __name__ == "__main__":
    asyncio.run(main())
