var manifest_url = "http://local.projects/mozigazilla/manifest.webapp";
$(document).ready(function(){

  $('.alert').bind('closed', function() {
    window.location.reload();
  });

  var request = navigator.mozApps.getSelf();
  request.onsuccess = function() {
    if (this.result) {
      // we're installed
      $('.install-message').hide();
      $('.text-holder').removeClass('hidden');
    } else {
      // not installed
      $('.install-message .install .btn').click(function() {
          var installation = navigator.mozApps.install(manifest_url);
          installation.onsuccess = function() {
            window.location.reload();
          };
          installation.onerror = function() {
            $('.alert .text').text("Error: " + this.error.name);
            $('.alert').show();
          };
      });

      $('.install-message .install').removeClass('hidden');
    }
  };
  request.onerror = function() {
    $('.alert .text').text(
      'Error checking installation status: ' + this.error.name
    );
  };

  var gasino = new Gaso();
  $('.text-holder textarea').change(function clickRosarigasino (e) {
    e.preventDefault();
    $('.text-holder div.well').html(
      gasino.procesar($('.text-holder textarea').val())
    );
  });
});