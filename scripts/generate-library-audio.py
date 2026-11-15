import asyncio
import json
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "scripts" / "library-audio.json"
OUTPUT_DIR = ROOT / "public" / "audio" / "readings"


async def synthesize(item: dict, path: Path) -> None:
    for attempt in range(3):
        try:
            communicate = edge_tts.Communicate(item["text"], item["voice"], rate=item["rate"])
            await communicate.save(str(path))
            return
        except Exception:
            if attempt == 2:
                raise
            await asyncio.sleep(1.5)


async def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    items = json.loads(SOURCE.read_text(encoding="utf-8"))
    for item in items:
        path = OUTPUT_DIR / f"{item['id']}.mp3"
        if path.exists() and path.stat().st_size > 1000:
            print(f"skip {path.name}")
            continue
        await synthesize(item, path)
        print(f"{path.name}: {path.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    asyncio.run(main())
