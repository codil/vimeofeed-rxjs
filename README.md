# vimeofeed-rxjs

## Description

This is an HTML presentation of a pre-fetched Vimeo JSON feed.

The entry point is index.html. The application is based on RxJS and Bulma CSS Framewok. The code follows ES2015 syntax and is pre transpiled and packaged with Webpack and Babel, so just open index.html to see the result.

The filter by description feature is activated after typing three or more characters in the search box, and reinitiated when the search box content is less than three characters. The feed is filtered as you type, no need to hit a button.

The two filtering features (by description and by users with more than 10 likes) can be combined.

## Installation and code change

The source code is in the ```scr``` folder. To re-transpile the code, execute ```npm run build``` or ```npm run watch``` to continuously watch for changes. Execute ```npm install``` first to get the dependencies. Of course ```npm``` must be pre-installed on the machine.

PS: I can't get the video's number of plays as the property 'data.stats.plays' is always null. Replaced it with total of credits.