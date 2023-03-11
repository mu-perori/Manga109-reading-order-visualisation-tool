import json

from modules import packing_pickup_pages as ppp, packing, v3, json_convert


def to_js(json_path, output_path):
    # アノテーション結果を変換するときのパス
    annotators = ppp.get_folders(json_path)
    json_name = "マンガ読み順評価用データセット_"

    for annotator in annotators:
        # 出力用リストを定義
        output_list = []

        for i in range(171):
            # JSON読み込み
            order_f, order_t = get_order(f"{json_path}/{annotator}/{json_name}{str(i).zfill(3)}")
            # コマ読み順辞書作成
            frame_dict = {}
            for j in range(len(order_f)):
                frame_dict[order_f[j]] = j + 1
            # テキスト読み順辞書作成
            text_dict = {}
            for j in range(len(order_t)):
                text_dict[order_t[j]] = j + 1
            # 出力用リストにこのページの辞書全てを入れた辞書を追加
            output_list.append(
                {
                    "index": i,
                    "frame_dict": frame_dict,
                    "text_dict": text_dict,
                    "alignment_dict": {},
                }
            )

        # JSファイルとして出力
        output_js(output_path, annotator, output_list)


# JSONの読み込み
def read_json(target_path):
    with open(f"{target_path}.json", "r") as f:
        input_dict = json.load(f)
    return input_dict


def get_order(target_path):
    input_dict = read_json(target_path)
    return input_dict["framesOrder"], input_dict["textOrder"]


# JavaScriptとして書き出し
def output_js(output_path, output_name, output_list):
    with open(f"{output_path}/{output_name}.js", "w") as f:
        output_text = f"const {output_name} = " + str(output_list).replace(
            "'index'", "index"
        ).replace("'frame_dict'", "frame_dict").replace("'test_dict'", "test_dict")
        f.write(output_text)
