function FileSaveButtonPress() {
   cmdline.Interpret('fsave');
}

function FileLoadButtonPress() {
   cmdline.Interpret('fload');
}

function PolkusiaButtonPress() {
   cmdline.Interpret('polkusia');
   inputlineJQ.focus();
}

function VarsiaButtonPress() {
   cmdline.Interpret('varsia');
   inputlineJQ.focus();
}

function CommandsButtonPress() {
   cmdline.Interpret('commands');
}

var kinjs = '<a target="_blank" href="http://kineticjs.com">KineticJS</a>';
var jq = '<a target="_blank" href="http://jquery.com">JQuery</a>';
function AboutButtonPress() {
   cmdline.Log('###########################################################<br>' + 
               '#                     JSWeave by ata                      #<br>' +
               '#            Created using '+kinjs+' and '+jq+'.          #<br>' +
               '# Feedback can be sent to ata100@iki.fi or ata @ QuakeNet #<br>' +
               '###########################################################', 'about');
}
