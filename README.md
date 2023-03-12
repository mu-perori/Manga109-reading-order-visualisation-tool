# Manga109 Reading Order Visualisation Tool
これは[Manga109データセット](http://www.manga109.org/ja/index.html)に含まれるマンガのコマ・テキストの読み順を[Manga109 Annotation Application](https://github.com/mu-perori/Manga109_AnnotationApp)でアノテーションした結果を可視化するWebアプリです。

## 必要なソフトウェア
- Python 3
- ブラウザ

## 動作環境
次の環境で動作することを確認しています。
- OS: macOS 12.6.3
- ブラウザ: Google Chrome 110.0.5481.177, Safari 16.3
- Python 3.8

## 使い方
アノテーションツールを利用するには以下の2ステップを行う必要があります:
1. 使用環境の構築。あらかじめ用意されたPythonスクリプトを実行して、Manga109データセットから、アノテーション対象のデータとツールの実行環境を作成します。
1. 作成したツールの実行環境を利用して、アノテーションを行います。

### 使用環境の構築
1. [Manga109データセット](http://www.manga109.org/ja/download.html)をダウンロードします。
1. [このプロジェクトのコードをダウンロード](https://github.com/mu-perori/Manga109-reading-order-visualisation-tool/archive/refs/tags/v3.0.zip)して、解凍します。
1. [アノテーション結果をダウンロード](https://github.com/mu-perori/Manga109-reading-order-dataset/archive/refs/tags/v3.0.zip)して、解凍します。
1. ターミナルから以下のコマンドを実行し、コードが置いてあるフォルダに移動して必要なパッケージをインストールします。
   ```
   cd path/to/Manga109_AnnotationApp
   python3 -m pip install -r requirements.txt
   ```
1. ターミナルから以下のコマンドを実行すると、使用環境用のフォルダ
が作成され、そのフォルダ内に作品ごとのフォルダとデータが作成されます。
   ```
   python3 build/build.py -i <ダウンロードしたManga109データセットのフォルダのパス> -o <使用環境用のフォルダのパス> -a <アノテーション結果のフォルダのパス>
   ```

### 使用方法
1. 使用環境フォルダ内にある`visualisation_tool.html`をブラウザで開きます。
1. [アノテータ1]をクリックするとアノテータ1によるコマの読み順のアノテーション結果が表示されます。他のアノテータの結果も同様に表示することができます。
1. [次の段階に進む]を押すとテキストの読み順のアノテーション結果を表示できます。
1. 別のページのアノテーション結果を確認したい場合は[次のページ]もしくは[前のページ]を押してページを移動してください。

注：テキストの読み順の段階から、さらに[次の段階に進む]を押すとコマとテキストの矩形が描画されますが、アノテーション結果は表示されません。

