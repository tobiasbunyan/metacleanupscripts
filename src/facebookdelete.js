// Remove various types of item from Facebook activity log pages
//
// Comment/uncomment the appropriate button label sections before running the script
//
// Scripts to run in-place when the relevant page is open in Facebook
// Written and tested in ScriptRunner Pro chrome extension
//
// Password auto-complete currently not functioning

const myFacebookPassword = "putyourpasswordhereifyouwant";
const passwordConfirmDialogLabel = "Please re-enter your password";
const passwordConfirmConfirmButtonLabel = "Confirm";
const passwordConfirmInputLabel = "Password";

// Comments and Reactions -> Comments
// Comments and Reactions -> Likes and Reactions
const actionButtonLabel = "Remove";
const actionConfirmDialogLabel = "Remove interaction?";
const actionConfirmButtonLabel = "Remove";

// Posts -> Your posts, photos and videos
// Archives
//const actionButtonLabel = "Recycle bin";
//const actionConfirmDialogLabel = "Move to trash?";
//const actionConfirmButtonLabel = "Move to Trash";

// Recycle Bin
//const actionButtonLabel = "Delete";
//const actionConfirmDialogLabel = "Delete?";
//const actionConfirmButtonLabel = "Delete";

var removeItems = async function () {
  while (1 === 1) {
    var allBox = await waitForEnabledElement(
      document,
      "input[name=comet_activity_log_select_all_checkbox]"
    );

    if (allBox === null) {
      var isNothing = await isNoItems();

      if (isNothing) {
        console.error("Looks like list is empty ... refresh page ...");
        //Failure might be because of Facebook limiting returns
        //Reload the page
        location.reload();
      } else {
        console.log("Nothing not found");
        console.error("Waited too long for select all box, abort");
        return;
      }
    }

    allBox.click();

    await sleep(500);

    var removeButton = await waitForEnabledElement(
      document,
      'div[aria-label="' + actionButtonLabel + '"]'
    );

    if (removeButton === null) {
      console.error("Waited too long for remove button to enable");
      return;
    }
    removeButton.click();

    await sleep(500);

    var removeConfirmButtonDialog = await waitForEnabledElement(
      document,
      'div[aria-label="' + actionConfirmDialogLabel + '"]'
    );

    if (removeConfirmButtonDialog === null) {
      console.error(
        "Waited too long for remove confirm button dialog to appear"
      );
      return;
    }

    var removeConfirmButton = await waitForEnabledElement(
      removeConfirmButtonDialog,
      'div[aria-label="' + actionConfirmButtonLabel + '"]'
    );

    if (removeConfirmButton === null) {
      console.error("Waited too long for remove confirm button to appear");
      return;
    }

    var preCount = getItemCount();

    removeConfirmButton.click();

    await sleep(500);

    // Check for password dialog
    var passwordDialog = await waitForElement(
      document,
      'div[aria-label="' + passwordConfirmDialogLabel + '"]',
      500
    );
    if (passwordDialog !== null) {
      // Deal with password
      // TODO: Currently doesn't work.  Can't get password into password input.  js security limitation?
      // Commented out code is the various wys I tried to get this to work
      if (myFacebookPassword !== "") {
        var passwordInputLabel = passwordDialog.querySelector(
          'label[aria-label="' + passwordConfirmInputLabel + '"]'
        );
        var passwordInput = document.getElementById(
          passwordInputLabel.attributes["for"].value
        );
        passwordInput.focus();
        await sleep(500);
        passwordInput.value = myFacebookPassword;
        await sleep(500);
        //var event = new KeyboardEvent('keypress', { key: 'Tab', keyCode: 9 });
        //document.dispatchEvent(event);
        //await sleep(500);
        //event = new KeyboardEvent('keypress', { key: 'Tab', keyCode: 9 });
        //document.dispatchEvent(event);
        //await sleep(500);
        //event = new KeyboardEvent('keypress', { key: 'Enter', keyCode: 13 });
        //document.dispatchEvent(event);
        //await sleep(500);
        var confirmButton = passwordDialog.querySelector(
          'div[aria-label="' + passwordConfirmConfirmButtonLabel + '"]'
        );
        await sleep(500);
        confirmButton.nextElementSibling.click();
        await sleep(500);
        //confirmButton.click();
        //var event = new KeyboardEvent('keypress', { key: 'Enter', keyCode: 13 });
        //document.dispatchEvent(event);
      } else {
        console.error("No password set.  Aborting.");
        return;
      }
    }

    let postCount = preCount;
    let waitCount = 0;
    while (postCount > 0 && waitCount < 20) {
      console.log("Waiting for items to disappear: " + postCount);
      await sleep(500);
      postCount = getItemCount();
      waitCount++;
    }

    await sleep(1000);
  }
};

function getItemCount() {
  var items = document.querySelectorAll(
    "input[name=comet_activity_log_item_checkbox]"
  );
  return items.length;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForEnabledElement(e, selector, maxWait = 10000) {
  let waited = 0;
  const interval = 500;

  var o = await waitForElement(e, selector, maxWait);

  if (o !== null) {
    while (o !== null && waited < maxWait) {
      if (o.disabled === undefined && o.ariaDisabled === undefined) break;
      if (o.disabled !== undefined) {
        if (o.disabled !== true) break;
      } else {
        if (o.ariaDisabled !== undefined) {
          if (o.ariaDisabled !== true) break;
        }
      }

      console.log("Waiting for element enable " + e.name);

      await sleep(interval);
      waited += interval;
      o = await waitForElement(e, selector, maxWait);
    }
  }

  return waited < maxWait ? o : null;
}

async function waitForElement(e, selector, maxWait = 10000) {
  let waited = 0;
  const interval = 500;

  var o = e.querySelector(selector);

  while (o === null && waited < maxWait) {
    console.log("Waiting for element " + selector);
    await sleep(interval);
    o = e.querySelector(selector);
    waited += interval;
  }

  return o;
}

var isNoItems = async function () {
  var main = await waitForElement(
    document,
    "input[name=comet_activity_log_select_all_checkbox]"
  );
  if (main !== null) {
    console.log('Looking for "Nothing to show"');
    var n = document.evaluate(
      "count(//span[text()='Nothing to show'])",
      document,
      null,
      1,
      null
    );
    if (n.numberValue < 1) {
      console.log('Didn\'t find "Nothing to show"');
      return false;
    } else {
      console.log('Found "Nothing to show"');
      return true;
    }
  }
};

removeItems();
