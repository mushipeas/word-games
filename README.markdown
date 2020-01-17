# Word Games
 A Pen created at CodePen.io. Original URL: [https://codepen.io/mushipeas/pen/rOmOLK](https://codepen.io/mushipeas/pen/rOmOLK).
 
 Current version at : [https://mushipeas.github.io/word-games/](https://mushipeas.github.io/word-games/).

 Old project that is a work-in-progress.

A game where you have to type the words as they go across the screen.

Eventually, I'd like the user to be able to select a source of words at the beginning.

Update 14/1/20: dynamic score now working. Though the score doesn't really mean much at the moment, as it is disproportionately affected by time.

Update 15/7/17:  animation update.
The words are now have animated scrolling across the page. Due to the way it was originally structured, I have to insert a dummy element to get the active word width, which is then used to determine the animation start point through a css variable. I believe this doesn't work on some IE versions, so please use Chrome to get the proper experience.

Update 7/7/17: finally did some work on it.
At the moment, the words are stationary, and there's no real structure to the code.
The score counter is also present, but can be really frustrating in terms of how fast you can lose your score, and because it reaches a steady state, due to the ratio equation being applied. Requires tweeking.
