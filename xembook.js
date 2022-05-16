var transferPageNumber = 0;
var harvestPageNumber = 0;
var reciptPageNumber = 0;
var rawAddress = "";
if (1 < document.location.search.length) {

	const query = document.location.search.substring(1);
	const prms = query.split('&');
	const item = new Object();
	for (var i = 0; i < prms.length; i++) {
		const elm   = prms[i].split('=');
		const idx   = decodeURIComponent(elm[0]);
		const val   = decodeURIComponent(elm[1]);
		item[idx] = decodeURIComponent(val);
	}
	if("address" in item){
		rawAddress = item["address"];
	}
}

/*
if( rawAddress == ""){

	var proaddress = window.prompt('Symbolアドレスを入力してください','');
	if(proaddress === '' || proaddress === null){
		alert("サンプルアカウントを表示します");
		proaddress = "NCESRRSDSXQW7LTYWMHZOCXAESNNBNNVXHPB6WY";
	}
	rawAddress = proaddress.replace( /-/g , "" ).toUpperCase();

	if(history.replaceState) {
		history.replaceState(null,null,"?address=" + rawAddress);
	}
}
*/
if( rawAddress == ""){
	setTimeout(function() { // SSSのスクリプトを読み込むための待機

		// SSSが許可されている　かつ　アクティブアカウントのアドレスが104　の場合に確認してOKを選択でSSSのアクティブアカウントを用いる
		if (!!window.SSS && window.SSS.activeNetworkType === 104 && window.confirm("「" + window.SSS.activeAddress + "」を表示します")) {
			proaddress = window.SSS.activeAddress
		} else {
			var proaddress = window.prompt('Symbolアドレスを入力してください','');
			if(proaddress === '' || proaddress === null){
				alert("サンプルアカウントを表示します");
				proaddress = "NCESRRSDSXQW7LTYWMHZOCXAESNNBNNVXHPB6WY";
			}
		}
		rawAddress = proaddress.replace( /-/g , "" ).toUpperCase();

		// 500ms 待つためページをロードしないと処理の順番が崩れるためリダイレクト

		window.location = "?address=" + rawAddress

		// if(history.replaceState) { 
		// 	history.replaceState(null,null,"?address=" + rawAddress);
		// }

	}, 500)

}

rawAddress = rawAddress.replace( /-/g , "" ).toUpperCase();

const nem = require("/node_modules/symbol-sdk");
const op = require("/node_modules/rxjs/operators");
const rxjs = require("/node_modules/rxjs");
const address = nem.Address.createFromRawAddress(rawAddress);

function connectNode(nodes,d){

	const node = nodes[Math.floor(Math.random() * nodes.length)] ;
	$.ajax({url:  node + "/node/health" ,type: 'GET',timeout: 600})
	.then(res => {
		if(res.status.apiNode == "up" && res.status.db == "up"){
			console.log(node);
			return d.resolve(node);
		}
		return connectNode(nodes,d);
	})
	.catch(res =>connectNode(nodes,d));
	return d.promise();
}

var txRepo;
var nsRepo;
var receiptRepo;
var epochAdjustment;
var listener;
async function createRepo(d2,nodes){

	const d = $.Deferred();
	const node = await connectNode(nodes,d);
	const repo = new nem.RepositoryFactoryHttp(node);
	nsRepo = repo.createNamespaceRepository();

	try{
		epochAdjustment = await repo.getEpochAdjustment().toPromise();
		if(listener === undefined){
			const wsEndpoint = node.replace('http', 'ws') + "/ws";
//			listener = new nem.Listener(wsEndpoint,nsRepo,WebSocket);
			await listenerKeepOpening(wsEndpoint);
		}
		d2.resolve(repo);

	}catch(error){
		console.log(error);
		createRepo(d2,nodes);
	}
	return d2.promise();
}

var newBlockHash;
async function listenerKeepOpening(wsEndpoint){

	listener = new nem.Listener(wsEndpoint,nsRepo,WebSocket);
	await listener.open();

	listener.webSocket.onclose = async function(){
		console.log("listener onclose");

		await listenerKeepOpening(wsEndpoint);

		//リスナーに関係する情報をリロード
		accountRepo.getAccountInfo(address)
		.subscribe(accountInfo => {
			showAccountInfo(accountInfo);
		});
	}

	getListenerInfo(listener);
}


var blockRepo;
var blockRepo1;
var nwRepo;
var accountRepo;
var nodeRepo;
var chainRepo;
var msigRepo;
var networkType;
var currencyId;
var totalChainImportance;
var currencyNamespaceId;
var networkCurrency;
const nemScriptionExpiredHeight = localStorage.getItem('NEMscriptionExpiredHeight' + rawAddress);

(async() =>{

	if(nemScriptionExpiredHeight !== null){
		nodelist = JP_NODES;
		console.log("connect japan node");
	}
	const d2 = $.Deferred();
	const repo = await createRepo(d2,nodelist);
	const d3 = $.Deferred();
	const repo2 = await createRepo(d3,nodelist);

	txRepo = repo.createTransactionRepository();
	chainRepo = repo.createChainRepository();
	nwRepo = repo.createNetworkRepository();
	blockRepo = repo2.createBlockRepository();
	blockRepo1 = repo.createBlockRepository();
	accountRepo = repo.createAccountRepository();
	nodeRepo = repo.createNodeRepository();
	receiptRepo = repo.createReceiptRepository();
//	tsRepo = repo.createTransactionStatusRepository();
//	finRepo = repo.createFinalizationRepository();
//	hlRepo = repo.createHashLockRepository();
	metaRepo = repo.createMetadataRepository();
	mosaicRepo = repo.createMosaicRepository();
	msigRepo = repo.createMultisigRepository();
//	resAccountRepo = repo.createRestrictionAccountRepository();
//	resMosaicRepo = repo.createRestrictionMosaicRepository();
//	slRepo = repo.createSecretLockRepository();

//	currencyId = (await repo.getCurrencies().toPromise()).currency.mosaicId.toHex();
//	networkType = await repo.getNetworkType().toPromise();
//	totalChainImportance = Number((await nwRepo.getNetworkProperties().toPromise()).chain.totalChainImportance.split("'").join('').slice( 0, -8 ));
//	networkCurrency = (await repo.getCurrencies().toPromise()).currency;
//	generationHash = await repo.getGenerationHash().toPromise();

	currencyId = "6BED913FA20223F8";
	networkType = 104;
	totalChainImportance = 78429286;
	repo.getCurrencies().subscribe(x=>{
			networkCurrency = x.currency;
	});
	generationHash = "57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6";

	currencyNamespaceId = (new nem.NamespaceId("symbol.xym")).id.toHex();
	latestBlock = (await blockRepo.search({order: nem.Order.Desc}).toPromise()).data[0];

	$("#account_address").text(address.pretty().slice(0,20) + "..." + address.pretty().slice(-3));
	$("#account_explorer").attr("href", explorer + "/accounts/" + address.plain());

	//NEMscriptionExpiredHeight
	const key = nem.KeyGenerator.generateUInt64Key("NEMscriptionExpiredHeight");
	const srcAddress = nem.Address.createFromRawAddress("NAXXB6RI4FTXAKEY57P4ZKNYBAYEXBVCEEL2Q3Y");
	metaRepo.search({
		sourceAddress:srcAddress,
		scopedMetadataKey:key.toHex(),
		targetAddress:address,
		metadataType:nem.MetadataType.Account}
	).subscribe(x=>{
		if(x.data.length > 0){
			if(latestBlock.height.compact() < Number(x.data[0].metadataEntry.value)){

				localStorage.setItem('NEMscriptionExpiredHeight' + rawAddress,x.data[0].metadataEntry.value);
				console.log(x.data[0].metadataEntry.value)
			}
		}else{
			localStorage.removeItem('NEMscriptionExpiredHeight' + rawAddress);
		}
	})

	//アカウント情報
	const accountInfo = accountRepo.getAccountInfo(address);
	showPriceInfo(accountInfo);
	showInfo(accountInfo);
})();

function showPriceInfo(accountInfo){

	accountInfo
	.pipe(
		op.mergeMap(_=>_.mosaics),
		op.filter(_ => _.id.toHex() === currencyId),
	)
	.subscribe(_=>{
		$("#account_balance").text(dispAmount(_.amount.toString(),6));
		showAmountInfo(_.amount);
	});
}

//トランザクション取得
async function getTransfers(pageSize){

	transferPageNumber++;
	const txs = await txRepo.search({
		address:address,
		group:nem.TransactionGroup.Confirmed,
		embedded:true,
		pageSize:pageSize,
		pageNumber:transferPageNumber,
		order:"desc"}).toPromise();

	parseTx(txs.data);

	if(txs.isLastPage){
		$('#transfers_footer').hide();
	}
	return txs.isLastPage;
}

async function getRecipets(pageSize){

	reciptPageNumber++;
	const res = await receiptRepo.searchReceipts({
		senderAddress:address,
		pageNumber:reciptPageNumber,
		pageSize:pageSize,
		order:"desc"
	}).toPromise();


	var lastHeight = 0;
	var cnt = 0;

	for(const statements  of res.data){

		const filterdReceipts = statements.receipts.filter(item => {
			if(item.senderAddress){
				return item.senderAddress.plain() === address.plain();
			}
			return false;
		});

		if(statements.height.toString() !== lastHeight.toString()){
			cnt = 0;
		}
		for(receipt of filterdReceipts){

			showReceiptInfo("receipt",statements.height,receipt,cnt);
			lastHeight = statements.height;
			cnt++;
		}
	}

	if(res.isLastPage){
		$('#receipts_footer').hide();
	}
	return res.isLastPage;
}

//入金レシート
async function getHarvests(pageSize){

	harvestPageNumber++;

	const res = await receiptRepo.searchReceipts({
		targetAddress:address,
		pageNumber:harvestPageNumber,
		pageSize:pageSize,
		order:"desc"
	}).toPromise();


	var lastHeight = 0;
	var cnt = 0;
	for(const statements  of res.data){

		const filterdReceipts = statements.receipts.filter(item => {
			if(item.targetAddress){
				return item.targetAddress.plain() === address.plain();
			}
			return false;
		});

		if(statements.height.toString() !== lastHeight.toString()){
			cnt = 0;
		}
		for(const receipt of filterdReceipts){
			showReceiptInfo("harvest",statements.height,receipt,cnt);
			lastHeight = statements.height;
			cnt++;
		}
	}

	if(res.isLastPage){
		$('#harvests_footer').hide();
	}
	return res.isLastPage;
}

//トランザクション一覧
async function parseTx(txs,parentId,txTimestamp){
	for(const tx of txs){

		if([
			nem.TransactionType.AGGREGATE_COMPLETE,
			nem.TransactionType.AGGREGATE_BONDED
		].includes(tx.type)){

			const id = tx.transactionInfo.id;
			await appendAggTx(tx);
			var tranType;
			if(address.plain() ===  tx.signer.address.plain()){
//			if(alice.plain() === tx.recipientAddress.plain()){
				tranType = "<font color='red'>" + SENDING + "[" + AGGREGATE + "]</font>";
				txRepo.getTransactionEffectiveFee(tx.transactionInfo.hash)
				.subscribe(fee => {

//					showTxAmountInfo("#amount"+ id,nem.UInt64.fromNumericString(fee.toString()) );
					showTxAmountInfo(id,nem.UInt64.fromNumericString("0"),fee);
/*
					$("#amount"+ id)
					.text(
						dispAmount(nem.UInt64.fromNumericString(fee.toString()),6)
					);
*/
				});
			}else{
				tranType = "<font color='green'>" + RECEIVING + "[" + AGGREGATE + "]</font>";
//				showTxAmountInfo(id,nem.UInt64.fromNumericString("0"),0);

			}
			$("#type"+ id ).html(tranType);

/*
			txRepo.getTransactionsById([tx.transactionInfo.hash],nem.TransactionGroup.Confirmed)
			.subscribe(aggTx =>{
				parseTx(aggTx[0].innerTransactions,id);
			});
*/
			const aggTx = await txRepo.getTransactionsById([tx.transactionInfo.hash],nem.TransactionGroup.Confirmed).toPromise();
			const txTimestamp = (await blockRepo.getBlockByHeight(tx.transactionInfo.height).toPromise()).timestamp.toString();
			parseTx(aggTx[0].innerTransactions,id,txTimestamp);


		}else if(tx.type === nem.TransactionType.TRANSFER){

			const xym = tx.mosaics.filter(item=> [currencyNamespaceId,currencyId].includes(item.id.toHex()));

			if(xym.length === 0
				&& parentId === undefined
				&& address.plain() ===  tx.signer.address.plain()){

					const id = tx.transactionInfo.id;
					await appendTx("#table",id,tx);
					$("#type"+ id ).html("<font color='red'>" + SENDING + "</font>");

					txRepo.getTransactionEffectiveFee(tx.transactionInfo.hash)
					.subscribe(fee => {
						showTxAmountInfo(id,nem.UInt64.fromNumericString("0"),fee);
					});
			}

			for(const mosaic of xym){

				const id = tx.transactionInfo.id + mosaic.id.toHex();
				const mosaicAmount = mosaic.amount;
				if(parentId !== undefined){

					//インターナルトランザクション
					let recipientAddress = "";
					if(tx.recipientAddress.constructor.name == "NamespaceId"){
						recipientAddress = await nsRepo.getLinkedAddress(tx.recipientAddress).toPromise();
					}else{
						recipientAddress = tx.recipientAddress;
					}
					if(address.plain() === recipientAddress.plain() || address.plain() ===  tx.signer.address.plain()){
//						await insertTxAfter("#agg" + parentId,id,tx);
						await insertTxAfter("#agg" + parentId,id,tx,txTimestamp);

					}else{
						//自分が送信・受信していないインナートランザクションは表示しない。
						continue;
					}
				}else{
					await appendTx("#table",id,tx);
				}

				var tranType;
				if(address.plain() ===  tx.signer.address.plain()){
					tranType = "<font color='red'>" + SENDING + "</font>";
					if(parentId === undefined){
						txRepo.getTransactionEffectiveFee(tx.transactionInfo.hash)
						.subscribe(fee => {

							showTxAmountInfo(id,mosaicAmount,fee);
						});
					}else{
						showTxAmountInfo(id,mosaicAmount,0);
					}
				}else{
					tranType = "<font color='green'>" + RECEIVING + "</font>";
					showTxAmountInfo(id,mosaicAmount,0);
				}
				$("#type"+ id ).html(tranType);
			}
		}else{
			if(parentId === undefined
				&& address.plain() ===  tx.signer.address.plain()){

					const id = tx.transactionInfo.id;
					await appendTx("#table",id,tx);
					$("#type"+ id ).html("<font color='red'>" + SENDING + "</font>");

					txRepo.getTransactionEffectiveFee(tx.transactionInfo.hash)
					.subscribe(fee => {
						showTxAmountInfo(id,nem.UInt64.fromNumericString("0"),fee);
					});
			}
		}
	}
}


function dispAmount(amount,divisibility){

	const strNum = amount.toString();
	if(divisibility > 0){

		if(amount < Math.pow(10, divisibility)){

			return "0." + paddingAmount0(strNum,0,divisibility);

		}else{

			const r = strNum.slice(-divisibility);
			const l = strNum.substring(0,strNum.length - divisibility);
			return comma3(l) + "." + r;
		}
	}else{
		return comma3(strNum);
	}
}
function comma3(strNum){
	return strNum.replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

function paddingAmount0(val,char,n){
	for(; val.length < n; val= char + val);
	return val;
}

function dispTimeStamp(timeStamp,epoch){

	const d = new Date(timeStamp + epoch * 1000)
	const strDate = d.getFullYear()%100
		+ "-" + paddingDate0( d.getMonth() + 1 )
		+ '-' + paddingDate0( d.getDate() )
		+ ' ' + paddingDate0( d.getHours() )
		+ ':' + paddingDate0( d.getMinutes() ) ;
	return 	strDate;
}

function getDateId(timeStamp,epoch){
	const d = new Date(timeStamp + epoch * 1000)
	const dateId = d.getFullYear()
		+ paddingDate0( d.getMonth() + 1 )
		+ paddingDate0( d.getDate() );
	return 	dateId;

}


function paddingDate0(num) {
	return ( num < 10 ) ? '0' + num  : '' + num;
};
