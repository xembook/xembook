var transferPageNumber = 1;
var harvestPageNumber = 1;
var reciptPageNumber = 1;
var rawAddress = "";
if (1 < document.location.search.length) {

	var query = document.location.search.substring(1);
	var prms = query.split('&');
	var item = new Object();
	for (var i = 0; i < prms.length; i++) {
		var elm   = prms[i].split('=');
		var idx   = decodeURIComponent(elm[0]);
		var val   = decodeURIComponent(elm[1]);
		item[idx] = decodeURIComponent(val);
	}
	if("address" in item){
		rawAddress = item["address"];
	}
}

if( rawAddress == ""){

	var proaddress = window.prompt('Symbolアドレスを入力してください','');
	if(proaddress === '' || proaddress === null){
		alert("サンプルアカウントを表示します");
		proaddress = "NCESRRSDSXQW7LTYWMHZOCXAESNNBNNVXHPB6WY";
	}
	rawAddress = proaddress.replace( /-/g , "" ).toUpperCase();

	if(history.replaceState) {
		history.replaceState(null,null,"?address=" + rawAddress)
	}
}
rawAddress = rawAddress.replace( /-/g , "" ).toUpperCase();

const nem = require("/node_modules/symbol-sdk");
const op = require("/node_modules/rxjs/operators");
const rxjs = require("/node_modules/rxjs");
const address = nem.Address.createFromRawAddress(rawAddress);

var listener;
function connectNode(nodes,d){

	const node = nodes[Math.floor(Math.random() * nodes.length)] ;
	$.ajax({url:  node + "/node/health" ,type: 'GET',timeout: 1000})
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

async function createRepo(d2){

	const d = $.Deferred();
	const node = await connectNode(NODES,d);
	repo = new nem.RepositoryFactoryHttp(node);
	txRepo = repo.createTransactionRepository();
	nsRepo = repo.createNamespaceRepository();
	receiptRepo = repo.createReceiptRepository();
	wsEndpoint = node.replace('http', 'ws') + "/ws";
	listener = new nem.Listener(wsEndpoint,nsRepo,WebSocket);

	try{
		epochAdjustment = await repo.getEpochAdjustment().toPromise();
		await listenerKeepOpening();
		d2.resolve(repo);

	}catch{
		createRepo(d2);
	}
	return d2.promise();
}

var newBlockHash;
async function listenerKeepOpening(){

	listener = new nem.Listener(wsEndpoint,nsRepo,WebSocket);
	await listener.open();

	listener.webSocket.onclose = async function(){
		console.log("listener onclose");
		await listenerKeepOpening();

		//リスナーに関係する情報をリロード
		accountRepo.getAccountInfo(address)
		.subscribe(accountInfo => {
			showAccountInfo(accountInfo);
		});
	}

	listener.newBlock().subscribe(async block=>{
		newBlockHash = block.hash; //活性チェック用
		getNewInfo(block.height);
	});
}

(async() =>{
	const d2 = $.Deferred();
	repo = await createRepo(d2);
	const d3 = $.Deferred();
	repo2 = await createRepo(d3);

	nwRepo = repo.createNetworkRepository();
//	blockRepo = repo.createBlockRepository();
	blockRepo = repo2.createBlockRepository();
	accountRepo = repo.createAccountRepository();
	nodeRepo = repo.createNodeRepository();
	tsRepo = repo.createTransactionStatusRepository();
	chainRepo = repo.createChainRepository();
	finRepo = repo.createFinalizationRepository();
	hlRepo = repo.createHashLockRepository();
	metaRepo = repo.createMetadataRepository();
	mosaicRepo = repo.createMosaicRepository();
	msigRepo = repo.createMultisigRepository();
	resAccountRepo = repo.createRestrictionAccountRepository();
	resMosaicRepo = repo.createRestrictionMosaicRepository();
	slRepo = repo.createSecretLockRepository();

	currencyId = (await repo.getCurrencies().toPromise()).currency.mosaicId.toHex();
	networkType = await repo.getNetworkType().toPromise();
	totalChainImportance = Number((await nwRepo.getNetworkProperties().toPromise()).chain.totalChainImportance.split("'").join('').slice( 0, -8 ));

	currencyNamespaceId = (new nem.NamespaceId("symbol.xym")).id.toHex();
	latestBlock = (await blockRepo.search({order: nem.Order.Desc}).toPromise()).data[0]

	$("#account_address").text(address.pretty().slice(0,20) + "..." + address.pretty().slice(-3));
	$("#account_explorer"  ).attr("href", "http://explorer.symbolblockchain.io/accounts/" + address.plain());

	//アカウント情報
	var accountInfo = accountRepo.getAccountInfo(address);
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

	txs = await txRepo.search({
		address:address,
		group:nem.TransactionGroup.Confirmed,
		embedded:true,
		pageSize:pageSize,
		pageNumber:transferPageNumber,
		order:"desc"}).toPromise();

	transferPageNumber++;
	parseTx(txs.data);

	if(txs.isLastPage){
		$('#transfers_footer').hide();
	}
	return txs.isLastPage;
}


async function getRecipets(pageSize){

	var res = await receiptRepo.searchReceipts({
		senderAddress:address,
		pageNumber:reciptPageNumber,
		pageSize:pageSize,
		order:"desc"
	}).toPromise();

	reciptPageNumber++;

	for(statements  of res.data){

		var filterdReceipts = statements.receipts.filter(item => {
			if(item.senderAddress){
				return item.senderAddress.plain() === address.plain();
			}
			return false;
		});

		cnt = 0
		for(receipt of filterdReceipts){

			showReceiptInfo("receipt",statements.height,receipt,cnt);
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

	var res = await receiptRepo.searchReceipts({
		targetAddress:address,
		pageNumber:harvestPageNumber,
		pageSize:pageSize,
		order:"desc"
	}).toPromise();

	harvestPageNumber++;

	for(statements  of res.data){

		var filterdReceipts = statements.receipts.filter(item => {
			if(item.targetAddress){
				return item.targetAddress.plain() === address.plain();
			}
			return false;
		});

		cnt = 0
		for(receipt of filterdReceipts){

			showReceiptInfo("harvest",statements.height,receipt,cnt);
			cnt++;
		}
	}

	if(res.isLastPage){
		$('#harvests_footer').hide();
	}
	return res.isLastPage;
}


//トランザクション一覧
async function parseTx(txs,parentId){
	for(var tx of txs){

		if([
			nem.TransactionType.AGGREGATE_COMPLETE,
			nem.TransactionType.AGGREGATE_BONDED
		].includes(tx.type)){

			const id = tx.transactionInfo.id;
			await appendAggTx(tx);
			var tranType;
			if(address.plain() ===  tx.signer.address.plain()){
//			if(alice.plain() === tx.recipientAddress.plain()){
				tranType = "<font color='red'>送信[集約]</font>";
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
				tranType = "<font color='green'>受信[集約]</font>";
//				showTxAmountInfo(id,nem.UInt64.fromNumericString("0"),0);

			}
			$("#type"+ id ).html(tranType);

			txRepo.getTransactionsById([tx.transactionInfo.hash],nem.TransactionGroup.Confirmed)
			.subscribe(aggTx =>{
				parseTx(aggTx[0].innerTransactions,id);
			});

		}else if(tx.type === nem.TransactionType.TRANSFER){

			xym = tx.mosaics.filter(item=> [currencyNamespaceId,currencyId].includes(item.id.toHex()));

			if(xym.length === 0
				&& parentId === undefined
				&& address.plain() ===  tx.signer.address.plain()){

					const id = tx.transactionInfo.id;
					await appendTx("#table",id,tx);
					$("#type"+ id ).html("<font color='red'>送信</font>");

					txRepo.getTransactionEffectiveFee(tx.transactionInfo.hash)
					.subscribe(fee => {
						showTxAmountInfo(id,nem.UInt64.fromNumericString("0"),fee);
					});
			}

			for(mosaic of xym){

				const id = tx.transactionInfo.id + mosaic.id.toHex();
				const mosaicAmount = mosaic.amount;
				if(parentId !== undefined){

					//インターナルトランザクション
					if(address.plain() === tx.recipientAddress.plain() || address.plain() ===  tx.signer.address.plain()){
						await insertTxAfter("#agg" + parentId,id,tx);

					}else{
						//自分が送信・受信していないインナートランザクションは表示しない。
						continue;
					}
				}else{
					await appendTx("#table",id,tx);
				}

				var tranType;
				if(address.plain() ===  tx.signer.address.plain()){
					tranType = "<font color='red'>送信</font>";
					if(parentId === undefined){
						txRepo.getTransactionEffectiveFee(tx.transactionInfo.hash)
						.subscribe(fee => {

							showTxAmountInfo(id,mosaicAmount,fee);
						});
					}else{
						showTxAmountInfo(id,mosaicAmount,0);
					}
				}else{
					tranType = "<font color='green'>受信</font>";
					showTxAmountInfo(id,mosaicAmount,0);
				}
				$("#type"+ id ).html(tranType);
			}
		}else{
			if(parentId === undefined 
				&& address.plain() ===  tx.signer.address.plain()){

					const id = tx.transactionInfo.id;
					await appendTx("#table",id,tx);
					$("#type"+ id ).html("<font color='red'>送信</font>");

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
	return ( num < 10 ) ? '0' + num  : num;
};
