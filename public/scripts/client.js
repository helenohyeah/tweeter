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

    // error handling
    const msg = $textarea.val();
    if (msg.length === 0) {
      alert('Error: Nothing in tweet')
    } else if (msg.length > 140) {
      // this tweet is exactly exactly exactly exactly exactly exactly exactly exactly exactly exactly  exactly exactly exactly exactly 141 characters
      alert('Error: Tweet exceeds 140 characters');
     
    // no errors => send post request
    } else {
      $.ajax('/tweets', { method: 'POST', data: $(this).serialize() })
        .then((res) => {
          return $.ajax('/tweets', { method: 'GET' });
        })
        .then((res) => {
          // show the new tweet below the form
          const newTweet = res[res.length - 1];
          const newTweetElement = createTweetElement(newTweet);
          $('#tweets-container').prepend(newTweetElement);
        })
        .then((res) => {
          // clear the form
          $textarea.val('');
        })
        .fail((err) => {
          console.log('Error:', err);
        });
    }
  });

  // requests array of tweets on page load
  const loadTweets = () => {
    $.ajax('/tweets', { method: 'GET' })
      .then(function(tweets) {
        renderTweets(tweets);
      })
      .fail((err) => {
        console.log('Error:', err);
      });
  };
  loadTweets();

  // takes in a tweet object and returns HTML structure
  const createTweetElement = (tweet) => {
    
    // turn timestamp into X days ago
    const today = Date.now();
    const created = tweet['created_at'];
    const diffInMS = today - created;
    const diffInDays = Math.floor(diffInMS / (1000 * 60 * 60 * 24));
    const getTimeSince = (days) => days === 1 ? `${days} day ago` : `${days} days ago`;
    const timeSince = getTimeSince(diffInDays);

    // escape function to prevent XSS
    const escape = (str) => {
      let div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    };

    let $tweet = $(`
      <article class="tweet">
        <header>
          <img src="${tweet.user.avatars}">
          <h2>${tweet.user.name}</h2>
          <p>${tweet.user.handle}</p>
        </header>
        <section>
          <p>${escape(tweet.content.text)}</p>
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
      $('#tweets-container').prepend($tweet);
    });
  };

});