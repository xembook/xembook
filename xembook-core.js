var transactionService;

var listener;
var txRepo;
var nsRepo;
var nwRepo;
var msigRepo;
var nodeRepo;
var chainRepo;
var blockRepo;
var accountRepo;
var receiptRepo;
var networkType;

var currencyId;
var epochAdjustment;
var totalChainImportance;
var currencyNamespaceId;

const nem = require("/node_modules/symbol-sdk");
const op = require("/node_modules/rxjs/operators");
const rxjs = require("/node_modules/rxjs");

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

async function createRepo(d2,nodes){

	const d = $.Deferred();
	const node = await connectNode(nodes,d);
	const repo = new nem.RepositoryFactoryHttp(node);

	try{
		epochAdjustment = await repo.getEpochAdjustment().toPromise();
		if(listener === undefined){
			const wsEndpoint = node.replace('http', 'ws') + "/ws";
			await listenerKeepOpening(wsEndpoint,repo.createNamespaceRepository());
		}
		d2.resolve(repo);

	}catch(error){
		console.log(error);
		createRepo(d2,nodes);
	}
	return d2.promise();
}

async function listenerKeepOpening(wsEndpoint,nsRepo){

	listener = new nem.Listener(wsEndpoint,nsRepo,WebSocket);
	await listener.open();
	console.log("listener open");
	listener.webSocket.onclose = async function(){
		console.log("listener onclose");
		onListenerResumed();
		await listenerKeepOpening(wsEndpoint,nsRepo);
	}
}

var onListenerResumed;
var onSignableTxAdded;
var setSignTargetData;


async function startApp(ready,cb1,cb2,cb3){
	onListenerResumed = cb1;
	onSignableTxAdded = cb2;
	setSignTargetData = cb3;

//(async() =>{

	const d2 = $.Deferred();
	const repo = await createRepo(d2,nodelist);

//	const d3 = $.Deferred();
//	const repo2 = await createRepo(d3,nodelist);

	txRepo = repo.createTransactionRepository();
	receiptRepo = repo.createReceiptRepository();
	chainRepo = repo.createChainRepository();
	nsRepo = repo.createNamespaceRepository();
	transactionService = new nem.TransactionService(txRepo, receiptRepo);

	nwRepo = repo.createNetworkRepository();
//	blockRepo = repo.createBlockRepository();
	blockRepo = repo.createBlockRepository();
	accountRepo = repo.createAccountRepository();
	nodeRepo = repo.createNodeRepository();
//	tsRepo = repo.createTransactionStatusRepository();
//	finRepo = repo.createFinalizationRepository();
//	hlRepo = repo.createHashLockRepository();
	metaRepo = repo.createMetadataRepository();
	mosaicRepo = repo.createMosaicRepository();
	msigRepo = repo.createMultisigRepository();
//	resAccountRepo = repo.createRestrictionAccountRepository();
//	resMosaicRepo = repo.createRestrictionMosaicRepository();
//	slRepo = repo.createSecretLockRepository();

	currencyId = (await repo.getCurrencies().toPromise()).currency.mosaicId.toHex();
	networkType = await repo.getNetworkType().toPromise();
	totalChainImportance = Number((await nwRepo.getNetworkProperties().toPromise()).chain.totalChainImportance.split("'").join('').slice( 0, -8 ));
	networkCurrency = (await repo.getCurrencies().toPromise()).currency;
	generationHash = await repo.getGenerationHash().toPromise();

	currencyNamespaceId = (new nem.NamespaceId("symbol.xym")).id.toHex();
	latestBlock = (await blockRepo.search({order: nem.Order.Desc}).toPromise()).data[0];

	ready();
}

//})();

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

//QRコードスキャン関連///////////////////////////////////

var canvasElement;
var canvas;

var isMovieScanning = false;
var video = document.createElement("video");

function drawLine(begin, end, color) {
	canvas.beginPath();
	canvas.moveTo(begin.x, begin.y);
	canvas.lineTo(end.x, end.y);
	canvas.lineWidth = 4;
	canvas.strokeStyle = color;
	canvas.stroke();
}

function tick() {
	if(!isMovieScanning){return;}
	if (video.readyState === video.HAVE_ENOUGH_DATA) {
		canvasElement.hidden = false;
		canvasElement.width  = $('.modal-content').width() * 0.9;
		canvasElement.height = $('.modal-content').width() * 0.9 * video.videoHeight / video.videoWidth;
		getCodeInfo(video);
	}
	requestAnimationFrame(tick);
}

function getCodeInfo(src){

	canvas.drawImage(src, 0, 0, canvasElement.width, canvasElement.height);
	var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
	var code = jsQR(imageData.data, imageData.width, imageData.height, {inversionAttempts: "dontInvert"});

	if (code) {
		isMovieScanning = false;
		drawLine(code.location.topLeftCorner		, code.location.topRightCorner		,"#FF3B58");
		drawLine(code.location.topRightCorner		, code.location.bottomRightCorner	,"#FF3B58");
		drawLine(code.location.bottomRightCorner	, code.location.bottomLeftCorner	,"#FF3B58");
		drawLine(code.location.bottomLeftCorner		, code.location.topLeftCorner		,"#FF3B58");
		//scanData.innerText = code.data;
		//setCodeData(code.data);

//		setSignTargetData(JSON.parse(code.data).data.payload);
		setSignTargetData(code.data);
/*
		const data = JSON.parse(code.data).data;
		if('payload' in data){
			setSignTargetData(JSON.parse(code.data).data.payload);

		}else if('privateKey' in data){
			setSignTargetData(code.data);
		}
*/
	}
}

function startVideo(){

	isMovieScanning = true;
	canvasElement = document.getElementById("canvas");
	canvas		  = canvasElement.getContext("2d");

	navigator.mediaDevices.getUserMedia({
		video: {
			facingMode: "environment"
		}
	})
	.then(function(stream) {
		video.srcObject = stream;
		window.localStream = stream;
		video.setAttribute("playsinline", true);
		video.play();
		requestAnimationFrame(tick);
	});
}

function stopVideo(){
	if(window.localStream != undefined){
		window.localStream.getTracks().forEach( (track) => {
			track.stop();
		});
	}
}

function clearRect(){

	canvas.clearRect(0, 0, canvasElement.width, canvasElement.height);
}
//ファイル処理関連///////////////////////////////

function scanFileImage(tag){

	isMovieScanning = false;
	canvasElement.hidden = false;

	stopVideo();

	const fileList = document.getElementById(tag).files;
	const reader = new FileReader();
	const file = fileList[0];
	if (file.type == 'image/jpeg' || file.type == 'image/png'){
		reader.readAsDataURL(file, "utf-8");
		reader.onload = (function(_) {
			return function(e) {

				const img = new Image();
				img.src = e.target.result;
				img.onload = function() {
					canvasElement.width  = $('.modal-content').width() * 0.9;
					canvasElement.height = canvasElement.width * img.height / img.width;

//					canvasElement.height = img.width;
//					canvasElement.width	= img.height;
					getCodeInfo(img);
				};
			};
		})(file);
	} else {
		alert('JPEGかPNGファイルをアップして下さい');
	}
}
////////////////////////////////////////////////////////

//アグリゲートボンデッドトランザクション
//function exeAggBondedTx(signer,callback,final){
function exeAggBondedTx(signer,exeTx){


	//連署者数カウント用（署名時の手数料決定に使用）
	var cosigners = [];
	for(const tx of exeTx.innerTransactions){

		if(cosigners.find(signer => signer === tx.signer.address.plain()) === undefined){
			cosigners.push(tx.signer.address.plain());
		}
	}

//	const jsonData = JSON.parse(scanData.innerText).data;
	exeTx.deadline = nem.Deadline.create(epochAdjustment,48);
	const aggregateTx = exeTx.setMaxFeeForAggregate(100, cosigners.length - 1);

	console.log(aggregateTx);

	const signedAggregateTx = signer.sign(aggregateTx, generationHash);
	console.log(signedAggregateTx.hash);

	const hashLockTx = nem.HashLockTransaction.create(
		nem.Deadline.create(epochAdjustment),
		networkCurrency.createRelative(10),
//		new nem.Mosaic(new nem.MosaicId(CURRENCY),nem.UInt64.fromUint(10000000)),
//		nem.UInt64.fromUint(480),
		nem.UInt64.fromUint(5760),
		signedAggregateTx,
		networkType,
		nem.UInt64.fromUint(2000000)
	);

/*
	const aggregateLockTx = nem.AggregateTransaction.createComplete(
		nem.Deadline.create(epochAdjustment),
		[hashLockTx.toAggregate(assetPublicAccount)],
		networkType,[],
		nem.UInt64.fromUint(100000)
	);
*/

	const signedLockTx = signer.sign(hashLockTx, generationHash);
	delete signer;

	console.log(nodeRepo.url + "/transactionStatus/" + signedAggregateTx.hash);
	console.log(nodeRepo.url + "/transactions/confirmed/" + signedAggregateTx.hash);
	console.log(nodeRepo.url + "/transactionStatus/" + signedLockTx.hash);
	console.log(nodeRepo.url + "/transactions/confirmed/" + signedLockTx.hash);

	transactionService.announceHashLockAggregateBonded(
		signedLockTx,signedAggregateTx,listener
	)
	.subscribe(aggTx=> showConfirmedTx(assetPublicAccount.address,aggTx.transactionInfo.hash));
}


function exeCosignature(signer,hash){

	bondedRepo = txRepo.getTransaction(hash,nem.TransactionGroup.Partial)
	.pipe(
		op.map(_ => {
			return 	signer.signCosignatureTransaction(nem.CosignatureTransaction.create(_));
		}),
		op.mergeMap(_ => {
			return rxjs.of({
				ignored:txRepo.announceAggregateBondedCosignature(_),
				hash:_.parentHash
			});
		}),
	)
	.subscribe(aggTx=> {
		showConfirmedTx(assetPublicAccount.address,aggTx.hash)
	});




//	console.log(nodeRepo.url + "/transactionStatus/" + signedTx.hash);
//	console.log(nodeRepo.url + "/transactions/confirmed/" + signedTx.hash);


}



//function exeTransfer(payload){
function exeTransfer(signer,exeTx){

	var tx;
	if(signer.address.plain() === assetPublicAccount.address.plain()){

//		tx = nem.TransactionMapping.createFromPayload(payload);
		exeTx.deadline = nem.Deadline.create(epochAdjustment);
		tx = exeTx.setMaxFee(100);
		console.log(tx);

		const signedTx = signer.sign(tx,generationHash);
		delete signer;

		txRepo.announce(signedTx)
		.subscribe(aggTx=> showConfirmedTx(assetPublicAccount.address, signedTx.hash));

		console.log(nodeRepo.url + "/transactionStatus/" + signedTx.hash);
		console.log(nodeRepo.url + "/transactions/confirmed/" + signedTx.hash);


	}else{


//		const innerTx = nem.TransactionMapping.createFromPayload(payload);

		//資産アカウントと操作アカウントが異なる場合
		const aggregateTx = nem.AggregateTransaction.createBonded(
			nem.Deadline.create(epochAdjustment,48),
			[exeTx.toAggregate(assetPublicAccount)],
			networkType,[],
		).setMaxFeeForAggregate(100, 0);
		console.log(aggregateTx);
		tx = aggregateTx;




		console.log(aggregateTx);

		const signedAggregateTx = signer.sign(aggregateTx, generationHash);
		console.log(signedAggregateTx.hash);

		const hashLockTx = nem.HashLockTransaction.create(
			nem.Deadline.create(epochAdjustment),
			networkCurrency.createRelative(10),
//			nem.UInt64.fromUint(480),
			nem.UInt64.fromUint(5760),
			signedAggregateTx,
			networkType,
			nem.UInt64.fromUint(2000000)
		);

/*
		const aggregateLockTx = nem.AggregateTransaction.createComplete(
			nem.Deadline.create(epochAdjustment),
			[hashLockTx.toAggregate(assetPublicAccount)],
			networkType,[],
			nem.UInt64.fromUint(100000)
		);
*/
		const signedLockTx = signer.sign(hashLockTx, generationHash);
		delete signer;

		console.log(nodeRepo.url + "/transactionStatus/" + signedAggregateTx.hash);
		console.log(nodeRepo.url + "/transactions/confirmed/" + signedAggregateTx.hash);
		console.log(nodeRepo.url + "/transactionStatus/" + signedLockTx.hash);
		console.log(nodeRepo.url + "/transactions/confirmed/" + signedLockTx.hash);

		transactionService.announceHashLockAggregateBonded(
			signedLockTx,signedAggregateTx,listener
		)
		.subscribe(aggTx=> showConfirmedTx(assetPublicAccount.address,aggTx.transactionInfo.hash));

	}


}


//選択中アカウントの完了トランザクション検知リスナー
const signedTxConfirmed = function(address,hash){

	const transactionObservable = listener.confirmed(address);
	const errorObservable = listener.status(address, hash);
	return rxjs.merge(transactionObservable, errorObservable).pipe(
		op.first(),
		op.map((errorOrTransaction) => {
			if (errorOrTransaction.constructor.name === "TransactionStatusError") {
				throw new Error(errorOrTransaction.code);
			} else {
				return errorOrTransaction;
			}
		}),
	);
}

//連署要求検知リスナー
//function setSignerListener(cosignerAccount,callback){
function setSignerListener(address){

	var bondedSubscribe = function(observer){

		observer.pipe(

			//すでに署名済みでない場合
//			op.filter(_ => !_.signedByAccount(cosignerAccount.address)),
			op.filter(_ => !_.signedByAccount(address)),
			//起案者でない場合(署名により発行済み）
//			op.filter(_ =>  !_.signer.equals(cosignerAccount))
			op.filter(_ =>  {
				return _.signer.address.plain() !== address.plain();
			})

		).subscribe(_=>{

			txRepo.getTransactionsById([_.transactionInfo.hash],nem.TransactionGroup.Partial)
			.pipe(
				op.filter(aggTx => aggTx.length > 0)
			)
			.subscribe(async function(aggTx ){

				//インナートランザクションの署名者に自分が指定されている場合
//				if(aggTx[0].innerTransactions.find((inTx) => inTx.signer.equals(cosignerAccount))!= undefined){
				if(aggTx[0].innerTransactions.find((inTx) => inTx.signer.address.plain() === address.plain())!= undefined){

					await onSignableTxAdded(aggTx[0].innerTransactions);


//					disableScan = true;
//					txs = aggTx[0].innerTransactions;
//					for(const tx of txs){
//						await appendTxInfo(tx,tx.signer.address);
//					}



//					scanData = aggTx[0].transactionInfo.hash;
					//setCodeData(aggTx[0].transactionInfo.hash);
//					setSignTargetData(aggTx[0].serialize());
					setSignTargetData(aggTx[0].transactionInfo.hash);
//					callback();

				}
			});
		});
	}

//	const bondedListener = listener.aggregateBondedAdded(cosignerAccount.address)
	const bondedListener = listener.aggregateBondedAdded(address)
//	const bondedRepo = txRepo.search({address:cosignerAccount.address,group:nem.TransactionGroup.Partial})
	const bondedRepo = txRepo.search({address:address,group:nem.TransactionGroup.Partial})
	.pipe(
		op.delay(2000),
		op.mergeMap(page => page.data)
	);

	bondedSubscribe(bondedListener);
	bondedSubscribe(bondedRepo);
}

//function setAccountObserver(address,opAccountInfo,subscribeAccountInfo){
function setAccountObserver(address,subscribeAccountInfo){

	const accountSubscribe = function(observer){

		observer.subscribe(_=>{

			subscribeAccountInfo(_);

		},err => console.log(err));
	}

	const assetRepo = accountRepo.getAccountInfo(address)
	.pipe(
		op.mergeMap(_=> _.mosaics),
		op.toArray(),
//		opAccountInfo()
	);

	const assetListener = listener.confirmed(address)
	.pipe(
		op.delay(1000),
		op.mergeMap(x=>accountRepo.getAccountInfo(address)),
		op.first(),
//		opAccountInfo(),
		op.mergeMap(_=> _.mosaics),
		op.toArray(),
		op.repeat()
	)

	accountSubscribe(assetRepo);
	accountSubscribe(assetListener);
}

function _getMosaicAsset(targetId,mosaicInfos,mosaicNames){

	var mosaicLabel;
	var mosaicInfo = mosaicInfos.filter(function(item, index){
	  if (item.id.toHex() == targetId.toHex()) return true;
	});
	var mosaicName = mosaicNames.filter(function(item, index){
	  if (item.mosaicId.toHex() == targetId.toHex()) return true;
	});
	if (mosaicName[0].names[0]){
		mosaicLabel = mosaicName[0].names[0].name;
	}else{
		mosaicLabel = mosaicName[0].mosaicId.toHex();
	}

	var mosaic = {info:mosaicInfo[0],label:mosaicLabel};
	return mosaic;
}


async function getMosaicAsset(itemId){


	var mosaicId;
	if(itemId.constructor.name === "NamespaceId"){
		mosaicId = await nsRepo.getLinkedMosaicId(itemId).toPromise();

	}else{

		mosaicId = itemId;
	}

	var mosaicInfos = await mosaicRepo.getMosaics([mosaicId]).toPromise();
	var mosaicNames = await nsRepo.getMosaicsNames([mosaicId]).toPromise();

	var mosaicLabel;
	var mosaicInfo = mosaicInfos.filter(function(item, index){
	  if (item.id.toHex() == mosaicId.toHex()) return true;
	});
	var mosaicName = mosaicNames.filter(function(item, index){
	  if (item.mosaicId.toHex() == mosaicId.toHex()) return true;
	});
	if (mosaicName[0].names[0]){
		mosaicLabel = mosaicName[0].names[0].name;
	}else{
		mosaicLabel = mosaicName[0].mosaicId.toHex();
	}

	var mosaic = {info:mosaicInfo[0],label:mosaicLabel};
	return mosaic;
}
