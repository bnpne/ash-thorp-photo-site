#!/usr/bin/env python3
"""
Utility script to ingest photos under ./PHOTOS and append new photoBase documents
to the extracted Sanity production export.

The script generates:
- ASCII art (96x79 grid) for each photo
- Ghost metadata blocks matching the existing stylistic format
- Updated photo metadata (dimensions + palette)
- Asset manifest entries for the newly added images
- Copied image assets into the extracted export images directory

Outputs are written directly into:
export/extracted/<production-export>/data.ndjson
export/extracted/<production-export>/assets.json
"""

from __future__ import annotations

import hashlib
import json
import math
import os
import random
import re
import shutil
import string
import subprocess
import sys
import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Iterable, List

ROOT = Path(__file__).resolve().parents[1]
PHOTOS_DIR = ROOT / "PHOTOS"
EXTRACTED_ROOT = ROOT / "export" / "extracted"

ASCII_WIDTH = 96
ASCII_HEIGHT = 79
ASCII_GRADIENT = "@#%*+=-:. "

# Precompiled regexes for parsing ImageMagick output
_TXT_LINE_RE = re.compile(r"^(?P<x>\d+),(?P<y>\d+):.*gray\((?P<value>\d+)\)")
_PIXEL_RE = re.compile(r"\d+(?:\.\d+)?")
_FILENAME_INDEX_RE = re.compile(r"\((\d+)\)")


class GenerationError(RuntimeError):
    """Raised when required external tooling fails."""


@dataclass
class PhotoInfo:
    source_path: Path
    index: int
    sha1: str
    width: int
    height: int
    size: int
    asset_filename: str
    palette: Dict[str, Dict[str, object]]
    ascii_art: str
    ghost_meta: List[Dict[str, object]]
    title: str
    slug: str
    created_at: str
    rev: str
    sanity_asset: str


def find_production_export_root() -> Path:
    candidates = sorted(EXTRACTED_ROOT.glob("production-export-*"))
    if not candidates:
        raise GenerationError(
            "No extracted production export found under export/extracted/. "
            "Unpack export/production.tar.gz before running this script."
        )
    if len(candidates) > 1:
        # Pick the most recent directory lexicographically (matches timestamp ordering)
        target = candidates[-1]
    else:
        target = candidates[0]
    return target


def natural_photo_sort_key(path: Path) -> tuple[int, str]:
    match = _FILENAME_INDEX_RE.search(path.name)
    index = int(match.group(1)) if match else 0
    return (index, path.name)


def run_magick(args: Iterable[str]) -> str:
    full_cmd = ["magick", *args]
    try:
        result = subprocess.run(
            full_cmd,
            check=True,
            capture_output=True,
            text=True,
        )
    except subprocess.CalledProcessError as exc:
        raise GenerationError(f"ImageMagick command failed: {' '.join(full_cmd)}") from exc
    return result.stdout.strip()


def compute_sha1(path: Path) -> str:
    hasher = hashlib.sha1()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            hasher.update(chunk)
    return hasher.hexdigest()


def fetch_dimensions(path: Path) -> tuple[int, int]:
    output = run_magick(["identify", "-format", "%w %h", str(path)])
    try:
        width_str, height_str = output.split()
        return int(width_str), int(height_str)
    except ValueError as exc:
        raise GenerationError(f"Unable to parse dimensions from '{output}'") from exc


def fetch_average_color(path: Path) -> tuple[int, int, int]:
    output = run_magick([str(path), "-resize", "1x1!", "-format", "%[pixel:p{0,0}]", "info:"])
    numbers = list(map(float, _PIXEL_RE.findall(output)))
    if len(numbers) == 1:
        numbers = numbers * 3
    elif len(numbers) < 3:
        raise GenerationError(f"Unable to parse average color from '{output}'")
    converted: List[int] = []
    for idx, value in enumerate(numbers[:3]):
        if "%" in output:
            converted_value = int(round(clamp(value, 0.0, 100.0) * 2.55))
        elif value <= 1.0:
            converted_value = int(round(clamp(value, 0.0, 1.0) * 255))
        else:
            converted_value = int(round(clamp(value, 0.0, 255.0)))
        converted.append(converted_value)
    return tuple(converted)


def clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


def adjust_color(rgb: tuple[int, int, int], factor: float) -> tuple[int, int, int]:
    return tuple(int(round(clamp(channel * factor, 0, 255))) for channel in rgb)


def rgb_to_hex(rgb: tuple[int, int, int]) -> str:
    return "#{:02x}{:02x}{:02x}".format(*rgb)


def choose_foreground(rgb: tuple[int, int, int]) -> str:
    luminance = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
    return "#000" if luminance > 150 else "#fff"


def build_palette(base_rgb: tuple[int, int, int], rng: random.Random) -> Dict[str, Dict[str, object]]:
    swatch_defs = {
        "darkMuted": adjust_color(base_rgb, 0.65),
        "darkVibrant": adjust_color(base_rgb, 0.55),
        "dominant": base_rgb,
        "lightMuted": adjust_color(base_rgb, 1.15),
        "lightVibrant": adjust_color(base_rgb, 1.3),
        "muted": adjust_color(base_rgb, 0.95),
        "vibrant": adjust_color(base_rgb, 1.2),
    }
    palette: Dict[str, Dict[str, object]] = {"_type": "sanity.imagePalette"}
    for key, color in swatch_defs.items():
        background = rgb_to_hex(color)
        foreground = choose_foreground(color)
        palette[key] = {
            "_type": "sanity.imagePaletteSwatch",
            "background": background,
            "foreground": foreground,
            "population": round(rng.uniform(0.01, 18.0), 2),
            "title": foreground,
        }
    return palette


def create_ascii_grid(path: Path) -> List[List[int]]:
    output = run_magick(
        [
            str(path),
            "-resize",
            f"{ASCII_WIDTH}x{ASCII_HEIGHT}!",
            "-colorspace",
            "Gray",
            "-depth",
            "8",
            "txt:-",
        ]
    )
    lines = output.splitlines()
    if not lines:
        raise GenerationError("No output received while generating ASCII grid.")
    header = lines[0]
    if f"{ASCII_WIDTH},{ASCII_HEIGHT}" not in header:
        raise GenerationError(f"Unexpected header line: '{header}'")
    grid = [[0 for _ in range(ASCII_WIDTH)] for _ in range(ASCII_HEIGHT)]
    for line in lines[1:]:
        match = _TXT_LINE_RE.match(line)
        if not match:
            continue
        x = int(match.group("x"))
        y = int(match.group("y"))
        value = int(match.group("value"))
        grid[y][x] = value
    return grid


def grid_to_ascii(grid: List[List[int]]) -> str:
    rows: List[str] = []
    for row in grid:
        chars = []
        for value in row:
            normalized = clamp(value / 255.0, 0.0, 1.0)
            index = int(round((1.0 - normalized) * (len(ASCII_GRADIENT) - 1)))
            chars.append(ASCII_GRADIENT[index])
        rows.append("".join(chars))
    return "\n".join(rows)


def rand_key(rng: random.Random, length: int | None = None) -> str:
    length = length or rng.choice([12, 13, 14, 15, 16])
    return "".join(rng.choice(string.hexdigits.lower()) for _ in range(length))


def random_rev(rng: random.Random) -> str:
    alphabet = string.ascii_letters + string.digits
    return "".join(rng.choice(alphabet) for _ in range(22))


def random_upload_id(rng: random.Random) -> str:
    alphabet = string.ascii_letters + string.digits
    return "".join(rng.choice(alphabet) for _ in range(26))


def generate_memory_bar(rng: random.Random, width: int = 54) -> str:
    blocks = "█▓▒░"
    return "".join(rng.choice(blocks) for _ in range(width))


def build_ghost_meta(
    asset_filename: str,
    dimensions: tuple[int, int],
    palette_hex: str,
    ascii_body: str,
    rng: random.Random,
) -> List[Dict[str, object]]:
    width, height = dimensions
    node_code = f"{rng.randint(10, 99)}{rng.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}"
    ping_suffix = f"⚠︎LIGHTLOCK.protocol.{rng.randint(40, 92)}"
    stream_rate = rng.randint(2450, 3650)
    firmware = f"FIRMWARE_V{rng.randint(2, 7)}.{rng.randint(0, 999):03d}{rng.choice('abcxyz')}"
    angle = f"{rng.uniform(18.0, 88.0):.3f}°"
    viewport = f"{width}x{height}"
    bleed_pct = rng.randint(57, 92)
    return_lambda = f"{rng.uniform(0.00001, 0.00009):.6f}"
    noise_map = f"{rng.uniform(24.0, 46.0):.2f}"
    bridge_suffix = f"X{rng.getrandbits(32):08x}"
    ambient_read = f"0x{rng.randint(0, 255):02X}"
    retry_count = rng.randint(0, 2)
    flux_ref = f"0x{rng.randint(0x80, 0xFF):02X}"
    trace_suffix = f"ghost{rng.randint(200, 999)}"
    trace_variant = rng.choice(["lumen-curve", "nocturne-grid", "umbra-mesh"])
    blur_flag = rng.choice(["Δ-locked", "Ω-free"])
    logfile_status = rng.choice(["SILENT", "NOISE"])
    echo_state = rng.choice(["opened", "sealed"])
    echo_visibility = rng.choice(["visible", "invisible"])

    def block(text: str) -> Dict[str, object]:
        return {
            "_key": rand_key(rng),
            "_type": "block",
            "style": "code",
            "children": [
                {
                    "_key": rand_key(rng, 16),
                    "_type": "span",
                    "marks": [],
                    "text": text,
                }
            ],
        }

    def ascii_block(text: str) -> Dict[str, object]:
        block_obj = block(text)
        block_obj["_key"] = rand_key(rng, 16)
        return block_obj

    memory_dump = (
        ":: MEMORY DUMP  \n"
        f"0x00:  {generate_memory_bar(rng)}  \n"
        f"0x10:  {generate_memory_bar(rng)}  \n"
        f"0x20:  ↳ LIGHT.POST.STATUS = ACTIVE::{firmware}  \n"
        f"0x30:  ↳ CAST.ANGLE = {angle} / NOISE_SHIFT[Z-{rng.randint(1, 9)}]  \n"
        f"0x40:  ↳ VIEWPORT = {viewport} • depth.index = -∞ to softFloor  "
    )

    auth_token = (
        ":: AUTH TOKEN — HORIZON.ENTRY [ status.ghost ]  \n"
        "0x50:  ───═⟨ENCODED⟩═───  \n"
        f"        {''.join(bin(rng.getrandbits(16))[2:].zfill(16)[i:i+4] + ' ' for i in range(0, 16, 4))} \n"
        f"        {''.join(bin(rng.getrandbits(16))[2:].zfill(16)[i:i+4] + ' ' for i in range(0, 16, 4))} \n"
        f"        {''.join(bin(rng.getrandbits(16))[2:].zfill(16)[i:i+4] + ' ' for i in range(0, 16, 4))} \n"
        f"0x60:  VALID | NO READ | OBSERVING ∷ {bleed_pct}% ∿ bleed.active  "
    )

    sys_port = (
        ":: SYS.PORT {  \n"
        f"  socket.ref = {rng.randint(1, 4):04d}:{rng.choice(['CAMERA.OBSCURA.NODE', 'SHADOW.GLASS.NODE', 'OPTIC.MATRIX.NODE'])},  \n"
        f"  node.bridge = /tmp/.lockref.{bridge_suffix},  \n"
        f"  return.λ = {return_lambda}±psi, drift.{rng.choice(['ok', 'stable', 'low'])},  \n"
        f"  night.fog = [{rng.choice(['ON', 'OFF'])}] :: DISTORTION NOISE_MAP {noise_map}dB  \n"
        "}"
    )

    subroutine = (
        ":: SUB-ROUTINE.REGISTER {  \n"
        f"  mod.sig[{rng.randint(1, 9):02d}] = SIG::{rng.choice(['LATCHED', 'IDLE', 'COILED'])}  \n"
        f"  ambient.read = {ambient_read} // null-light  \n"
        f"  CHROMA.ERR = {palette_hex} • locked loop ({rng.choice(['false color', 'phase drift'])})  \n"
        f"  liminal.ping = {rng.choice(['TIMEOUT', 'AWAKE'])} ∴ {rng.randint(1200, 4095):04d}h / retry={retry_count}  \n"
        f"  cast.flux::REF = {flux_ref} | REF.MODE: {rng.choice(['PASSTHROUGH', 'STATIC', 'ECHO'])}  \n"
        f"  trace.id = Δ/Δ/{rng.randint(20, 88)}/{rng.choice(['∅', 'Ω', 'Ξ'])}::log.trace_{trace_suffix}  \n"
        "}"
    )

    shadowlog = (
        ":: SHADOWLOG ++  \n"
        f"0x70:  φtrace.packet: /dev/sensor/{rng.randint(1, 999):03d}-{trace_variant}/  \n"
        f"0x71:  φblur.timecode: {rng.randint(0, 999):03d}.{rng.randint(0, 999):03d}.{rng.randint(0, 999):03d}.{rng.choice(['Δ', 'Ω', 'Ψ'])}-{blur_flag}  \n"
        f"0x72:  φdecode.path: ../sys/core/{rng.choice(['obscura', 'nocturne', 'archive'])}:{rng.choice(['failback', 'ghostline', 'mirror'])}  \n"
        f"0x73:  φlock-flag[{rng.randint(1, 4)}]: {rng.choice(['ON', 'OFF'])} / {rng.choice(['OVERRIDE_ATTEMPTED', 'ELEVATED'])} / {logfile_status}  \n"
        f"0x74:  φreturn.echo: {rng.randint(9, 18)}ms delay / night.key {echo_state} ({echo_visibility})  "
    )

    ascii_trace = f":: ASCII TRACE VISUAL ::\n\n{ascii_body}"

    return [
        block(f"[ :: SYSTEM/INDEX ACCESS • ZONE-V NODE.{node_code} • OVERRIDE :: FALSE ]"),
        block(
            ">_ FETCH : file://"
            f"{asset_filename} [     █  ] OK  \n"
            f">_ PING : 192.166.{rng.randint(120, 399)}.{ping_suffix} — ACCEPTED  \n"
            f">_ Σ SIGNAL : ΔΔΔΔΔΔ [ streaming {stream_rate}kb/sec ] • GHOST.CARRIER = YES  \n"
            f">_ LOGFILE : /zone/logs/NODE.{node_code}.log : *REDIRECTED  "
        ),
        block(memory_dump),
        block(auth_token),
        block(sys_port),
        block(subroutine),
        block(shadowlog),
        block(":: //eof"),
        ascii_block(ascii_trace),
    ]


def create_ascii_art(path: Path, rng: random.Random) -> str:
    grid = create_ascii_grid(path)
    ascii_body = grid_to_ascii(grid)
    return f":: ASCII TRACE VISUAL ::\n\n{ascii_body}"


def normalized_ascii_body(ascii_art: str) -> str:
    # Drop the header and blank line for embedding within ghost metadata
    lines = ascii_art.split("\n")
    if len(lines) < 3:
        return ""
    return "\n".join(lines[2:])


def collect_photo_info(
    photo_path: Path,
    index: int,
    start_time: datetime,
) -> PhotoInfo:
    sha1 = compute_sha1(photo_path)
    width, height = fetch_dimensions(photo_path)
    asset_filename = f"{sha1}-{width}x{height}{photo_path.suffix.lower()}"
    rng = random.Random(sha1)

    ascii_art = create_ascii_art(photo_path, rng)
    ascii_body = normalized_ascii_body(ascii_art)

    base_rgb = fetch_average_color(photo_path)
    palette = build_palette(base_rgb, rng)

    ghost_meta = build_ghost_meta(
        asset_filename=asset_filename,
        dimensions=(width, height),
        palette_hex=rgb_to_hex(base_rgb),
        ascii_body=ascii_body,
        rng=rng,
    )

    created_at = (start_time + timedelta(seconds=index)).isoformat(timespec="seconds") + "Z"
    rev = random_rev(rng)
    sanity_asset = f"image@file://./images/{asset_filename}"

    title = f"q4-{index}"
    slug = title

    return PhotoInfo(
        source_path=photo_path,
        index=index,
        sha1=sha1,
        width=width,
        height=height,
        size=photo_path.stat().st_size,
        asset_filename=asset_filename,
        palette=palette,
        ascii_art=ascii_art,
        ghost_meta=ghost_meta,
        title=title,
        slug=slug,
        created_at=created_at,
        rev=rev,
        sanity_asset=sanity_asset,
    )


def ensure_image_asset(photo_info: PhotoInfo, images_dir: Path) -> None:
    destination = images_dir / photo_info.asset_filename
    if not destination.exists():
        shutil.copy2(photo_info.source_path, destination)


def append_ndjson_entry(path: Path, entry: Dict[str, object]) -> None:
    with path.open("a", encoding="utf-8") as handle:
        json.dump(entry, handle, ensure_ascii=False, separators=(",", ":"))
        handle.write("\n")


def update_assets_manifest(assets_path: Path, photo_infos: List[PhotoInfo]) -> None:
    if assets_path.exists():
        with assets_path.open("r", encoding="utf-8") as handle:
            assets_data = json.load(handle)
    else:
        assets_data = {}

    for info in photo_infos:
        rng = random.Random(info.sha1 + "asset")
        assets_data[f"image-{info.sha1}"] = {
            "_createdAt": info.created_at,
            "_rev": random_rev(rng),
            "_updatedAt": info.created_at,
            "metadata": {
                "_type": "sanity.imageMetadata",
                "blurHash": "",
                "dimensions": {
                    "_type": "sanity.imageDimensions",
                    "aspectRatio": info.width / info.height if info.height else 0,
                    "height": info.height,
                    "width": info.width,
                },
                "exif": {
                    "_type": "sanity.imageExifMetadata",
                    "PixelXDimension": info.width,
                    "PixelYDimension": info.height,
                },
                "hasAlpha": False,
                "isOpaque": True,
                "lqip": "",
                "palette": info.palette,
            },
            "originalFilename": info.source_path.name,
            "sha1hash": info.sha1,
            "size": info.size,
            "uploadId": random_upload_id(rng),
        }

    with assets_path.open("w", encoding="utf-8") as handle:
        json.dump(assets_data, handle, ensure_ascii=False, separators=(",", ":"))


def generate_photo_base_entry(photo_info: PhotoInfo) -> Dict[str, object]:
    aspect_ratio = photo_info.width / photo_info.height if photo_info.height else 0
    entry = {
        "_createdAt": photo_info.created_at,
        "_id": f"drafts.{uuid.uuid4()}",
        "_rev": photo_info.rev,
        "_type": "photoBase",
        "_updatedAt": photo_info.created_at,
        "ascii": photo_info.ascii_art,
        "ghostMeta": photo_info.ghost_meta,
        "photo": {
            "_sanityAsset": photo_info.sanity_asset,
            "_type": "image",
            "metadata": {
                "dimensions": {
                    "_type": "sanity.imageDimensions",
                    "aspectRatio": aspect_ratio,
                    "height": photo_info.height,
                    "width": photo_info.width,
                },
                "palette": photo_info.palette,
            },
        },
        "slug": {"current": photo_info.slug},
        "title": photo_info.title,
    }
    return entry


def main() -> int:
    production_root = find_production_export_root()
    data_path = production_root / "data.ndjson"
    assets_path = production_root / "assets.json"
    images_dir = production_root / "images"

    photos = sorted(PHOTOS_DIR.glob("*.jpg"), key=natural_photo_sort_key)
    if not photos:
        print("No photos found under ./PHOTOS. Nothing to do.", file=sys.stderr)
        return 1

    images_dir.mkdir(parents=True, exist_ok=True)

    start_time = datetime.utcnow().replace(microsecond=0)
    photo_infos: List[PhotoInfo] = []

    for iteration, photo_path in enumerate(photos, start=1):
        info = collect_photo_info(photo_path, iteration, start_time)
        ensure_image_asset(info, images_dir)
        photo_infos.append(info)
        entry = generate_photo_base_entry(info)
        append_ndjson_entry(data_path, entry)
        print(f"Added photoBase for {photo_path.name} -> {info.title}")

    update_assets_manifest(assets_path, photo_infos)

    print(f"\nSuccessfully appended {len(photo_infos)} photoBase documents.")
    print(f"Updated assets manifest at {assets_path.relative_to(ROOT)}.")
    print(f"Image assets copied to {images_dir.relative_to(ROOT)}.")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except GenerationError as err:
        print(f"Error: {err}", file=sys.stderr)
        sys.exit(1)
