/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {

  const createTweetElement = (data) => {
    // takes in a tweet object
    // returns a tweet article containing HTML structure of the tweet
    const $tweet = $(`
      <article class="tweet">
        <header>
          <img src="https://i.imgur.com/73hZDYK.png">
          <h2>${data.user.name}</h2>
          <p>${data.user.handle}</p>
        </header>
        <section>
          <p>${data.content.text}</p>
        </section>
        <footer>
          <p>${data['created_at']}</p>
          <div>
            <i class="fas fa-flag"></i>
            <i class="fas fa-retweet"></i>
            <i class="fas fa-heart"></i>
          </div>
        </footer>
      </article>
      `);
    return $tweet;
  };

  const tweetData = {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png",
        "handle": "@SirIsaac"
      },
    "content": {
        "text": "If I have seen further it is by standing on the shoulders of giants"
      },
    "created_at": 1461116232227
  };

  const $tweet = createTweetElement(tweetData);
  console.log($tweet); // to see what it looks like
  $('#tweets-container').append($tweet); // to add it to the page so we can make sure it's got all the right elements, classes, etc.

});
/* HTML structure
      <article class="tweet">
        <header>
          <img src="https://i.imgur.com/73hZDYK.png">
          <h2>Rhonda Jacobs</h2>
          <p>@MrsJacobs</p>
        </header>
        <section>
          <p>Hello world!</p>
        </section>
        <footer>
          <p>10 days ago</p>
          <div>
            <i class="fas fa-flag"></i>
            <i class="fas fa-retweet"></i>
            <i class="fas fa-heart"></i>
          </div>
        </footer>
      </article>
*/