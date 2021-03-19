const NODES = [
"https://symbol-imog.tk:3001",
"https://sym-main.opening-line.jp:3001",
"https://sym-main-10.opening-line.jp:3001",
"https://sym-main-09.opening-line.jp:3001",
"https://sym-main-08.opening-line.jp:3001",
"https://sym-main-07.opening-line.jp:3001",
"https://sym-main-06.opening-line.jp:3001",
"https://sym-main-05.opening-line.jp:3001",
"https://sym-main-04.opening-line.jp:3001",
"https://sym-main-03.opening-line.jp:3001",
"https://sym-main-02.opening-line.jp:3001",
"https://sym-main-01.opening-line.jp:3001",
"https://symbol-sakura-16.next-web-technology.com:3001",
"https://symbol-harvesting.com:3001",
"https://symbol01.harvestasya.com:3001",
"https://node1.xym-harvesting.com:3001",
"https://d3rmzi6ltfh1jy.cloudfront.net",
];

//"https://sym-main-11.opening-line.jp:3001",

var transferPageNumber = 1;
var harvestPageNumber = 1;
var reciptPageNumber = 1;
var address = "";
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
	address = item["address"];
}

if( address == ""){

	var proaddress = window.prompt('Symbolアドレスを入力してください','');
	if(proaddress === '' || proaddress === null){
		alert("サンプルアカウントを表示します");
		proaddress = "NCESRRSDSXQW7LTYWMHZOCXAESNNBNNVXHPB6WY";
//	}else{

//		proaddress = proaddress.replace( /-/g , "" ).toUpperCase();
//		location.href = "?address=" + proaddress;
	}
	address = proaddress.replace( /-/g , "" ).toUpperCase();

	if(history.replaceState) {
		history.replaceState(null,null,"?address=" + address)
	}
}
address = address.replace( /-/g , "" ).toUpperCase();

const nem = require("/node_modules/symbol-sdk");
const op = require("/node_modules/rxjs/operators");
const rxjs = require("/node_modules/rxjs");

function connectNode(nodes,d){

	const node = nodes[Math.floor(Math.random() * nodes.length)] ;
	$.ajax({url:  node + "/node/health" ,type: 'GET',timeout: 500})
	.then(res => {
		console.log(res);
		if(res.status.apiNode == "up" && res.status.db == "up"){
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

	try{
		repo = new nem.RepositoryFactoryHttp(node);
		epochAdjustment = await repo.getEpochAdjustment().toPromise();
		d2.resolve(repo);
	}catch{
		createRepo(d2);
	}
	return d2.promise();
}

(async() =>{

	const d2 = $.Deferred();
	repo = await createRepo(d2);

	nsRepo = repo.createNamespaceRepository();
	txRepo = repo.createTransactionRepository();
	nwRepo = repo.createNetworkRepository();
	blockRepo = repo.createBlockRepository();
	receiptRepo = repo.createReceiptRepository();
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

	currencyNamespaceId = (new nem.NamespaceId("symbol.xym")).id.toHex();
	latestBlock = (await blockRepo.search({order: nem.Order.Desc}).toPromise()).data[0]

	alice = nem.Address.createFromRawAddress(address);
	$("#account_address").text(
		alice.address.substring(0,6)
		+ "-" +alice.address.substring(6,12)
		+ "-" + alice.address.substring(12,18)
		+"..."
	);

	//アカウント情報
	var accountInfo = accountRepo.getAccountInfo(alice);

	accountInfo
	.pipe(
		op.mergeMap(_=>_.mosaics),
		op.filter(_ => _.id.toHex() === currencyId),
	)
	.subscribe(_=>{
		$("#account_balance").append("<dd>" + dispAmount(_.amount.toString(),6) + "</dd>");
	});

	accountInfo
	.subscribe(_=>{

		var account_importance = Number(_.importance.toString()) / 100000000;
		account_importance = Math.round( account_importance );
		account_importance /= 10000;

		$("#account_importance").append("<dd>" + account_importance + "</dd>");
		getTransfers();
		getHarvests();
		getRecipets();
	});

	chainRepo.getChainInfo().subscribe(x=>{

		rxjs.zip(
			blockRepo.getBlockByHeight(x.height),
			blockRepo.getBlockByHeight(x.latestFinalizedBlock.height),

		).subscribe(x => {

			$("#chain_height").html(
				dispTimeStamp(Number(x[0].timestamp.toString()),epochAdjustment)

			);
			$("#finalized_chain_height").html(
				dispTimeStamp(Number(x[1].timestamp.toString()),epochAdjustment)
			);

		})
	});
	nodeRepo.getNodeInfo().subscribe(x=>{
		$("#node_host").text(
			x.host
		);
	});
})();

//トランザクション取得
function getTransfers(){

	txRepo.search({
		address:alice,
		group:nem.TransactionGroup.Confirmed,
		embedded:true,
		pageSize:15,
		pageNumber:transferPageNumber,
		order:"desc"})
	.subscribe(_=>{
		transferPageNumber++;
		if(_.isLastPage){
			$('#transfers_footer').hide();
		}
		parseTx(_.data);
	});
}

//出金レシート
function getRecipets(){

	receiptRepo.searchReceipts({
		senderAddress:alice,
		pageNumber:reciptPageNumber,
		pageSize:10,
		order:"desc"
	})
	.pipe(
		op.mergeMap(_=>{
			reciptPageNumber++;
			if(_.isLastPage){
				$('#receipts_footer').hide();
			}
			return _.data;
		}),
	).subscribe(_=>{

		var receipt = _.receipts.filter(item => {
			if(item.senderAddress){
				return item.senderAddress.plain() === alice.plain();
			}
			return false;
		});
		showReceiptInfo("receipt",_.height,receipt[0]);
	});
}

//入金レシート
function getHarvests(){
	console.log(harvestPageNumber);
	receiptRepo.searchReceipts({
		targetAddress:alice,
		pageNumber:harvestPageNumber,
		pageSize:10,
		order:"desc"
	})
	.pipe(
		op.mergeMap(_=>{
			harvestPageNumber++;
			if(_.isLastPage){
				$('#harvests_footer').hide();
			}
			return _.data
		}),
	).subscribe(_=>{

		var receipt = _.receipts.filter(item => {
			if(item.targetAddress){
				return item.targetAddress.plain() === alice.plain();
			}
			return false;
		});
//		console.log(_.height)
		showReceiptInfo("harvest",_.height,receipt[0]);
	});
}

function showReceiptInfo(tag,height,receipt){

		console.log(height)

	$("#" + tag).append("<tr>"
	+ "<td id='" + tag + "_date" + height + receipt.type + "'>" +height+ "</td>"
	+ "<td id='" + tag + "_type'>" + nem.ReceiptType[receipt.type] + "</td>"
	+ "<td id='" + tag + "_amount'>" + dispAmount(receipt.amount,6) + "</td>" //mosaicLabel
	+ "</tr>"
	);


	blockRepo.getBlockByHeight(height)
	.subscribe(b => {

		$("#" + tag + "_date"+ height + receipt.type).text(
			dispTimeStamp(Number(b.timestamp.toString()),epochAdjustment)
		);
	})
}

//トランザクション一覧
function parseTx(txs,parentId){
	for(var tx of txs){

		if([
			nem.TransactionType.AGGREGATE_COMPLETE,
			nem.TransactionType.AGGREGATE_BONDED
		].includes(tx.type)){

			const id = tx.transactionInfo.id;
			appendAggTx(tx);
			var tranType;
			if(alice.plain() ===  tx.signer.address.plain()){
 //			if(alice.plain() === tx.recipientAddress.plain()){
				tranType = "<font color='red'>送信[集約]</font>";
				txRepo.getTransactionEffectiveFee(tx.transactionInfo.hash)
 				.subscribe(fee => {
 					$("#amount"+ id)
 					.text(
 						dispAmount(nem.UInt64.fromNumericString(fee.toString()),6)
 					);
 				});
 			}else{
				tranType = "<font color='green'>受信[集約]</font>";
 			}
 			$("#type"+ id ).html(tranType);

 			txRepo.getTransactionsById([tx.transactionInfo.hash],nem.TransactionGroup.Confirmed)
 			.subscribe(aggTx =>{
 				parseTx(aggTx[0].innerTransactions,id);
 			});

		}else if(tx.type === nem.TransactionType.TRANSFER){

//			xym = tx.mosaics.filter(item=> ["E74B99BA41F4AFEE",currencyId].includes(item.id.toHex()));
			xym = tx.mosaics.filter(item=> [currencyNamespaceId,currencyId].includes(item.id.toHex()));

			for(mosaic of xym){

				const id = tx.transactionInfo.id + mosaic.id.toHex();
				const mosaicAmount = mosaic.amount;
				if(parentId !== undefined){
					//インターナルトランザクション
					insertTxAfter("#agg" + parentId,id);
				}else{
					appendTx("#table",tx,id);
				}

				var tranType;
				if(alice.plain() ===  tx.signer.address.plain()){
					tranType = "<font color='red'>送信</font>";
					if(parentId === undefined){
						txRepo.getTransactionEffectiveFee(tx.transactionInfo.hash)
						.subscribe(fee => {

							$("#amount"+ id).text(
								dispAmount(
									mosaicAmount.add(
										nem.UInt64.fromNumericString(fee.toString())
									),6
								)
							);
						});
					}else{
						$("#amount"+ id).text(dispAmount(mosaicAmount,6));
					}
				}else{
					tranType = "<font color='green'>受信</font>";
					$("#amount"+ id).text(dispAmount(mosaicAmount,6));
				}
				$("#type"+ id ).html(tranType);
			}
		}else{

			var tranType;

			const id = tx.transactionInfo.id;
			if(parentId !== undefined){
				//インターナルトランザクション
//				insertTxAfter("#agg" + parentId,id);
			}else{
				appendTx("#table",tx,id);
			}

			if(alice.plain() ===  tx.signer.address.plain()){
				tranType = "<font color='red'>送信</font>";
				if(parentId === undefined){


					txRepo.getTransactionEffectiveFee(tx.transactionInfo.hash)
					.subscribe(fee => {

						$("#amount"+ id).text(
							dispAmount(
								nem.UInt64.fromNumericString(fee.toString())
								,6
							)
						);
					});

//					$("#amount"+ id).text(dispAmount(0,6));

				}else{

//					$("#amount"+ id).text(dispAmount(0,6));
				}
			}else{
//				tranType = "<font color='green'>受信</font>";
//				$("#amount"+ id).text(dispAmount(0,6));
			}
			$("#type"+ id ).html(tranType);
		}
	}
}


function dispAmount(amount,divisibility){

	var strNum = amount.toString();
	if(divisibility > 0){

		if(amount < Math.pow(10, divisibility)){

			return "0." + paddingAmount0(strNum,0,divisibility);

		}else{

			var r = strNum.slice(-divisibility);
			var l = strNum.substring(0,strNum.length - divisibility);
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

	var d = new Date(timeStamp + epoch * 1000)
	var strDate = d.getFullYear()%100
		+ "-" + paddingDate0( d.getMonth() + 1 )
		+ '-' + paddingDate0( d.getDate() )
		+ ' ' + paddingDate0( d.getHours() )
		+ ':' + paddingDate0( d.getMinutes() ) ;
	return 	strDate;
}

function paddingDate0(num) {
	return ( num < 10 ) ? '0' + num  : num;
};
