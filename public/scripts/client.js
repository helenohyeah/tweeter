/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  const $form = $('.new-tweet form');
  const $textarea = $('#tweet-text');

  // submit handler to post a new tweet asynchronously
  $form.on('submit', function(e) {
    e.preventDefault();
    const msg = $textarea.val();
    console.log('msg>>', msg);
    console.log('msg.length>>', msg.length);
    
    // error handling
    if (msg.length === 0) {
      alert('Error: Nothing in tweet')
    } else if (msg.length > 140) {
      // this tweet is exactly exactly exactly exactly exactly exactly exactly exactly exactly exactly  exactly exactly exactly exactly 141 characters
      alert('Error: Tweet exceeds 140 characcters');
     
    // no errors => send post request
    } else {
      const data = $(this).serialize();
      $.ajax('/tweets', { method: 'POST', data })
        .then(function() {
          // clears the form
          $textarea.val('');
        })
        // .then(function () {
        //   $.ajax('/tweets', { method: 'GET' })
        // }).then(function (tweets) {
        //   renderTweets(tweets);
        // });
    }

  });

  // requests array of tweets
  const loadTweets = () => {
    $.ajax('/tweets', { method: 'GET' })
      .then(function (tweets) {
        renderTweets(tweets);
      })
  };

  loadTweets();

  // takes in a tweet object and returns HTML structure
  const createTweetElement = (tweet) => {

    const getTimeSince = (days) => days === 1 ? `${days} day ago` : `${days} days ago`;

    // turns timestamp into X days ago
    const today = Date.now();
    const created = tweet['created_at'];
    const diffInMS = today - created;
    const diffInDays = Math.floor(diffInMS / (1000 * 60 * 60 * 24));
    const timeSince = getTimeSince(diffInDays);

    let $tweet = $(`
      <article class="tweet">
        <header>
          <img src="${tweet.user.avatars}">
          <h2>${tweet.user.name}</h2>
          <p>${tweet.user.handle}</p>
        </header>
        <section>
          <p>${tweet.content.text}</p>
        </section>
        <footer>
          <p>${timeSince}</p>
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

  // takes in array of tweet objects and renders each one in tweet-container
  const renderTweets = (tweets) => {
    tweets.forEach((tweet) => {
      const $tweet = createTweetElement(tweet);
      $('#tweets-container').append($tweet);
    });
  };

  // const data = [
  //   {
  //     "user": {
  //       "name": "Newton",
  //       "avatars": "https://i.imgur.com/73hZDYK.png"
  //       ,
  //       "handle": "@SirIsaac"
  //     },
  //     "content": {
  //       "text": "If I have seen further it is by standing on the shoulders of giants"
  //     },
  //     "created_at": 1461116232227
  //   },
  //   {
  //     "user": {
  //       "name": "Descartes",
  //       "avatars": "https://i.imgur.com/nlhLi3I.png",
  //       "handle": "@rd" },
  //     "content": {
  //       "text": "Je pense , donc je suis"
  //     },
  //     "created_at": 1461113959088
  //   }
  // ];
  
  // renderTweets(data);
});