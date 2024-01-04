# HabiStore Online Donation Pickup Scheduling Web App

This is to be used by Tucson HabiStore's donors to schedule pickups of donated items.

0) cancel save the reason 

1) Need to handle when all unassigned slots are filled. Not sure if this can happen with current route maximum but if we add more trucks handling a zip code we could end up with more than 18 web adds.
-- Possibly only look at the unassigned route when determining if there is space available. 
-- Or create an overflow (waitlist) route and start assigning to it. 
4) Make image upload size smaller. Make the glamor photos smaller.
5) Breadcrumbs - Number of items, number of photos
6) Cookie to hold the customer object, check the cookie and autofill if it exists.
7) Cancel - ask for reason. convenient date/time, accepted items, other
Todo:




Remove toast

View as a calendar... future
donor - have a total pickups and items {pickup: 5, items: 20}
Toast increment/decrement doesn't appear if a custom was added first.
shopifyCustAdd handle where email is already taken by another record. theProduct.err.email[0] 'has already 
Customer - hide client information until phone number check is done.
Add spinners, on loading, on waiting for Shopify customer lookup, on Save.
been taken'
--- perhaps resubmit without the email, and/or notify the scheduler to resolve the discrepency.
