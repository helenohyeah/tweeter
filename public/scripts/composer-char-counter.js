/*
 * Character counter for new tweet composer
 * Changes the character count based on the tweet's contents
 *
 */

$(document).ready(function() {
  
  $('textarea#tweet-text').on('keyup', function(e) {
    const maxChar = 140;
    const currChar = $(this).val().length;
    const charCount = maxChar - currChar;
    
    // select the character counter
    const counter = $(this).next().children('.counter');

    // change counter color
    if (charCount > 0) {
      counter.removeClass('invalid');
    }
    if (charCount < 0) {
      counter.addClass('invalid');
    }

    // updates counter value
    counter.text(charCount);
  });
});