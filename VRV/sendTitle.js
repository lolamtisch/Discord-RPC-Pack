setInterval(function(){
	try{
		let frame = document.querySelector('.video-player')
		let data={
			"title":document.querySelector(".episode-info").parentElement.querySelector(".title").innerText,
			"series":document.querySelector(".episode-info").querySelector(".series").innerText,
		}
		frame.contentWindow.postMessage(data, 'https://static.vrv.co/');
	}catch(e){
		console.error(e)
	}
},1000)