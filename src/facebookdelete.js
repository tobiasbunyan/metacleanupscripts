// ==UserScript==
// @name Facebook Deletion
// @namespace Script Runner Pro
// @match https://www.facebook.com/*
// @grant none
// ==/UserScript==

const Status = Object.freeze({
    PasswordPrompt: 1,
	PasswordConfirm: 2, 
	RemoveConfirm: 3,
	ItemsListed: 4,
	NoData: 5
});
var clickAllThenClickRemoveDelayms = 500;
var clickRemoveButtonThenClickConfirmRemoveDelayms = 500;

var removeItems = async function() {
	
	while(1===1) {
		
		var allBox = await waitForEnabledElement(document, 'input[name=comet_activity_log_select_all_checkbox]');
		
		if(allBox === null) {
          var isNothing = await isNoItems();

          if(isNothing) {
              console.error('Looks like list is empty ... refresh page ...');
              //Failure might be because of Facebook limiting returns
              //Reload the page
              location.reload();
          } else{
            console.log('Nothing not found');
            console.error('Waited too long for select all box, abort');
            return;
          }
           
		}
		
		allBox.click();
		
		await sleep(500);
		
		var removeButton = await waitForEnabledElement(document, 'div[aria-label=Remove]');
		
		if(removeButton === null) {
			console.error('Waited too long for remove button to enable');
			return;
		}
		removeButton.click();
		
		await sleep(500);
		
		var removeConfirmButton = await waitForEnabledElement(document, 'div[aria-label=\"Remove interaction?\"]');

		if(removeConfirmButton === null) {
			console.error('Waited too long for remove confirm button dialog to appear');
			return;
		}
		
		removeConfirmButton = await waitForEnabledElement(removeConfirmButton, 'div[aria-label=Remove]');

		if(removeConfirmButton === null) {
			console.error('Waited too long for remove confirm button to appear');
			return;
		}
		
		var preCount = getItemCount();
		
		removeConfirmButton.click();
		
		await sleep(500);

		let postCount = preCount;
		let waitCount = 0;
		while(postCount > 0 && waitCount < 20) {
			console.log('Waiting for items to disappear: ' + postCount);
			await sleep(500);
			postCount = getItemCount();	
            waitCount++;
		}
		
		await sleep(1000);
	}
}

function getItemCount() {
	var items = document.querySelectorAll('input[name=comet_activity_log_item_checkbox]');
	return items.length;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForEnabledElement(e, selector, maxWait = 10000) {
	let waited = 0;
	const interval = 500;
	
	var o = await waitForElement(e, selector, maxWait);

	if(o !== null) {
		while(o !== null && waited < maxWait) {
			if(o.disabled === undefined && o.ariaDisabled === undefined) break;
			if(o.disabled !== undefined) {
				if(o.disabled !== true) break;
			} else {
				if(o.ariaDisabled !== undefined) {
					if(o.ariaDisabled !== true) break;
				}
			}
			
			console.log('Waiting for element enable ' + e.name);
			
			await sleep(interval);
			waited += interval;
			o = await waitForElement(e, selector, maxWait);
		}
	}
	
	return ((waited < maxWait) ? o : null);
}

async function waitForElement(e, selector, maxWait = 10000) {
	let waited = 0;
	const interval = 500;
	
	var o = e.querySelector(selector);
	
	while(o === null && waited < maxWait) {
		console.log('Waiting for element ' + selector);
		await sleep(interval);
		o = e.querySelector(selector);
		waited += interval;
	}
	
	return o;
}

var isNoItems = async function() {
  var main = await waitForElement(document, 'input[name=comet_activity_log_select_all_checkbox]');  
  if(main !== null) {
    console.log('Looking for "Nothing to show"');
    var n = document.evaluate("count(//span[text()='Nothing to show'])", document, null, 1, null)
    if(n.numberValue < 1) {
        console.log('Didn\'t find "Nothing to show"');
        return false;
    } else {
        console.log('Found "Nothing to show"');
        return true;
    }
  }
}

removeItems();
