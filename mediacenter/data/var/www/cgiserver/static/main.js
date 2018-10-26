function reboot() {
  go = confirm('Are you sure? You will temporarily loose access to the server while it reboots.');
  if(go == true) {
    $.ajax({
      type: 'POST',
      url: '/power',
      contentType: 'application/json',
      data: JSON.stringify({mode: 'reboot'}),
      dataType: 'json'
    });
    $('body').html(`<div class="padded">
  <h1>Rebooting...</h1>
  <div>&nbsp;</div>
  <h5>You can close this tab at any time.</h5>
</div>`);
  }
}

function shutdown() {
  go = confirm('Are you sure? You will loose access to the server.');
  if(go == true) {
    $.ajax({
      type: 'POST',
      url: '/power',
      contentType: 'application/json',
      data: JSON.stringify({mode: 'shutdown'}),
      dataType: 'json'
    });
    $('body').html(`<div class="padded">
  <h1>Shutting Down...</h1>
  <div>&nbsp;</div>
  <h5>You can close this tab at any time.</h5>
</div>`);
  }
}
