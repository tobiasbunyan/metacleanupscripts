# Meta Clean Scripts
A set of very basic js scripts (designed to run in browser) to enable easy deletion of information from Meta services via the UI - Facebook and Instagram

Some manual tweaks are necessary between pages.

## Background
I wanted to remove myself entirely from Meta products (along with some others) thanks to their ... unsavoury changes in attitudes recently.

Not trusting their own mechanisms to really remove my data I set about some hacky scripts to remove items individually.  Does this delete them any more reliably than just deleting the account?  Who knows, but it is what it is.

There are other methods out there which used to use the API but this seemed like it would need a fair bit of work, and navigating the UI was probably the quickest option.  Others offer paid only services.

There is also the question of exactly who you trust to have access to all your personal type of data on a social media account, via a plugin, or service or other method.

## Usage
I created and tested these in the "Script Runner Pro" Chrome extension, but you can use them in any environment where you can run js in the scope of the page DOM (chrome devtools for example).

They require some manual alteration in terms of DOM attributes and text to search for in different pages.

### facebook_activity_log.js
This one is for deleting items in the Facebook activity log pages.  It basically works by waiting for the "select all" checkbox to become available, clicking it, then clicking the appropriate "remove" button and then waiting for the confirmation dialog to appear and clicking the confirmation button.  Then it waits until there are no checkboxes left on the page.  If no new items appear, it will try to refresh the page.

There is (commented out) code in there to try and automatically complete the occasional password dialog prompt but I couldn't get it to work.  Javascript or browser security? or something added to the DOM by Facebook code?  Who knows, and I didn't care about it enough to find out.

Instructions for changes to make between different types of activity log entries are in the script.

### facebook_timeline_actions.js
This script runs on your profile page to delete items directly from your "feed".  First a list of all clickable "action" buttons from the list of loaded feed items is made, then each button is clicked in turn, and a search is made for each of the actionable menu items defined in the script in order (such as "hide post from timeline" or "archive post").  When one is detected, it is clicked and the menu item loop is aborted.  The script then moves on to the next feed item.

Once no feed items are left, it simply loops round to the start again.

You may need to scroll your feed a bit to get a few clickable items to appear.  Theory is that when an item is removed, more will be loaded.  If some items don't have a matching action menu item, then your page can fill with unactionable items and the script will just loop, so you need to scroll again.

Definition of clickable action menu items is within the script, which contains further instructions.

#### Further Notes
Facebook behaves very erraticaly in terms of removing posts and/or making them removable.  Items deleted will keep coming back into an activity log list, for example, presumably because they have been pulled out of a cache somewhere.  Other items will fail to delete because the original post has been deleted.

It is not uncommon for certain actions to error due to Facebook inconsistencies, even though they shouldn't, and to "throw out" the script from expected behaviour.

In my experience you can only do one of two things:
* Reload the page and see if the script can continue
* Do as much as you can, and then log out and come back to Facebook in a few days and run through it again.

I also found that in the activity log, it helped to filter down the log by specific years.

### instagram.js
This script runs on the Instagram page which has a tab for listing your comments, likes and other posts.  It works by selecting a number of items up to a maximum, then clicking the "action" link on that tab ("unlike" or "delete" or whatever).

The number of items to select at once is defaulted to 50.  Instructions for changing this and the text of the "action" link are in the script.

#### Further Notes
The maximum items limit was put in as I had problems with only being able to delete a few items, and then Instagram would constantly error every time I tried to delete more.  It would help to come back 24 hours later but the problem would re-emerge.  Eventually, weeks later, I was able to just leave the script to loop and it ran right to the end.  Did they fix errors picked up in a log?  Is it an intentional thing to try and discourage people from removing content?  Who knows.

## Improvements
There are tons of improvements could be made.  These were just knocked up to achieve my aims, not to be examples of well crafted code or routines.

Feel free to improve and submit PRs, but I'm not actively updating this now, as all the data has gone and my accounts are closed, so nothing to test it with, so I may not ever look at them.  If you really want to take it somewhere, maybe forking it would be better.

## Other Methods
There are other chrome extensions out there that can perform much the same thing.  I guess I didn't feel like researching them, or necessarily trust them to run in my social media account contexts.
