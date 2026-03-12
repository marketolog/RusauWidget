#!/usr/bin/env python3
"""
Build script: reads widget.source.js, injects base64-encoded SVG icons,
outputs widget.js — a fully self-contained embeddable script.
"""
import base64
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))

def svg_data_uri(path):
    with open(path, 'rb') as f:
        data = f.read()
    b64 = base64.b64encode(data).decode('ascii')
    return 'data:image/svg+xml;base64,' + b64

def build():
    source_path = os.path.join(ROOT, 'widget.source.js')
    output_path = os.path.join(ROOT, 'widget.js')

    with open(source_path, 'r', encoding='utf-8') as f:
        source = f.read()

    icon1_uri = svg_data_uri(os.path.join(ROOT, 'img', 'icon1.svg'))
    icon2_uri = svg_data_uri(os.path.join(ROOT, 'img', 'icon2.svg'))
    icon3_uri = svg_data_uri(os.path.join(ROOT, 'img', 'icon3.svg'))

    output = source
    output = output.replace("'ICON1_PLACEHOLDER'", "'" + icon1_uri + "'")
    output = output.replace("'ICON2_PLACEHOLDER'", "'" + icon2_uri + "'")
    output = output.replace("'ICON3_PLACEHOLDER'", "'" + icon3_uri + "'")

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(output)

    size_kb = os.path.getsize(output_path) / 1024
    print(f'✓ widget.js built successfully — {size_kb:.1f} KB')
    print(f'  Icon 1: {len(icon1_uri) // 1024} KB')
    print(f'  Icon 2: {len(icon2_uri) // 1024} KB')
    print(f'  Icon 3: {len(icon3_uri) // 1024} KB')

if __name__ == '__main__':
    build()
