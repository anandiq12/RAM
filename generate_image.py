import argparse
import base64
import os
import sys
from pathlib import Path

from openai import OpenAI, OpenAIError


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate an image from a prompt and save it as a PNG."
    )
    parser.add_argument(
        "prompt",
        nargs="?",
        help="Image description. If omitted, you will be prompted in the terminal.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("generated_image.png"),
        help="PNG output path (default: generated_image.png).",
    )
    parser.add_argument(
        "--size",
        choices=("auto", "1024x1024", "1536x1024", "1024x1536"),
        default="1024x1024",
        help="Image dimensions (default: 1024x1024).",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    prompt = (args.prompt if args.prompt is not None else input("Image prompt: ")).strip()
    if not prompt:
        print("Error: the image prompt cannot be empty.", file=sys.stderr)
        return 2

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print(
            "Error: OPENAI_API_KEY is not set. Set it in your terminal, then rerun this command.",
            file=sys.stderr,
        )
        return 2

    try:
        response = OpenAI(api_key=api_key).images.generate(
            model="gpt-image-1",
            prompt=prompt,
            size=args.size,
            output_format="png",
        )
    except OpenAIError as error:
        print(f"Image generation failed: {error}", file=sys.stderr)
        return 1

    if not response.data or not response.data[0].b64_json:
        print("Image generation failed: the API returned no PNG image data.", file=sys.stderr)
        return 1

    output_path = args.output
    if output_path.suffix.lower() != ".png":
        output_path = output_path.with_suffix(".png")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(base64.b64decode(response.data[0].b64_json, validate=True))
    print(f"Image saved to {output_path.resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
