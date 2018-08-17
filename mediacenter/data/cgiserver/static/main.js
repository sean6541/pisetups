function reboot() {
  go = confirm('Are you sure? You will temporarily loose access to the server while it reboots.');
  if(go == true) {
    $.post('/power', {mode: 'reboot'});
    $('body').html(`<div class="bodydiv">
<h1>Rebooting...</h1>
<div>&nbsp;</div>
<h5>You can close this tab at any time.</h5>
</div>`);
  }
}

function shutdown() {
  go = confirm('Are you sure? You will loose access to the server.');
  if(go == true) {
    $.post('/power', {mode: 'shutdown'});
    $('body').html(`<div class="bodydiv">
<h1>Shutting Down...</h1>
<div>&nbsp;</div>
<h5>You can close this tab at any time.</h5>
</div>`);
  }
}
