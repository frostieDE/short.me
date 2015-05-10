$ ->
  $('.button-shorten').on "click", ->
    $self = $(this)
    url = $('.input-url').val()

    if url.length > 0
      $self.prop "disabled", "disabled"
      $.ajax
        url: 'api/add'
        type: 'POST'
        dataType: 'json'
        contentType: 'application/json'
        data: JSON.stringify { url: url }
        error: (xhr, textStatus, error) ->
          $self.removeAttr "disabled"
          try
            response = $.parseJSON xhr.responseText

            $('.error').empty()
            $('<div>')
              .addClass "alert"
              .addClass "alert-danger"
              .html response.error
              .appendTo ".error"
          catch

        success: (data, textStatus, xhr) ->
          $self.removeAttr "disabled"
          $('.input-url').val('')
          $card = $('.urls .clonable').clone()
          $card.find('.target').html data.url
          $card.find('.short-link').html data.short
          $card.find('.short-link').attr "href", data.short
          $card.find('.count').html data.clicks
          $card.removeClass "clonable"

          $('.urls').prepend($card)

  $('.form-shorten').on "submit", ->
    $('.button-shorten').click()
    false;

  $('.input-url').on "keyup", ->
    $self = $(this);

    if $self.val().length > 0
      $('.button-shorten').removeAttr "disabled"
    else
      $('.button-shorten').prop "disabled", "disabled"