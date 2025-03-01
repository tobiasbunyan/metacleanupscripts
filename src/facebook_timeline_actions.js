// Remove posts from Facebook profile page.  Useful for those items which do not show in the activity log.
//
// 'actionMenuItemText' are the menu item options to look for and execute, in order.
// When one is matched, it is clicked and the loop is aborted.  If no match the item is ignored.
//
// You may have to manually scroll the page to make enough items load for this to be effective.
//
// Scripts to run in-place when the relevant page is open in Facebook
// Written and tested in ScriptRunner Pro chrome extension

const actionButtonLabel = "Actions for this post";
const actionMenuItemText = ["Move to archive", "Hide from profile"];

var removeItems = async function() {
	
	while(1===1) {

        var actionButtons = await waitForElements(document, 'div[aria-label=\"' + actionButtonLabel + '\"]');

		if(actionButtons === null || actionButtons.length === 0) {
		  console.error('No action buttons found');
          await sleep(500);
		  return;
		}

        for(let i = 0; i < actionButtons.length; i++) {

          let item = actionButtons[i];

          item.click();

          await sleep(500);

          for(let p = 0; p < actionMenuItemText.length; p++) {
            
            let text = actionMenuItemText[p];
            
            var n = document.evaluate("//span[text()='" + text + "']", item, null, 9, null).singleNodeValue;

            if(n === null) {
                console.log('Didn\'t find "' + text + '"');
              item.click(); //Removes menu item again
            } else {
                console.log('Found "' + text + '"');
                n.click();
                await sleep(500);
                break
            }
          }
       }
	}
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

async function waitForElements(e, selector, maxWait = 10000) {
	let waited = 0;
	const interval = 500;
	
	var o = e.querySelectorAll(selector);
	
	while(o === null && waited < maxWait) {
		console.log('Waiting for element ' + selector);
		await sleep(interval);
		o = e.querySelector(selector);
		waited += interval;
	}
	
	return o;
}

removeItems();
