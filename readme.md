# The mango market

The Mango market stalls are regularly running mango specials. Help your friend Vusi to purchase mangos  on special for his fruit and veg shop. With the factory function in `mango-shopper.js` create a web application that will help Vusi to see which mangos are on special.

Use the sql script in `sql/tables.sql` to create the required tables in your local database.

Check out `test/mango-shopper.test.js` to see how to use the supplied Factory Function.

##  Create these screens:

* Create a screen where new mango deals can be added: A deal has a price and qty. It's created at a given shop. Shops should be selected from a dropdown. Qty and price should not be blank. And a shop must be selected before a deal is added.

* Create a screen that shows a list of all the shops. Use the pre-populated shops in the `data.sql` file.

* Create a screen that show all the mango deals for a given shop - link to this screen from the shop list screen above. Show deals in the format `qty for price`. For example `3 for R18`, `5 for R27`

* Create a screen where a new shop can be added. Add a link to this screen from the Shop list screen.

* Show a list of the top 5 mango deals - this should be your landing page. Use deal format. Add some mango picture or ways to show deal details visually.

* Allow a user to enter how much money they have to get a recommendation of where to go and buy their mangos. Show the deals, the shop name and the unit_price for each deal.

## Get going

To get going:

* Fork & Clone this repo
* Install the dependencies
* Run the app

## Other things

<!-- * Deploy your app to heroku - share the link with us -->
* Ensure your app is responsive.
* Create a color scheme with some elements of green using : https://coolors.co/
* Create a paper prototype for your screens - plan your screens. Add this to your repo in GitHub.
* Use ExpressJS and Handlebars we started the app for you in `index.js`.

Fork and clone this repo. 
Commit to GitHub regularly.

## Share this with us via email

* Make a demo of how your app is working using [loom](https://www.loom.com/). And email it to us.
* The GitHub repo for your project.
* Your paper prototype - do this first. In the first hour of working on your app. Add photos of the prototypes to your repo. Use prototypes to clarify your thinking with the mentors.
