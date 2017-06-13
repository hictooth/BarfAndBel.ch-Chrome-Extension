/*
BarfAndBel.ch Chrome Extension - Barfing Out DreamWorks Dragons Quotes
Copyright (C) 2016 hictooth.com

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

Data sourced from http://barfandbel.ch/api by Iantje
Version 0.6.9 - offline image now in separate file
*/

chrome.runtime.onInstalled.addListener(function(details)
{
	chrome.storage.sync.set({ blur: true });
	preloadQuote();
	preloadQuote2();
});

if( localStorage.httydQuote == undefined || localStorage.httydQuote == "" )
{
	preloadQuote();
	preloadQuote2();
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse)
{
	if( JSON.parse(request.data).message == "preloadQuote" )
	{
		preloadQuote();
	}
	else if( JSON.parse(request.data).message == "preloadQuote2" )
	{
		preloadQuote2();
	}
});

function convertImgToBase64URL(url, callback, outputFormat)
{
	var img = new Image();
	img.crossOrigin = 'Anonymous';
	img.onload = function()
	{
		var canvas = document.createElement('CANVAS'),
		ctx = canvas.getContext('2d'), dataURL;
		canvas.height = this.height;
		canvas.width = this.width;
		ctx.drawImage(this, 0, 0);
		dataURL = canvas.toDataURL(outputFormat);
		callback(dataURL);
		canvas = null;
	};
	img.src = url;
}

function preloadQuote()
{
	try {
		var tempQuote = localStorage.httydQuote;
		localStorage.httydQuote = "";
		var ajaxRequest = new XMLHttpRequest();
		ajaxRequest.onreadystatechange = function()
		{
			if( ajaxRequest.readyState === 4 && ajaxRequest.status === 200 )
			{
				console.log("Quote 1: Received data from API");
				var dragonQuote = JSON.parse(ajaxRequest.responseText);
				convertImgToBase64URL(dragonQuote[0].imgur, function(base64Img)
				{
					console.log("Quote 1: Get base64 data from image");
					dragonQuote[0].imageData = base64Img;
					try
					{
						localStorage.httydQuote = JSON.stringify(dragonQuote[0]);
					}
					catch(err)
					{
						preloadQuote();
					}
				});
			}
			else if( ajaxRequest.readyState === 4 && ajaxRequest.status === 0 )
			{
				console.log("Quote 1: We're offline!");
				localStorage.httydQuote = JSON.stringify(offlineQuote);
			}
		}
		ajaxRequest.open("GET", "http://barfandbel.ch/api/quote.php?limit=1", true);
		ajaxRequest.send();
		return true;
	} catch(err) {
		console.error('there was an error, ', err)
		preloadQuote()
	}
}

function preloadQuote2()
{
	try {
		var tempQuote2 = localStorage.httydQuote2;
		localStorage.httydQuote2 = "";
		var ajaxRequest = new XMLHttpRequest();
		ajaxRequest.onreadystatechange = function()
		{
			if( ajaxRequest.readyState === 4 && ajaxRequest.status === 200 )
			{
				console.log("Quote 2: Received data from API");
				var dragonQuote = JSON.parse(ajaxRequest.responseText);
				convertImgToBase64URL(dragonQuote[0].imgur, function(base64Img)
				{
					console.log("Quote 2: Get base64 data from image");
					dragonQuote[0].imageData = base64Img;
					try
					{
						localStorage.httydQuote2 = JSON.stringify(dragonQuote[0]);
					}
					catch(err)
					{
						preloadQuote();
					}
				});
			}
			else if( ajaxRequest.readyState === 4 && ajaxRequest.status === 0 )
			{
				console.log("Quote 2: We're offline!");
				localStorage.httydQuote2 = JSON.stringify(offlineQuote);
			}
		}
		ajaxRequest.open("GET", "http://barfandbel.ch/api/quote.php?limit=1", true);
		ajaxRequest.send();
		return true;
	} catch(err) {
		console.error('there was an error, ', err)
		preloadQuote()
	}
}

offlineQuote = {"timestamp":"9/18/2015 2:19:12","id":"31","quote":"Mild calibration issue...","name":"Hiccup Horrendous Haddock III","source":"You're offline!","bg":"calibrationissue.png","submittedby":"Reconnect to get more quotes!","episode":"","imgur":"http://i.imgur.com/Z0BN2Lh.png","url":"","imageData":"offline.png"};
