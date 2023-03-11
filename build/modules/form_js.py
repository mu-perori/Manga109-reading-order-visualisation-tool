from bs4 import BeautifulSoup

# 各タグのid、xyの最大値最小値が入った辞書を返す
def get_coordinate_dict(tag):
    obj_id = tag.get("id")
    xmin = tag.get("xmin")
    ymin = tag.get("ymin")
    xmax = tag.get("xmax")
    ymax = tag.get("ymax")
    return {"id": obj_id, "xmin": xmin, "ymin": ymin, "xmax": xmax, "ymax": ymax}


# page_dictに指定したタグの座標辞書のリストを入れる
def add_page_dict(page_dict, page, tag_name, key_name):
    got_list = page.find_all(tag_name)
    made_list = []
    for item in got_list:
        made_dict = get_coordinate_dict(item)
        if tag_name == "text":
            made_dict["dialogue"] = item.get_text().replace("\u3000", "").replace("\n", "")
        elif tag_name == "face" or tag_name == "body":
            made_dict["characterId"] = item.get("character")
        made_list.append(made_dict)
    if made_list != []:
        page_dict[key_name] = made_list
