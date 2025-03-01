// Remove items from the instagram web interface interactions page (comments, likes etc.)
//
// Change 'actionLinkText' value to appropriate value for the action link.
// Change maxItems for the maximum amount of items to delete at once.
// 
// Scripts to run in-place when the relevant page is open in Facebook
// Written and tested in ScriptRunner Pro chrome extension

const actionLinkText = "Unlike";
const maxItems = 50;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const loop = async function() {
	while(1===1) {

      let nl = document.evaluate('//span[text()="Select"]', document, null, 9, null);
		while(nl.singleNodeValue === null) {
			await sleep(500);
			nl = document.evaluate('//span[text()="Select"]', document, null, 9, null);
		}
		
		nl.singleNodeValue.click();
		
		let m = document.querySelectorAll('div[data-testid=bulk_action_checkbox]');
		while(m.length < 1){
			await sleep(500);
			m = document.querySelectorAll('div[data-testid=bulk_action_checkbox]');
		};
		
		let promiseStack = [];
		let interval = 500;
		let maxStack = Math.min(maxItems, m.length);
		for(let i = 0;i < maxStack;i++){
			console.log('Clicking...');
			let n = m[i];
			promiseStack.push(sleep(interval).then(s => { n.click(); }));
			interval += 500;
		}

		Promise.all(promiseStack).then(async s => {
			console.log('All promises resolved');
			console.log('Looking for //span[text()="' + actionLinkText + '"]');
			let nl1 = document.evaluate('//span[text()="' + actionLinkText + '"]', document, null, 9, null);
			while(nl1.singleNodeValue === null) {
				await sleep(500);
				console.log('Looking for //span[text()="' + actionLinkText + '"]');
				nl1 = document.evaluate('//span[text()="' + actionLinkText + '"]', document, null, 9, null);
			}

			nl1.singleNodeValue.click();
			
			await sleep(500);
			
			console.log('Looking for //div[text()="' + actionLinkText + '"]');
			let nl2 = document.evaluate('//div[text()="' + actionLinkText + '"]', document, null, 9, null);
			
			while(nl2.singleNodeValue === null) {
				await sleep(500);
				console.log('Looking for //div[text()="' + actionLinkText + '"]');
				nl2 = document.evaluate('//div[text()="' + actionLinkText + '"]', document, null, 9, null);
			}
					
			nl2.singleNodeValue.click();
		});
	}
}

loop();
