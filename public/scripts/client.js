/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  // element definitions
  const $composerToggler = $('nav section');
  const $composer = $('.new-tweet');
  const $form = $('.new-tweet form');
  const $error = $('.error-message');
  const $textarea = $('#tweet-text');
  const $tweetsContainer = $('#tweets-container');

  // show/hide new tweet composer when clicking 'Write a new tweet'
  $composerToggler.on('click', function(e) {
    // hide if showing
    if ($composer.css('display') === 'block') {
      $composer.slideUp(100);
    // show if hidden
    } else {
      $composer.css('display', 'visible');
      $composer.slideDown(100);
      $textarea.focus();
      // auto scroll to composer
      $('body, html').animate({
        scrollTop: $('main').offset().top - 120
      }, 800);
    }
  });

  // post a new tweet asynchronously
  $form.on('submit', function(e) {
    // prevent reload
    e.preventDefault();
    
    const showError = (msg) => {
      $error.html(`<i class="fas fa-exclamation-triangle"></i>&nbsp;&nbsp;${msg}`);
      $error.css('display', 'visible');
      $error.slideDown(100);
    };
    
    // show error if tweet is empty or too long
    const msg = $textarea.val();
    if (msg.length === 0) {
      showError('Empty tweet alert! No empty tweets allowed.');
    } else if (msg.length > 140) {
      showError('Too many characters! Shorten your tweet please.');
     
    // no errors => send post request
    } else {
      $error.slideUp(100);
      $.ajax('/tweets', { method: 'POST', data: $(this).serialize() })
        .then((res) => {
          // empty tweet container
          $tweetsContainer.empty();
          // render all tweets including the new one
          loadTweets();
          // reset counter
          $('.counter').text(140);
          // hide composer
          $composer.slideUp(100);
          // clear form
          $textarea.val('');
          // autoscroll to new tweet
          $('body, html').animate({
            scrollTop: $('main').offset().top - 120
          }, 800);
        })
        .fail((err) => {
          console.log('Error:', err);
        });
    }
  });

  // gets all tweets and renders them
  const loadTweets = () => {
    $.ajax('/tweets', { method: 'GET' })
      .then((res) => {
        renderTweets(res);
      })
      .fail((err) => {
        console.log('Error:', err);
      });
  };
  // do this on page load
  loadTweets();

  // takes in a tweet object and returns HTML structure
  const createTweetElement = (tweet) => {
    
    // given create date, returns X days ago
    const getDaysSince = (created) => {
      const today = Date.now();
      const diffInMS = today - created;
      const diffInDays = Math.floor(diffInMS / (1000 * 60 * 60 * 24));
      return (diffInDays === 1) ? `${diffInDays} day ago` : `${diffInDays} days ago`;
    }

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
          <p>${getDaysSince(tweet['created_at'])}</p>
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

  // takes in all tweets (array) and renders all of them in tweet-container
  const renderTweets = (tweets) => {
    tweets.forEach((tweet) => {
      const $tweet = createTweetElement(tweet);
      $tweetsContainer.prepend($tweet);
    });
  };

});