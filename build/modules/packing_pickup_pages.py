import shutil, glob, csv, os

# 任意のフォルダに含まれるすべてのファイルのパスを取得
def get_files(folder_path, extension):
    return glob.glob(f"{folder_path}/*.{extension}")


# 任意のフォルダに含まれるすべてのフォルダ名を取得
def get_folders(folder_path):
    files = os.listdir(folder_path)
    return [f for f in files if os.path.isdir(os.path.join(folder_path, f)) and "." not in f]


def read_csv(target_path):
    with open(target_path) as f:
        reader = csv.reader(f)
        input_list = [tmp for tmp in reader]
    return input_list


# マンガのデータ名を正式名称に補完する
def complement_title(title, title_list):
    for i in range(len(title_list)):
        if title_list[i].startswith(title):
            return title_list[i]


# 各漫画の画像が入っているフォルダから指定の画像をリネームして出力先にコピー
def copy_img(image_path, output_path):
    shutil.copyfile(image_path + ".jpg", output_path + ".jpg")
