var margin_pix = 2;
var centerwidth_pix = 1200;
var extrawidth_pix = 30;
var boxwidth_pix = 14;
var rightwidth_box = 4;
var bottomheight_box = 4;

var mainheight_box = 60;
var mainwidth_box = Math.floor((centerwidth_pix - extrawidth_pix - 2 * margin_pix) / boxwidth_pix - rightwidth_box);

//muuttujat elementeille
var cnsl = document.getElementById('logbox');
var inputlineJQ = $("#textinput");
var xcoorddiv = document.getElementById('xcoord');
var ycoorddiv = document.getElementById('ycoord');
var coverdiv = $('#cover');

var scrollscale = 0; //pystyscrollin skaalaus
var scrollscale2 = 0; //vaakascrollin skaalaus
var onlyAllowOnePerRow = true;

var mousedown = false;
var select = false;

//scrollbarit


var fileload_raw = '';
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

window.onload = function () {
   init();
}

var cmdline = new Cmdline(cnsl, inputlineJQ);
cmdline.Log('Initializing...', 'working');

var model = new Model('vasen_yla', 'oikea_yla', 'vasen_ala', 'oikea_ala',
   'pystyscroll', 'vaakascroll', boxwidth_pix,
   mainwidth_box, mainheight_box, rightwidth_box, bottomheight_box,
   margin_pix, extrawidth_pix);


cmdline.AddCommand('varsia', 'Muuttaa varsien määrän halutuksi', ['Anna varsien määrä 2-20'], [], function (Args) {
   if (Args.length != 1) {
      cmdline.Log('varsia: wrong number of arguments (' + Args.length + ')');
      return;
   }
   model.Hide(function () {
      if (model.ModelChangeRightWidth(Args[0])) {
         cmdline.Log('Varsien määräksi asetettu ' + Args[0]);
      }
      model.Show();
   });
});
cmdline.AddCommand('polkusia', 'Muuttaa polkusten määrän halutuksi', ['Anna polkusten määrä 2-20'], [], function (Args) {
   if (Args.length != 1) {
      cmdline.Log('polkusia: wrong number of arguments (' + Args.length + ')');
      return;
   }
   model.Hide(function () {
      if (model.ModelChangeBottomHeight(Args[0])) {
         cmdline.Log('Polkusten määräksi asetettu ' + Args[0]);
      }
      model.Show();
   });
});
cmdline.AddCommand('echo', 'Tulostaa annetun merkkijonon konsoliin', ['Anna kaiutettava merkkijono'], [], function (Args) {
   if (Args.length != 1) {
      cmdline.Log('test: wrong number of arguments (' + Args.length + ')');
      return;
   }
   cmdline.Log(Args[0]);
});
cmdline.AddCommand('commands', 'Näyttää saatavilla olevat komennot', [], [], function () {
   cmdline.Log(cmdline.cmdlist.join(', '), false);
});
cmdline.AddCommand('help', 'Näyttää tietoja komennoista', ['Anna komento, josta näytetään tietoja'], [cmdline.cmdlist], function (Args) {
   if (cmdline.cmds[Args[0]]) {
      cmdline.Log(Args[0] + ': ' + cmdline.cmds[Args[0]].help);
   } else {
      cmdline.Log('Tuntematon komento: ' + Args[0]);
   }
});
cmdline.AddCommand('fsave', 'Tallentaa piirrustuksen tiedostoon, josta se voidaan myöhemmin lukea', [], [], function () {
   var OYsave = [];
   for (var i = 0; i < model.RightWidth; ++i) {
      for (var j = 0; j < model.MainHeight; ++j) {
         if (model.RTarray[i][j].selected) {
            OYsave.push([i, j]);
         }
      }
   }
   var VAsave = [];
   for (var i = 0; i < model.MainWidth; ++i) {
      for (var j = 0; j < model.BottomHeight; ++j) {
         if (model.LBarray[i][j].selected) {
            VAsave.push([i, j]);
         }
      }
   }
   var OAsave = [];
   for (var i = 0; i < model.RightWidth; ++i) {
      for (var j = 0; j < model.BottomHeight; ++j) {
         if (model.RBarray[i][j].selected) {
            OAsave.push([i, j]);
         }
      }
   }

   var data = JSON.stringify({
      'MainWidth': model.MainWidth, 'MainHeight': model.MainHeight, 'SideWidth': model.RightWidth,
      'BottomHeight': model.BottomHeight, 'RT': OYsave, 'LB': VAsave, 'RB': OAsave
   });

   var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);
   var tempfield = document.createElement('a');
   tempfield.id = 'dllink';
   tempfield.href = url;
   tempfield.setAttribute('download', 'kude.json');
   tempfield.style.display = 'none';
   document.body.appendChild(tempfield);
   $('#dllink')[0].click();
   document.body.removeChild(tempfield);
   cmdline.Log('Tallennusdialogi avattu');
});
cmdline.AddCommand('fload', 'Lataa tiedostoon tallennetun piirustuksen', [], [], function () {
   var tempfield = document.createElement('input');
   tempfield.type = 'file';
   tempfield.id = 'uploadlink';
   tempfield.accept = '.json';
   tempfield.style.display = 'none';
   document.body.appendChild(tempfield);

   tempfield.onchange = function (e) {
      var parent = this;
      model.Hide();
      setTimeout(function () {
         var chosen_file = parent.files[0];

         var reader = new FileReader();
         reader.onload = (function (theFile) {
            return function (e) {;
               model.LoadPattern(e.target.result);
               model.Show();
            };
         })(chosen_file);

         reader.readAsText(chosen_file);
      }, 200);
   }
   $('#uploadlink')[0].click();
   document.body.removeChild(tempfield);
});
cmdline.AddCommand('clear', 'Tyhjentää piirustuksen', ['Haluatko varmasti tyhjentää piirustuksen?'], [['kyllä', 'ei', 'yes', 'no']], function(Args) {
   if (Args[0] != 'kyllä' && Args[0] != 'yes') {
      cmdline.Log('*Cancel*');
      return;
   }

   model.UnselectAll();
   model.UpdateAll();
   cmdline.Log('Piirustus tyhjennetty');
});