function savePreferences()
{
	var blur = document.getElementById('blur').checked;
	chrome.storage.sync.set(
	{
		blur: blur
	});
}

function loadPreferences()
{
	chrome.storage.sync.get(
	{
		blur: true
	}, function(items)
	{
		document.getElementById('blur').checked = items.blur;
	});
}

document.addEventListener('DOMContentLoaded', loadPreferences);
document.getElementById('blur').addEventListener('click', savePreferences);