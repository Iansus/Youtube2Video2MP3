var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var timers = require('sdk/timers');

var button = buttons.ActionButton({
  id: "video-dl",
  label: "No video to download",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick,
  disabled: true
});

function handleClick(state) {
	tabs.open({
		url:"http://www.video2mp3.net/fr/loading.php?url="+encodeURIComponent(tabs.activeTab.url),
		inNewWindow: true,
	});
}

function handleTabClose(tab)
{
	//console.log('Closing '+tab.url+' with timeout='+tab.timeout);
	timers.clearTimeout(tab.timeout);
}

function initHandleTabLoad(tab)
{
	if (tab.managed==undefined)
		tab.managed = true;
	else 
		return;
		
	handleTabLoad(tab);
}

function handleTabLoad(tab)
{
	var patterns = [
			/^https?:\/\/(www\.)?youtube\.com\/watch\?v=/ig,
		];
		
	var ret=false;
	
	for (i=0; i<patterns.length; i++)
	{
		patt = patterns[i];
		res = patt.test(tab.url);
		
		//console.log(patt.toString()+' with '+tab.url+' : '+res)
		
		if (res && !ret)
		{
			button.state(tab, {
				disabled: false,
				label: "Download video"
			});
			ret = true;
		}
	}
	
	tab.timeout = timers.setTimeout(handleTabLoad, 1500, tab);
	//console.log('Timeout='+tab.timeout);
	
	if(ret)
		return;
	
	button.state(tab, {
		disabled: true,
		label: "No video to download"
	});
}

tabs.on("ready", initHandleTabLoad);
tabs.on("open", initHandleTabLoad);
tabs.on("close", handleTabClose);