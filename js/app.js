var manifest_url = "http://local.projects/mozigazilla/manifest.webapp";
$(document).ready(function(){

  var request = navigator.mozApps.getInstalled();
  request.onsuccess = function() {
    if (this.result[0]) {
      // we're installed
      Lungo.Router.section("main");
    } else {
      // not installed
      $('#about #install-button').removeClass('hidden');
      $("#install #msg-error").addClass('hidden');
      $('#about #install-button .button, #install .button.accept').click(function() {
          var installation = navigator.mozApps.install(manifest_url);
          installation.onsuccess = function() {
            Lungo.Router.section("main");
            $('#about #install-button').addClass('hidden');
            // Launch the App so the AppCache downloads it
            installation.result.launch();
          };
          installation.onerror = function() {
            $('#install #msg-error .text').text("Error: " + this.error.name);
            $("#install #msg-error").removeClass('hidden');
            Lungo.Router.article("install", "msg-error");
          };
        }
      );
      Lungo.Router.section("install");
    }
  };
  request.onerror = function() {
    $('#install #msg-error .text').text(
      'Error checking installation status: ' + this.error.name
    );
    Lungo.Router.article("install", "msg-error");
  };

  var gasino = new Gaso();
  $('[data-action=gaso]').click(function clickRosarigasino (e) {
    e.preventDefault();
    var text = $('#es-ar textarea').val();
    if (text) {
      $('#es-rg textarea').val(gasino.procesar(text));
    }
  });
});