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

var boxUp = false;
var boxLeft = false;

function getTopSites(callback)
{
	chrome.topSites.get(function(result)
	{
		//result = [{title:"Berk's Grapevine",url:"http://www.berksgrapevine.com"},{title:"Berk's Forumvine",url:"http://forums.berksgrapevine.com"},{title:"Barf And Belch | BARFing out Quotes",url:"http://barfandbel.ch"},{title:"How to Train Your Dragon Wiki - Wikia",url:"http://howtotrainyourdragon.wikia.com/wiki/How_to_Train_Your_Dragon_Wiki"},{title:"How To Train Your Dragon | Official Website | DreamWorks Animation",url:"http://www.howtotrainyourdragon.co.uk"},{title:"Dragon Training (@httyd) on Twitter",url:"https://twitter.com/httyd"},{title:"How To Train Your Dragon",url:"http://howtotrainyourdragon.tumblr.com/"},{title:"How To Train Your Dragon",url:"https://www.reddit.com/r/httyd"}];
		var topSitesDiv = '<div id="most-visited" class="thumb-ntp" style="position: absolute;top: 80%;left: 50%;-moz-transform: translateX(-50%) translateY(-50%);-webkit-transform: translateX(-50%) translateY(-50%);transform: translateX(-50%) translateY(-80%);z-index: 100;width: 680px;"><div class="mv-tiles-old"></div><div id="mv-tiles" style="opacity: 1;">';
		for( var x = 0; x < result.length && x < 8; x++ )
		{
			if( x == 4 )
			{
				topSitesDiv = topSitesDiv + '</div><div id="mv-tiles" style="opacity: 1; margin-top:44px;">';
			}
			topSitesDiv = topSitesDiv + '<a class="mv-tile" data-tid="1" href="' + result[x].url + '" title="' + result[x].title + '"><div class="mv-favicon"><img src="http://www.google.com/s2/favicons?domain=' + result[x].url + '" title=""></div><div class="mv-title" style="direction: ltr;">' + result[x].title + '</div></a>'
		}
		topSitesDiv = topSitesDiv + "</div></div>";
		callback(topSitesDiv);
	} );
}

document.body.onload = function()
{
	if( localStorage.httydQuote != "" )
	{
		result = JSON.parse(localStorage.httydQuote);
		chrome.extension.sendMessage({ data: '{"destination":"background", "message":"preloadQuote"}' });
		getTopSites( function( topSitesDiv )
		{
			chrome.storage.sync.get(
			{
				blur: true
			}, function(items)
			{
				pageData = getPageData(result.quote, result.name, result.source, result.episode, result.submittedby, result.imageData, topSitesDiv, items.blur);
				document.write(pageData);
				window.onresize = checkDimensions;
				checkDimensions();
			});
		});
	}
	else if( localStorage.httydQuote2 != "" )
	{
		result = JSON.parse(localStorage.httydQuote2);
		chrome.extension.sendMessage({ data: '{"destination":"background", "message":"preloadQuote2"}' });
		getTopSites( function( topSitesDiv )
		{
			chrome.storage.sync.get(
			{
				blur: true
			}, function(items)
			{
				pageData = getPageData(result.quote, result.name, result.source, result.episode, result.submittedby, result.imageData, topSitesDiv, items.blur);
				document.write(pageData);
				window.onresize = checkDimensions;
				checkDimensions();
			});
		});
	}
	else
	{
		window.addEventListener('storage', function(event)
		{
			if( ( event.key == "httydQuote" ) || ( event.key == "httydQuote2" ) )
			{
				result = JSON.parse(event.newValue);
				if( event.key == "httydQuote" )
				{
					chrome.extension.sendMessage({ data: '{"destination":"background", "message":"preloadQuote"}' });
				}
				else
				{
					chrome.extension.sendMessage({ data: '{"destination":"background", "message":"preloadQuote2"}' });
				}
				getTopSites( function( topSitesDiv )
				{
					chrome.storage.sync.get(
					{
						blur: true
					}, function(items)
					{
						pageData = getPageData(result.quote, result.name, result.source, result.episode, result.submittedby, result.imageData, topSitesDiv, items.blur);
						document.write(pageData);
						window.onresize = checkDimensions;
						checkDimensions();
					});
				});
			}
		}, false);
	}
}

function checkDimensions()
{
	checkHeight();
	checkWidth();
}

function checkHeight()
{
	if( document.getElementById("container") != null )
	{
		if( document.title != "New Tab" )
		{
			document.title = "New Tab";
		}
		if( ! boxLeft )
		{
			if( ( ( window.innerHeight - document.getElementById("container").offsetHeight ) < 270 ) && ( ! boxUp ) )
			{
				document.getElementById("most-visited").style.display = "none";
				boxUp = true;
			}
			else if( ( ! ( ( window.innerHeight - document.getElementById("container").offsetHeight ) < 270 ) ) && ( boxUp ) )
			{
				document.getElementById("most-visited").style.display = "block";
				boxUp = false;
			}
		}
		
		if( ! boxUp )
		{
			if( ( window.innerWidth < 690 ) && ( ! boxLeft ) )
			{
				document.getElementById("most-visited").style.display = "none";
				boxLeft = true;
			}
			else if( ( window.innerWidth > 690 ) && ( boxLeft ) )
			{
				document.getElementById("most-visited").style.display = "block";
				boxLeft = false;
			}
		}
	}
	else
	{
		startLoop();
	}
}

function startLoop()
{
	if( document.getElementById("container") == null )
	{
		setInterval(startLoop, 10);
	}
	else
	{
		checkHeight();
	}
}

function checkWidth()
{
        /*if( ( ( innerHeight - (document.getElementById("wrap").offsetTop/2 + document.getElementById("wrap").offsetHeight) ) < ( ( document.getElementById("bottombox").offsetHeight ) + 45 ) ) && ( innerWidth - (document.getElementById("wrap").offsetLeft/2 + document.getElementById("wrap").offsetWidth) ) < ( ( document.getElementById("bottombox").offsetWidth ) + 35 ) )
        {
            document.getElementById("bottombox").style.visibility = "hidden";
        }
        else if( ( ( innerWidth - (document.getElementById("wrap").offsetLeft/2 + document.getElementById("wrap").offsetWidth) ) > ( ( document.getElementById("bottombox").offsetWidth ) + 35 ) ) )
        {
            document.getElementById("bottombox").style.visibility = "visible";
        }

        if( ( innerWidth - (document.getElementById("wrap").offsetLeft/2 + document.getElementById("wrap").offsetWidth) ) < ( ( document.getElementById("bottombox").offsetWidth ) + 45 ) && ( ( innerHeight - (document.getElementById("wrap").offsetTop/2 + document.getElementById("wrap").offsetHeight) ) < ( ( document.getElementById("bottombox").offsetHeight ) + 35 ) ) )
        {
            document.getElementById("bottombox").style.visibility = "hidden";
        }
        else if( ( ( innerHeight - (document.getElementById("wrap").offsetTop/2 + document.getElementById("wrap").offsetHeight) ) > ( ( document.getElementById("bottombox").offsetHeight ) + 45 ) ) )
        {
            document.getElementById("bottombox").style.visibility = "visible";
        }*/
}

function getPageData( quote, name, source, episode, submission, imageData, topSites, blur )
{
	if( episode != "" )
	{
		source = source + ", episode: " + episode;
	}
	if( source != "You're offline!" )
	{
		source = "in " + source;
	}
	if( submission != "Reconnect to get more quotes!" )
	{
		submission = "Submitted by " + submission;
	}
	console.log(blur);
	if( blur )
	{
		bgClass = "blurBackground";
	}
	else
	{
		bgClass = "";
	}
return '<html>\
	<head>\
		<title>New Tab</title>\
		<link rel="icon" type="image/png" href="favicon.png" />\
		<link href="style.css" rel="stylesheet" type="text/css">\
		<style>\
			#bg {\
				background-image: url(' + imageData + ');\
				background-size: cover;\
				background-position: center;\
				display: block;\
				height: 110%;\
				width: 110%;\
				top: -5;\
				left: -8;\
				position: fixed;\
				z-index: 0;\
			}\
		</style>\
	</head>\
	<body>\
		<div id="bg" class="bg ' + bgClass + '"></div>\
		' + topSites + '\
		<div id="wrap" class="page">\
			<div id="container" class="quote">\
				<div id="quote"><span>&quot;</span>' + quote + '<span>&quot;</span></div>\
				<div id="character">' + name + '</div>\
				<div id="source">' + source + '</div>\
				<div id="submittor">' + submission + '</div>\
			</div>\
		</div>\
		<div class="credits">Chrome extension by hictooth, BarfAndBel.ch by Iantje</div>\
	</body>\
</html>';
}