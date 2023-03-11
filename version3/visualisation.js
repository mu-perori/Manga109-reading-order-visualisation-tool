// 定数
const sizeDown = 0.56;
const black = [0, 0, 0];
const green = [0, 153, 51];
const yellow = [255, 204, 0];
// const gray = [150, 150, 150];
// const white = [255, 255, 255];

const title = coordinateData["title"];
const pages = coordinateData["pages"];

const imgPath = "images/"; // テストと配布版で異なる場合があるから注意

const pageClassList = ["第一四分位数", "中央値", "最大値"];

// 各ページの座標データおよび作品データ
let pageData;

// カウンタ
let dataIndex = 0;

// 各ページのオブジェクトを入れるリスト
let boxItems;

// 表示に関する変数
let bgImage;
let bgLayer;
let boxLayer;
let numberingLayer; // 数字レイヤー
let imageObj;

// 各段階のクラスのインスタンスを入れる変数
let presentProcess;

// クラス
const BoxObj = function (rectDict, textDict, rgb) {
	this.box = new Konva.Rect(rectDict);
	this.numbering = new Konva.Text(textDict);
	this.rgb = rgb;
};

const PageData = function (frame, text, genre, mangaTitel, pageIndex, pageClass) {
	// frameがundefinedだった場合[]を代入する
	this.frame = frame || [];
	this.text = text || [];
	this.genre = genre;
	this.mangaTitel = mangaTitel;
	this.pageIndex = pageIndex;
	this.pageClass = pageClass;
};

// コマ順クラス(FramesOrderClass)
const FramesOrderClass = function () {
	this.processName = "frame";
	// boxItemsを初期化してからboxのインスタンスのリストを作成(何のboxを作るかが違う)
	this.makeBoxInstance = () => {
		boxItems = [];
		makeBoxList(pageData.frame, "frame", green, boxItems);
		boxItems = sortBox(boxItems);
	};
	// ボタンの色の初期化(previous-processの色が違う)
	this.settingHtml = () => {
		// ボタンの色を変える
		cssGray("previous-process", "yellow-process-button");
		cssColor("next-process", "yellow-process-button");
		$("#annotator").replaceWith('<p id="annotator">アノテーション結果非表示</p>');
	};
	// 前の段階に戻る
	this.goPreviousProcess = () => {
		// コマの読み順より前の段階は無いから空
	};
	// 次の段階に進む
	this.goNextProcess = () => {
		resetLayer();
		if (pageData.text.length != 0) {
			presentProcess = new TextsOrderClass();
		} else {
			presentProcess = new ConnectingFrameAndTextClass();
		}
		visualisationFunc();
	};
};

// テキスト順クラス(TextsOrderClass)
const TextsOrderClass = function () {
	this.processName = "text";
	// boxItemsを初期化してからboxのインスタンスのリストを作成(何のboxを作るかが違う)
	this.makeBoxInstance = () => {
		boxItems = [];
		makeBoxList(pageData.text, "text", yellow, boxItems);
		boxItems = sortBox(boxItems);
	};
	// ボタンの内容と色の初期化( previous-processの色が違う)
	this.settingHtml = () => {
		// ボタンの色を変える
		cssColor("previous-process", "yellow-process-button");
		cssColor("next-process", "yellow-process-button");
		$("#annotator").replaceWith('<p id="annotator">アノテーション結果非表示</p>');
	};
	// 前の段階に戻る
	this.goPreviousProcess = () => {
		resetLayer();
		presentProcess = new FramesOrderClass();
		visualisationFunc();
	};
	// 次の段階に進む
	this.goNextProcess = () => {
		resetLayer();
		presentProcess = new ConnectingFrameAndTextClass();
		visualisationFunc();
	};
};

// 対応関係クラス(ConnectingFrameAndTextClass)
const ConnectingFrameAndTextClass = function () {
	this.processName = "alignment";

	// boxItemsを初期化してからboxのインスタンスのリストを作成
	this.makeBoxInstance = () => {
		boxItems = [];
		makeBoxList(pageData.frame, "frame", green, boxItems);
		makeBoxList(pageData.text, "text", yellow, boxItems);
		boxItems = sortBox(boxItems);
	};
	// ボタンの内容と色の初期化
	this.settingHtml = () => {
		// ボタンの色を変える
		if (pageData.frame != 0) {
			cssColor("previous-process", "yellow-process-button");
		} else {
			cssGray("previous-process", "yellow-process-button");
		}
		cssGray("next-process", "yellow-process-button");
		$("#annotator").replaceWith('<p id="annotator">アノテーション結果非表示</p>');
	};

	// 前の段階に戻る
	this.goPreviousProcess = () => {
		resetLayer();
		if (pageData.text.length != 0) {
			// テキストがある場合はテキスト順に戻る
			presentProcess = new TextsOrderClass();
		} else {
			// テキストが無い場合はコマ順に戻る
			presentProcess = new FramesOrderClass();
		}
		visualisationFunc();
	};
	this.goNextProcess = () => {
		// 対応関係の次の段階は無いから空
	};
};

// 関数
// boxのオブジェクトを作成する
const makeBoxObj = (xy, objName, rgb) => {
	const xmin = xy["xmin"] * sizeDown;
	const ymin = xy["ymin"] * sizeDown;
	const xmax = xy["xmax"] * sizeDown;
	const ymax = xy["ymax"] * sizeDown;
	const w = xmax - xmin;
	const h = ymax - ymin;
	const rectDict = {
		x: xmin, //配置場所
		y: ymin, //配置場所
		width: w, //横幅
		height: h, //高さ
		stroke: "rgba(" + rgb + ", 1" + ")", //枠線の色
		strokeWidth: 3, //枠線の太さ
		name: objName, //HTML要素でいうところのclass
		id: xy["id"], //HTML要素でいうところのid
	};
	const textDict = {
		x: (xmin + xmax) / 2 - 17*1.5, //配置場所
		y: (ymin + ymax) / 2 - 15*1.5, //配置場所
		width: 35*1.5, //表示される範囲の横幅
		height: 30*1.5, //表示される範囲の高さ
		text: "88", // 表示する内容（表示するタイミングで内容を変える）
		fontSize: 30*1.5,
		fontStyle: "bold",
		align: "center",
		stroke: "rgba(" + black + ", 0" + ")",
		strokeWidth: 1.5, //枠線の太さ
		fill: "rgba(" + rgb + ", 0" + ")",
		name: objName, //HTML要素でいうところのclass
		id: xy["id"], //HTML要素でいうところのid
	};
	const newBox = new BoxObj(rectDict, textDict, rgb);
	return newBox;
};

// boxを作成し、itemsに入れる
const makeBoxList = (xys, objName, rgb, itemList) => {
	let newBox;
	for (let i = 0; i < xys.length; i++) {
		newBox = makeBoxObj(xys[i], objName, rgb);
		itemList.push(newBox);
	}
};

// サイドバーの表示・ボタンの色
// サイドバーの情報を更新する
const renewSidebarInfo = () => {
	$("#page-counter").replaceWith(
		'<p id = "page-counter">' + String(dataIndex + 1) + "/" + pages.length + "枚目" + "</p>"
	);
	$("#page-class").replaceWith(
		'<p id = "page-class">分類：' + pageClassList[parseInt(pageData.pageClass, 10) - 1] + "</p>"
	);
	$("#genre").replaceWith('<p id = "genre">ジャンル：' + pageData.genre + "</p>");
	$("#manga-title").replaceWith('<p id = "manga-title">作品名：' + pageData.mangaTitel + "</p>");
};

// ボタンの色をカラーにする
const cssColor = (targetId, buttonClass) => {
	$("#" + targetId).removeClass("cant-push");
	$("#" + targetId).addClass(buttonClass);
};

// ボタンの色をグレーにする
const cssGray = (targetId, buttonClass) => {
	$("#" + targetId).removeClass(buttonClass);
	$("#" + targetId).addClass("cant-push");
};

// アラート
// 続きから閲覧するか否かの確認
const confirmContinuation = () => {
	let options = {
		title: "再開するページの選択",
		text: "前回の続きから閲覧しますか？",
		buttons: {
			beginning: {text: "最初から", value: "beginning"},
			continuation: {text: "続きから", value: "continuation"},
			optional: {text: "任意のページから", value: "optional"},
		}, // 上から順に右から表示される
	};
	swal(options).then((value) => {
		switch (value) {
			case "beginning":
				//最初から
				main();
				break;
			case "continuation":
				//続きから
				dataIndex = Number(cache);
				main();
				break;
			default:
				//任意のページから
				confirmInputPageIndex();
				break;
		}
	});
};

// 任意のページから再開する場合の入力ウィンドウ
const confirmInputPageIndex = () => {
	let options = {
		title: "再開するページの選択",
		text: "何ページ目から再開しますか？\nページ番号を半角で入力し、OKを押してください。\n(キャンセルの場合は未入力)",
		content: {
			element: "input",
			attributes: {
				placeholder: "1~" + String(pages.length),
			},
		},
	};
	swal(options).then((value) => {
		value = Number(value);
		if (value <= String(pages.length) && value > 0 && Number.isInteger(value)) {
			//正しい値が入力された場合、入力されたページから再開
			dataIndex = value - 1;
			main();
		} else if (value == 0) {
			//キャンセルされた場合、前のアラートに戻る
			confirmContinuation();
		} else {
			//入力された値が正しくない場合
			swal(
				"入力エラー",
				"値にミスがないか、全角入力ではないかなどを\n確認してください。",
				"warning"
			).then((value) => {
				if (value) {
					confirmInputPageIndex();
				}
			});
		}
	});
};

// 部品になる関数
// リストの中身をboxの面積が大きい順に並べ替える
const sortBox = (boxList) => {
	let firstArea;
	let secondArea;
	boxList.sort(function (first, second) {
		firstArea = first.box.width() * first.box.height();
		secondArea = second.box.width() * second.box.height();
		if (firstArea > secondArea) {
			return -1;
		} else if (firstArea < secondArea) {
			return 1;
		} else {
			return 0;
		}
	});
	return boxList;
};

// boxLayerの初期化
const resetLayer = () => {
	boxLayer.remove();
	numberingLayer.remove();
	boxLayer = new Konva.Layer(); //図形などの要素は後で追加する
	numberingLayer = new Konva.Layer();
	stage.add(boxLayer, numberingLayer);
};

// ページを移動する
const goOtherPage = (direction) => {
	if (direction == "next-page") {
		dataIndex++;
	}
	if (direction == "previous-page") {
		dataIndex--;
	}
	localStorage.setItem(title + "_pageIndex", dataIndex);
	bgLayer.remove();
	boxLayer.remove();
	main();
};

// 数字を描画する
const numberingDisplay = (boxItems, numberingDict) => {
	boxItems.forEach((item) => {
		item.numbering.text(numberingDict[item.numbering.attrs.id]);
		item.numbering.stroke("rgba(" + black + ", 1" + ")");
		item.numbering.fill("rgba(" + item.rgb + ", 1" + ")");
	});
	numberingLayer.draw();
};

// 可視化関数(visualisationFunc)
const visualisationFunc = () => {
	presentProcess.makeBoxInstance(); // boxItemsを初期化してからboxのインスタンスのリストを作成
	// boxLayerの初期描画
	boxItems.forEach((item) => {
		boxLayer.add(item.box);
		numberingLayer.add(item.numbering);
	});
	boxLayer.draw();
	numberingLayer.draw();
	// ボタンの内容と色
	presentProcess.settingHtml();
};

// main
let main = () => {
	// dataIndexページ目の座標などのデータの読み込み
	pageData = new PageData(
		pages[dataIndex]["frame"],
		pages[dataIndex]["text"],
		pages[dataIndex]["genre"],
		pages[dataIndex]["mangaTitel"],
		pages[dataIndex]["pageIndex"],
		pages[dataIndex]["pageClass"]
	);
	// レイヤーのインスタンスを作成し、背景画像を読み込んで描画する
	bgLayer = new Konva.Layer();
	boxLayer = new Konva.Layer(); //図形などの要素は後で追加する
	numberingLayer = new Konva.Layer(); // 数字レイヤー
	imageObj = new Image();

	imageObj.src = imgPath + String(dataIndex).padStart(3, 0) + ".jpg";
	imageObj.onload = function () {
		bgImage = new Konva.Image({
			x: 0,
			y: 0,
			image: imageObj,
			width: 1654 * sizeDown,
			height: 1170 * sizeDown,
		});

		bgLayer.add(bgImage);
		stage.add(bgLayer, boxLayer, numberingLayer);
		bgLayer.draw();
	};
	// サイドバーのページ数とページ移動ボタンの色
	renewSidebarInfo();
	if (dataIndex == 0) {
		cssGray("previous-page", "green-page-button");
	} else {
		cssColor("previous-page", "green-page-button");
	}
	if (dataIndex == pages.length) {
		cssGray("next-page", "green-page-button");
	} else {
		cssColor("next-page", "green-page-button");
	}

	// presentProcessのインスタンスを作成
	presentProcess = new FramesOrderClass();

	// TODO: コマが無い場合の処理を書いているが必要性要検討
	if (pageData.frame.length == 0) {
		presentProcess = new ConnectingFrameAndTextClass();
	}

	visualisationFunc(); // 可視化関数の呼び出し
};

// 実行部分
// ステージのインスタンスを作成
const stage = new Konva.Stage({
	container: "canvas", // 親要素のdivタグのidを指定
	width: 1654 * sizeDown, //キャンバスの横幅
	height: 1170 * sizeDown, //キャンバスの高さ
});
// キャッシュを確認してページの記録がある場合は読み込む
const cache = localStorage.getItem(title + "_pageIndex");
if (cache != null) {
	confirmContinuation();
} else {
	main();
}

// ボタンの動作(最初に押せる時の条件を入れるのを忘れずに)
// 表示切り替えボタン
$("#machi").on("click", () => {
	let key = `${presentProcess.processName}_dict`;
	let numberingDict = annotater1[dataIndex][key];
	numberingDisplay(boxItems, numberingDict);
	$("#annotator").replaceWith('<p id="annotator">アノテータ1</p>');
});

$("#tsuchiya").on("click", () => {
	let key = `${presentProcess.processName}_dict`;
	let numberingDict = annotater2[dataIndex][key];
	numberingDisplay(boxItems, numberingDict);
	$("#annotator").replaceWith('<p id="annotator">アノテータ2</p>');
});

$("#machida").on("click", () => {
	let key = `${presentProcess.processName}_dict`;
	let numberingDict = annotater3[dataIndex][key];
	numberingDisplay(boxItems, numberingDict);
	$("#annotator").replaceWith('<p id="annotator">アノテータ3</p>');
});

$("#hide").on("click", () => {
	let numberingDict = {};
	numberingDisplay(boxItems, numberingDict);
	$("#annotator").replaceWith('<p id="annotator">アノテーション結果非表示</p>');
});

// 前の段階に戻る
$("#previous-process").on("click", () => {
	// コマが一つも無い場合は押せない
	if (pageData.frame.length != 0) {
		presentProcess.goPreviousProcess(); // コマ順の場合は空
	}
});

// 次の段階に進む
$("#next-process").on("click", () => {
	presentProcess.goNextProcess(); // 対応関係の場合は空
});

// 次のページに進む
$("#next-page").on("click", () => {
	// 次のページがある
	if (dataIndex < pages.length - 1) {
		goOtherPage("next-page"); // 移動する
	} else {
		swal("最終ページです。");
	}
});

// 前のページに戻る
$("#previous-page").on("click", () => {
	// 前のページがある
	if (dataIndex >= 1) {
		goOtherPage("previous-page"); // 移動する
	}
});
