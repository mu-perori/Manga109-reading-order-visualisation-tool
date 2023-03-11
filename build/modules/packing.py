# 画像ファイルとannotation.jsとindex.cssを出力先にコピー

import shutil

# visualisation.jsを出力先にコピー
def copy_visualisation(output_path, src_path):
    shutil.copy(src_path + "/visualisation.js", output_path)


# index.cssを出力先にコピー
def copy_css(output_path, src_path):
    shutil.copy(src_path + "/index.css", output_path)


# annotation_tool.htmlを出力先にコピー
def copy_html(output_path, src_path):
    shutil.copy(src_path + "/visualisation_tool.html", output_path)
