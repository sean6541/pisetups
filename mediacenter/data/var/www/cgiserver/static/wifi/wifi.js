window.onload = function() {
  $('#connect_dialog').on('hidden.bs.modal', function(event) {
    modal = $(this);
    modal.find('.grayout').css('opacity', 1.0);
    modal.find('.disableable').removeAttr('disabled');
    modal.find('#title').text('');
    modal.find('#ssidc').hide();
    modal.find('#ssid').val('');
    modal.find('#nopsk').hide();
    modal.find('#haspskc').hide();
    modal.find('#haspsk').prop('checked', false);
    modal.find('#pskc').hide();
    modal.find('#psk').val('');
  });
  $('#connect_dialog').on('show.bs.modal', function(event) {
    modal = $(this);
    button = $(event.relatedTarget);
    if(button.data('man') == false) {
      ssid = button.data('ssid');
      enc = button.data('enc');
      if(enc) {
        modal.find('#pskc').show();
      } else {
        modal.find('#nopsk').show();
      }
      modal.find('#title').text(ssid);
      modal.find('#connect').on('click', function() {
        start_conn();
        if(enc) {
          psk = modal.find('#psk').val();
          $.ajax({
            type: 'POST',
            url: '/wifi/connect',
            contentType: 'application/json',
            data: JSON.stringify({ssid: ssid, psk: psk}),
            success: end_conn,
            dataType: 'json'
          });
        } else {
          $.ajax({
            type: 'POST',
            url: '/wifi/connect',
            contentType: 'application/json',
            data: JSON.stringify({ssid: ssid}),
            success: end_conn,
            dataType: 'json'
          });
        }
      });
    } else if(button.data('man') == true) {
      enc = true;
      modal.find('#ssidc').show();
      modal.find('#pskc').show();
      modal.find('#haspskc').show();
      modal.find('#haspsk').on('change', function() {
        if($(this).is(':checked')) {
          enc = false;
          modal.find('#pskc').hide();
        } else {
          enc = true;
          modal.find('#pskc').show();
        }
      });
      modal.find('#title').text('Hidden');
      modal.find('#connect').on('click', function() {
        start_conn();
        ssid = modal.find('#ssid').val();
        if(enc) {
          psk = modal.find('#psk').val();
          $.ajax({
            type: 'POST',
            url: '/wifi/connect',
            contentType: 'application/json',
            data: JSON.stringify({ssid: ssid, psk: psk}),
            success: end_conn,
            dataType: 'json'
          });
        } else {
          $.ajax({
            type: 'POST',
            url: '/wifi/connect',
            contentType: 'application/json',
            data: JSON.stringify({ssid: ssid}),
            success: end_conn,
            dataType: 'json'
          });
        }
      });
    }
    function start_conn() {
      modal.find('.disableable').prop('disabled', 'disabled');
      modal.find('.grayout').css('opacity', 0.6);
      modal.find('#connect').text('Connecting...');
    }
    function end_conn(data) {
      modal.modal('hide');
    }
  });
  scan();
};

function scan() {
  $('#scanbtn').text('Scanning...');
  $('#scanbtn').prop('disabled', 'disabled');
  $('#cth').prop('disabled', 'disabled');
  $.get('/wifi/scan', function(data) {
    $('#ssids').html('');
    html = '';
    $.each(data, function (i, network) {
      html += '<button type="button" class="list-group-item list-group-item-action" data-man="false" data-toggle="modal" data-target="#connect_dialog" data-ssid="' + network.ssid + '" data-enc="' + network.enc + '">' + network.ssid + '</button>\n';
    });
    $('#ssids').html(html);
    $('#scanbtn').text('Scan');
    $('#scanbtn').removeAttr('disabled');
    $('#cth').removeAttr('disabled');
  }, 'json');
}
