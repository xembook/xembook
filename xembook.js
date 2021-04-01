const ACTIVE_IMPORTANCE_RATE = 0.1999;
const NO_3001_NODES = [
"d3rmzi6ltfh1jy.cloudfront.net",
"a.symbol.lcnem.net",
];
const NODES = [
//"https://xym.harvester.earth:3001",
//"https://umbriel.uranus-satellite.net:3001",
//"https://symbol.kazgb.net:3001",
//"https://symbol-node-01.kokichi.tokyo:3001",
//"https://xym.jp1.node.leywapool.com:3001",
//"https://xym.jp5.node.leywapool.com:3001",
//"https://xym.jp2.node.leywapool.com:3001",

"https://d3rmzi6ltfh1jy.cloudfront.net",
"https://a.symbol.lcnem.net",

"https://ik1-432-48199.vs.sakura.ne.jp:3001",
"https://35kx.c.time4vps.cloud:3001",
"https://raharu-symbol-node-01.com:3001",
"https://sn2.msus-symbol.com:3001",
"https://0-0symbol-node1.trivill.com:3001",
"https://sn1.msus-symbol.com:3001",
"https://00.symsym.info:3001",
"https://01.symsym.info:3001",
"https://02.symsym.info:3001",
"https://03.symsym.info:3001",
"https://04.symsym.info:3001",
"https://0.symsym.info:3001",
"https://00.alpaca.symbolist.jp:3001",
"https://00.bison.symbolist.jp:3001",
"https://00.cow.symbolist.jp:3001",
"https://00.dragon.symbolist.jp:3001",
"https://00.elephant.symbolist.jp:3001",
"https://00.fushicho.symbolist.jp:3001",
"https://00.gorilla.symbolist.jp:3001",
"https://00.high-performance.symbol-nodes.com:3001",
"https://00.hippopotamus.symbolist.jp:3001",
"https://super-harvester.com:3001",
"https://symbol02.spdysgr.net:3001",
"https://sym-main.opening-line.jp:3001",
"https://node1.xym-harvesting.com:3001",
"https://node2.xym-harvesting.com:3001",
"https://ls1.rellc.jp:3001",
"https://888.symsym.info:3001",
"https://symbol.nagoya:3001",
"https://xym.idol-library.jp:3001",
"https://age01.kitsutsuki.tokyo:3001",
"https://age02.kitsutsuki.tokyo:3001",
"https://age03.kitsutsuki.tokyo:3001",
"https://cryptocat-xym-node2.com:3001",
"https://ik1-332-26240.vs.sakura.ne.jp:3001",
"https://02.symbol-node.net:3001",
"https://00.symbol-node.net:3001",
"https://23167.xym.stir-hosyu.com:3001",
"https://symbol03.node.oe-jpy.com:3001",
"https://07.symbol-node.net:3001",
"https://006symbol.open-nodes.com:3001",
"https://sym-main.daoka.tk:3001",
"https://002symbol.open-nodes.com:3001",
"https://harvesting-sweet-potatoes.com:3001",
"https://01.symbol-gentoo.tokyo:3001",
"https://007symbol.open-nodes.com:3001",
"https://000symbol.open-nodes.com:3001",
"https://08.symbol-node.net:3001",
"https://symbol01.node.oe-jpy.com:3001",
"https://harvest-festa.com:3001",
"https://00.harvester.earth:3001",
"https://009symbol.open-nodes.com:3001",
"https://001symbol.open-nodes.com:3001",
"https://09.symbol-node.net:3001",
"https://symbol-harvesting.com:3001",
"https://003symbol.open-nodes.com:3001",
"https://xymtokyo.harvest-node.net:3001",
"https://0-a.muraka.me:3001",
"https://05.symbol-node.net:3001",
"https://0-0-1.symbol-nodes.net:3001",
"https://0-0-2.symbol-nodes.net:3001",
"https://30153.xym.stir-hosyu.com:3001",
"https://03.symbol-node.net:3001",
"https://symbol02.node.oe-jpy.com:3001",
"https://paotan01.momotapo.com:3001",
"https://paotan02.momotapo.com:3001",
"https://paotan03.momotapo.com:3001",
"https://119-47-17-86.catv296.ne.jp:3001",
"https://puipui.iizukak.com:3001",
"https://06.symbol-node.net:3001",
"https://04.symbol-node.net:3001",
"https://symbol-node.net:3001",
"https://node-01.rruby.org:3001",
"https://ik1-449-56512.vs.sakura.ne.jp:3001",
"https://sushi.sakurairo.tokyo:3001",
"https://0m0-neko-neko-nyaa-symbolcat.com:3001",
"https://shikinami.starlight.tokyo:3001",
"https://19902.xym.stir-hosyu.com:3001",
"https://62828.xym.stir-hosyu.com:3001",
"https://64519.xym.stir-hosyu.com:3001",
"https://33603.xym.stir-hosyu.com:3001",
"https://12936.xym.stir-hosyu.com:3001",
"https://26760.xym.stir-hosyu.com:3001",
"https://00ffd768.xym.stir-hosyu.com:3001",
"https://01.symbol-node.net:3001",
"https://14601.xym.stir-hosyu.com:3001",
"https://005symbol.open-nodes.com:3001",
"https://ik1-426-45178.vs.sakura.ne.jp:3001",
"https://ik1-421-42893.vs.sakura.ne.jp:3001",
"https://008symbol.open-nodes.com:3001",
"https://004symbol.open-nodes.com:3001",
"https://xym.harvester.earth:3001",
"https://00A06705.xym.stir-hosyu.com:3001",
"https://ik1-432-48497.vs.sakura.ne.jp:3001",
"https://symbol01.harvestasya.com:3001",
"https://aiteruyo.jp:3001",
"https://amaterasu-01.kamigami.jp:3001",
"https://amaterasu-02.kamigami.jp:3001",
"https://symbol-node.bakobox.net:3001",
"https://0-0-xym.cubkab-crypto.tokyo:3001",
"https://0-0-axym.cubkab-crypto.tokyo:3001",
"https://01.symbol.enoki-do.com:3001",
"https://harvest-01.symbol.farm:3001",
"https://harvest-02.symbol.farm:3001",
"https://harvest-03.symbol.farm:3001",
"https://symbol.harvest-monitor.com:3001",
"https://nemauthn.harvestfield.tokyo:3001",
"https://hideyoshi-node.net:3001",
"https://criptian-xym-node.net:3001",
"https://symbol.kazgb.net:3001",
"https://35665.xym.stir-hosyu.com:3001",
"https://yuna.keshet.finance:3001",
"https://keshet01-symbol-paradise.com:3001",
"https://keshet02-symbol-paradise.com:3001",
"https://keshet03-symbol-paradise.com:3001",
"https://keshet04-symbol-paradise.com:3001",
"https://symbol.from.nagoya:3001",
"https://cryptocat-xym-node.com:3001",
"https://sn.newecosym.com:3001",
"https://misaki-xym.com:3001",
"https://41506.xym.stir-hosyu.com:3001",
"https://symbol-sakura-16.next-web-technology.com:3001",
"https://ik1-438-51340.vs.sakura.ne.jp:3001",
"https://symbol.nuaka.net:3001",
"https://28387.xym.stir-hosyu.com:3001",
"https://ik1-305-12844.vs.sakura.ne.jp:3001",
"https://16948.xym.stir-hosyu.com:3001",
"https://17107.xym.stir-hosyu.com:3001",
"https://23639.xym.stir-hosyu.com:3001",
"https://sym-main-01.opening-line.jp:3001",
"https://sym-main-02.opening-line.jp:3001",
"https://sym-main-03.opening-line.jp:3001",
"https://sym-main-04.opening-line.jp:3001",
"https://sym-main-05.opening-line.jp:3001",
"https://sym-main-06.opening-line.jp:3001",
"https://sym-main-07.opening-line.jp:3001",
"https://sym-main-08.opening-line.jp:3001",
"https://sym-main-09.opening-line.jp:3001",
"https://sym-main-10.opening-line.jp:3001",
"https://sym-main-11.opening-line.jp:3001",
"https://symbol-harvest-node.com:3001",
"https://symbol-node-01.kokichi.tokyo:3001",
"https://symbol01.master-ryzen00.trade:3001",
"https://50038.xym.stir-hosyu.com:3001",
"https://27423.xym.stir-hosyu.com:3001",
"https://angel.vistiel-arch.jp:3001",
"https://00-symbol-node.yagiyoshi.com:3001",

];

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
	if("address" in item){
		address = item["address"];
	}
}

if( address == ""){

	var proaddress = window.prompt('Symbolアドレスを入力してください','');
	if(proaddress === '' || proaddress === null){
		alert("サンプルアカウントを表示します");
		proaddress = "NCESRRSDSXQW7LTYWMHZOCXAESNNBNNVXHPB6WY";
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
	nsRepo = repo.createNamespaceRepository();
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
		accountRepo.getAccountInfo(alice)
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
	

	txRepo = repo.createTransactionRepository();
	nwRepo = repo.createNetworkRepository();
//	blockRepo = repo.createBlockRepository();
	blockRepo = repo2.createBlockRepository();
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
	networkType = await repo.getNetworkType().toPromise();
	totalChainImportance = Number((await nwRepo.getNetworkProperties().toPromise()).chain.totalChainImportance.split("'").join('').slice( 0, -8 ));
	console.log(totalChainImportance)

	currencyNamespaceId = (new nem.NamespaceId("symbol.xym")).id.toHex();
	latestBlock = (await blockRepo.search({order: nem.Order.Desc}).toPromise()).data[0]

	alice = nem.Address.createFromRawAddress(address);
	$("#account_address").text(alice.pretty().slice(0,20) + "..." + alice.pretty().slice(-3));
	$("#account_explorer"  ).attr("href", "http://explorer.symbolblockchain.io/accounts/" + alice.plain());

	//アカウント情報
	var accountInfo = accountRepo.getAccountInfo(alice);

	accountInfo
	.pipe(
		op.mergeMap(_=>_.mosaics),
		op.filter(_ => _.id.toHex() === currencyId),
	)
	.subscribe(_=>{
		$("#account_balance").append("<dd>" + dispAmount(_.amount.toString(),6) + "</dd>");
		showAmountInfo(_.amount);
	});

	showInfo(accountInfo);
})();



//トランザクション取得
async function getTransfers(pageSize){

	txs = await txRepo.search({
		address:alice,
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
	console.log(reciptPageNumber);


	var res = await receiptRepo.searchReceipts({
		senderAddress:alice,
		pageNumber:reciptPageNumber,
		pageSize:pageSize,
		order:"desc"
	}).toPromise();

	reciptPageNumber++;

	for(statements  of res.data){

		var filterdReceipts = statements.receipts.filter(item => {
			if(item.senderAddress){
				return item.senderAddress.plain() === alice.plain();
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
		targetAddress:alice,
		pageNumber:harvestPageNumber,
		pageSize:pageSize,
		order:"desc"
	}).toPromise();

	harvestPageNumber++;

	for(statements  of res.data){

		var filterdReceipts = statements.receipts.filter(item => {
			if(item.targetAddress){
				return item.targetAddress.plain() === alice.plain();
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
			if(alice.plain() ===  tx.signer.address.plain()){
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

//			xym = tx.mosaics.filter(item=> ["E74B99BA41F4AFEE",currencyId].includes(item.id.toHex()));
			xym = tx.mosaics.filter(item=> [currencyNamespaceId,currencyId].includes(item.id.toHex()));

			for(mosaic of xym){

				const id = tx.transactionInfo.id + mosaic.id.toHex();
				const mosaicAmount = mosaic.amount;
				if(parentId !== undefined){

					//インターナルトランザクション
					if(alice.plain() === tx.recipientAddress.plain() || alice.plain() ===  tx.signer.address.plain()){
						await insertTxAfter("#agg" + parentId,id,tx);
						
					}else{
						//自分が送信・受信していないインナートランザクションは表示しない。
						continue;	
					}
				}else{
					await appendTx("#table",id,tx);
				}

				var tranType;
				if(alice.plain() ===  tx.signer.address.plain()){
					tranType = "<font color='red'>送信</font>";
					if(parentId === undefined){
						txRepo.getTransactionEffectiveFee(tx.transactionInfo.hash)
						.subscribe(fee => {

//							showTxAmountInfo("#amount"+ id,mosaicAmount.add(nem.UInt64.fromNumericString(fee.toString() ) ));
							showTxAmountInfo(id,mosaicAmount,fee);
/*
							$("#amount"+ id).text(
								dispAmount(
									mosaicAmount.add(
										nem.UInt64.fromNumericString(fee.toString())
									),6
								)
							);
*/
						});
					}else{
//						$("#amount"+ id).text(dispAmount(mosaicAmount,6));
//						showTxAmountInfo("#amount"+ id,mosaicAmount);
						showTxAmountInfo(id,mosaicAmount,0);
					}
				}else{
					tranType = "<font color='green'>受信</font>";
					showTxAmountInfo(id,mosaicAmount,0);
//					showTxAmountInfo("#amount"+ id,mosaicAmount);
					
				}
				$("#type"+ id ).html(tranType);
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

function indexTimeStamp(timeStamp,epoch){
	const d = new Date(timeStamp + epoch * 1000)
	const strDate = d.getFullYear()
		+ paddingDate0( d.getMonth() + 1 )
		+ paddingDate0( d.getDate() );
	return 	strDate;
	
}
	
	
function paddingDate0(num) {
	return ( num < 10 ) ? '0' + num  : num;
};
