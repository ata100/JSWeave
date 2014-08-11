function FileSaveButtonPress() {
   cmdline.Interpret(NatToLocCmd[Lang]['fsave'].cmd);
}

function FileLoadButtonPress() {
   cmdline.Interpret(NatToLocCmd[Lang]['fload'].cmd);
}

function PolkusiaButtonPress() {
   cmdline.Interpret(NatToLocCmd[Lang]['polkusia'].cmd);
   inputlineJQ.focus();
}

function VarsiaButtonPress() {
   cmdline.Interpret(NatToLocCmd[Lang]['varsia'].cmd);
   inputlineJQ.focus();
}

function CommandsButtonPress() {
   cmdline.Interpret(NatToLocCmd[Lang]['commands'].cmd);
}

function LSSaveButtonPress() {
   NotImplemented();
}

function LSLoadButtonPress() {
   NotImplemented();
}
function ColorButtonPress() {
   NotImplemented();
}
function IntroButtonPress() {
   NotImplemented();
}


var kinjs = '<a target="_blank" href="http://kineticjs.com">KineticJS</a>';
var jq = '<a target="_blank" href="http://jquery.com">JQuery</a>';
var tinyscrol = '<a target="_blank" href="http://baijs.nl/tinyscrollbar/">TinyScrollbar</a>';
function AboutButtonPress() {
   cmdline.Log('###########################################################<br>' +
               '#                     JSWeave by ata                      #<br>' +
               '#    Created using ' + kinjs + ', ' + jq + ' and ' + tinyscrol + '    #<br>' +
               '# Feedback can be sent to ata100@iki.fi or ata @ QuakeNet #<br>' +
               '###########################################################', 'about');
}


function NotImplemented() {
   cmdline.Log(NatToLoc[Lang]['notimpl'], 'error');
}