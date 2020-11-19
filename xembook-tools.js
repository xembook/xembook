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


function dispTimeStamp(timeStamp){

	var d = new Date(timeStamp)
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
