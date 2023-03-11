#!/usr/bin/python3

import argparse

from modules import packing, v3, json_convert


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-i", "--input", help="input path", required=True)
    parser.add_argument("-o", "--output", help="output path", required=True)
    parser.add_argument("-a", "--annotation", help="annotation result path", required=True)
    parser.add_argument(
        "-v",
        "--version",
        help="version of annotation tool to build",
        choices=["3"],
        default="3",
    )

    args = parser.parse_args()

    src_path = args.version
    if src_path == "3":
        src_path = "version3"

    # ピックアップ.csvとManga109からcoordinates.jsを作成
    v3.form_data(args.input, args.output, src_path)
    # アノテーション結果をjsに変換
    json_convert.to_js(args.annotation, args.output)

    packing.copy_html(args.output, src_path)
    packing.copy_visualisation(args.output, src_path)
    packing.copy_css(args.output, src_path)


main()
