window.onload = function() {
  $('#connectDialog').on('hidden.bs.modal', function(event) {
    modal = $(this);
    modal.find('.grayout').css('opacity', 1.0);
    modal.find('.disableable').removeAttr('disabled');
    modal.find('#title').text('');
    modal.find('#ssidc').hide();
    modal.find('#ssid').val('');
    modal.find('#nopsk').hide();
    modal.find('#pskcheck').hide();
    modal.find('#haspsk').prop('checked', false);
    modal.find('#pskc').hide();
    modal.find('#psk').val('');
  });
  $('#connectDialog').on('show.bs.modal', function(event) {
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
        startconn();
        if(enc) {
          psk = modal.find('#psk').val();
          $.post('/config/wifi/connect', {ssid: ssid, psk: psk}, endconn);
        } else {
          $.post('/config/wifi/connect', {ssid: ssid}, endconn);
        }
      });
    } else if(button.data('man') == true) {
      enc = true;
      modal.find('#ssidc').show();
      modal.find('#pskc').show();
      modal.find('#pskcheck').show();
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
        startconn();
        ssid = modal.find('#ssid').val();
        if(enc) {
          psk = modal.find('#psk').val();
          $.post('/config/wifi/connect', {ssid: ssid, psk: psk}, endconn);
        } else {
          $.post('/config/wifi/connect', {ssid: ssid}, endconn);
        }
      });
    }
    function startconn() {
      modal.find('.disableable').prop('disabled', 'disabled');
      modal.find('.grayout').css('opacity', 0.6);
      modal.find('#connect').text('Connecting...');
    }
    function endconn() {
      modal.modal('hide');
    }
  });
  scan();
};

function scan() {
  $('#scanbtn').text('Scanning...');
  $('#scanbtn').prop('disabled', 'disabled');
  $('#cth').prop('disabled', 'disabled');
  $.get('/config/wifi/scan', function(data) {
    networks = JSON.parse(data);
    $('#ssids').html('');
    $.each(networks, function (i, network) {
      elem = $(document.createElement('button'));
      elem.attr('type', 'button');
      elem.addClass('list-group-item');
      elem.addClass('list-group-item-action');
      elem.attr('data-man', false);
      elem.attr('data-toggle', 'modal');
      elem.attr('data-target', '#connectDialog');
      elem.attr('data-ssid', network.ssid);
      elem.attr('data-enc', network.enc);
      elem.text(network.ssid);
      $('#ssids').append(elem);
      $('#scanbtn').text('Scan');
      $('#scanbtn').removeAttr('disabled');
      $('#cth').removeAttr('disabled');
    });
  });
}
