chrome.webRequest.onBeforeSendHeaders.addListener(

function (details){

//オプション設定によって、判別するサイズを指定
chrome.storage.sync.get(null, function(items) {
    select_strength = items.selectStrength;
    
    switch(select_strength){
    	case "loose"    : count = 90;  total_judge =7000; test_judge=5000; break;
    	case "normal"  : count = 80;  total_judge =6500; test_judge=4500; break;
    	case "strict"     : count = 70;  total_judge =6000; test_judge=4000; break;
    	default             : count = 80;  total_judge =6500; test_judge=4500; break;
    }

//alertを表示するための設定
function alert(msg) {
    chrome.notifications.create({
        type : 'basic',
        message : msg,
        title : 'Cookie Alert',
        iconUrl : "icon48.png"
    });
}

//Cookieが設定されているか判断
var cookie_judge=false;
for(var i=0; i<details.requestHeaders.length; ++i){
	if(details.requestHeaders[i].name.toLowerCase() === 'cookie'){
		var cookie = details.requestHeaders[i].value; 
		var cookielist = cookie.split('; ');
		cookie_judge = true; 
		
		//Cookieの個数が多い場合警告文を表示
		if(cookielist.length >= count){
	        alert(count+"個以上のCookieが設定されています。\n下記のサイトのCookieを確認して下さい。\n\n<URL>  "+details.url+"\n"+"<Cookieの個数>  "+cookielist.length+"個") 
	    }  
    }
}
	
var total_size = 0;
var exclusion_size = 0;
//特定のsizeの大きいcookieを変数に格納
var exclusion1 ='___utmvc'
var exclusion2 =[ 'ak_bmsc', '_abck' , 'bm_sz', 'bm_sv', 'bm_mi']

//Cookieの総量を計算
if(cookie_judge==true){
	for(var i=0;i<cookielist.length;i++){
	    var cookielist2 = cookielist[i].split('=');
	    total_size+=cookielist2[0].length+cookielist2[1].length ;

       //___utmvcのcookieを識別 
　　if(cookielist2[0] == exclusion1){
           var judge_size=cookielist2[0].length+cookielist2[1].length ;
    	   if(2800<judge_size && judge_size<3000){
               exclusion_size+=cookielist2[0].length+cookielist2[1].length ;
    		 }
        }
        //akamaiのcookieを識別
	    for(var j=0;j<exclusion2.length;j++){
	         if(cookielist2[0] == exclusion2[j] && cookielist2[1].indexOf("~YAAQ")!=-1){	
	             exclusion_size+=cookielist2[0].length+cookielist2[1].length ;
	         }    
	    }
	    
	}
}

//test_sizeはcookieの総量から特定のcookieを除いたもの
var test_size= total_size - exclusion_size;

//total_sizeはcookieの総量
if(total_size >= total_judge){
    //Cookieの総量が多い場合警告文を表示
	alert(total_judge+"bytes以上のCookieが設定されています。\n下記のサイトのCookieを確認して下さい。\n\n<URL>  "+details.url+"\n"+"<Cookieの総量>  "+total_size+"bytes")
}

//test_sizeはcookieの総量から特定のcookieを除いたもの
if(test_size >= test_judge){
    //Cookieの量が多い場合警告文を表示
	alert(test_judge+"bytes以上の指定のCookieが設定されています。\n下記のサイトのCookieを確認して下さい。\n\n<URL>  "+details.url+"\n"+"<指定のCookieの総量>  "+test_size+"bytes")
}
	
});

},
	{urls: ["https://*/*","http://*/*"]},
	[
	 "requestHeaders"
	] 
);