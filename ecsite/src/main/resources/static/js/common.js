let login = (event) => {
	//フォームが送信された時に、デフォルトだとフォームを送信するための通信がされてしまうので、preventDefault()を使用してデフォルトのイベントを止めます。
	event.preventDefault();
	let jsonString = {
			'userName': $('input[name=userName]').val(),
			'password': $('input[name=password]').val()
	};
	$.ajax({
		type: 'POST', //使用するHTTPメソッド、GET or POST
		url: '/ecsite/api/login',  //送信先のURL
		//JSON.stringify(jsのオブジェクト[, 関数/配列[,数値]]) でJavaScriptのオブジェクトをJSONにする。
		data: JSON.stringify(jsonString), //送信するデータ
		contentType: 'application/json',  //送信するデータのタイプ
		dataType: 'json',  //応答のデータの種類
		scriptCharset: 'utf-8'  //読み込んだスクリプトの文字コード(キャラセット)を指定する。
	})
	.then((result) => {
			let user = result;
			$('#welcome').text(` --ようこそ！${user.fullName}さん`);
			$('#hiddenUserId').val(user.id);
			$('input[name=userName]').val('');
			$('input[name=password]').val('');
		}, () => {
			console.error('Error: ajax connection failed.');
		}
	);
};

let addCart = (event) => {
	let tdList = $(event.target).parent().parent().find('td');
	
	let id = $(tdList[0]).text();
	let goodsName = $(tdList[1]).text();
	let price = $(tdList[2]).text();
	let count = $(tdList[3]).find('input').val();
	
	if (count === '0' || count === '') {
		alert('注文数が０または空欄です。')
		return;
	}
	
	let cart = {
			'id': id,
			'goodsName': goodsName,
			'price': price,
			'count': count
	}
	cartList.push(cart);
	
	let tbody = $('#cart').find('tbody');
	$(tbody).children().remove();
	// forEachにコールバック関数を指定している。第1引数は配列cartListの値、第2引数は配列のインデックス番号（第3引数に現在処理している配列を指定することも可能）。
	cartList.forEach(function(cart, index) {
		let tr = $('<tr />');
		
		$('<td />', { 'text': cart.id }).appendTo(tr);
		$('<td />', { 'text': cart.goodsName }).appendTo(tr);
		$('<td />', { 'text': cart.price }).appendTo(tr);
		$('<td />', { 'text': cart.count }).appendTo(tr);
		let tdButton = $('<td />');
		$('<button />', {
			'text': 'カート削除',
			'class': 'removeBtn',
		}).appendTo(tdButton);
		
		$(tdButton).appendTo(tr);
		$(tr).appendTo(tbody);
	});
	$('.removeBtn').on('click', removeCart);
	
};
	
let buy = (event) => {
	$.ajax({
		type: 'POST',
		url: '/ecsite/api/purchase',
		data: JSON.stringify({
			"userId": $('#hiddenUserId').val(),
			"cartList": cartList
		}),
		contentType: 'application/json',
		dataType: 'json',
		scriptCharset: 'utf-8'
	})
	.then((result) => {
			alert('購入しました。');
		}, () => {
			console.error('Error: ajax connection failed.');
		}
	);
};

let removeCart = (event) => {
	const tdList = $(event.target).parent().parent().find('td');
	let id = $(tdList[0]).text();
	cartList = cartList.filter(function(cart) {
		return cart.id !== id;
	});
	$(event.target).parent().parent().remove();
};

let showHistory = () => {
	$.ajax({
		type: 'POST',
		url: '/ecsite/api/history',
		data: JSON.stringify({ "userId": $('#hiddenUserId').val() }),
		contentType: 'application/json',
		dataType: 'json',
		scriptCharset: 'utf-8'
	})
	.then((result) => {
		let historyList = result;
		let tbody = $('#historyTable').find('tbody');
		$(tbody).children().remove();
		historyList.forEach((history, index) => {
			let tr = $('<tr />');
			
			$('<td />', { 'text': history.goodsName }).appendTo(tr);
			$('<td />', { 'text': history.itemCount }).appendTo(tr);
			$('<td />', { 'text': history.createdAt }).appendTo(tr);
			
			$(tr).appendTo(tbody);
		});
		$("#history").dialog("open");
	}, () => {
		console.error('Error: ajax connection failed.');
		}
	);
};