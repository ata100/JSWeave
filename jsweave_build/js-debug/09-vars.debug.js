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


cmdline.AddCommand('varsia', [], function (Args) {
   if (Args.length != 1) {
      cmdline.Log(NatToLoc[Lang]['badargcount'] + ' (' + Args.length + ')');
      return;
   }
   model.Hide(function () {
      if (model.ModelChangeBottomHeight(Args[0])) {
         model.UpdateAll();
         cmdline.Log(NatToLoc[Lang]['shaftcountset'] + Args[0]);
      }
      model.Show();
   });
});
cmdline.AddCommand('polkusia', [], function (Args) {
   if (Args.length != 1) {
      cmdline.Log(NatToLoc[Lang]['badargcount'] + ' (' + Args.length + ')');
      return;
   }
   model.Hide(function () {
      if (model.ModelChangeRightWidth(Args[0])) {
         model.UpdateAll();
         cmdline.Log(NatToLoc[Lang]['treadlecountset'] + Args[0]);
      }
      model.Show();
   });
});
cmdline.AddCommand('echo', [], function (Args) {
   if (Args.length != 1) {
      cmdline.Log(NatToLoc[Lang]['badargcount']+ ' (' + Args.length + ')');
      return;
   }
   cmdline.Log(Args[0]);
});
cmdline.AddCommand('commands', [], function () {
   cmdline.Log(LocCmds[Lang].join(', '));
});
cmdline.AddCommand('help', [cmdline.NatCmds], function (Args) {
   if (LocCmds[Lang].indexOf(Args[0]) != -1) {
      cmdline.Log(Args[0] + ': ' + GetLocalHelp(Lang, Args[0]));
   } else {
      cmdline.Log(NatToLoc[Lang]['unknowncmd'] + Args[0]);
   }
});
cmdline.AddCommand('fsave', [], function () {
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
   cmdline.Log(NatToLoc[Lang]['savedialogopened']);
});
cmdline.AddCommand('fload', [], function () {
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
cmdline.AddCommand('clear', [['yes', 'no']], function(Args) {
   if (!(LocToNatArgs(Lang, NatToLocCmd[Lang]['clear'].cmd, Args[0], 0) == 'yes')) {
      cmdline.Log(NatToLoc[Lang]['cancel']);
      return;
   }

   model.UnselectAll();
   model.UpdateAll();
   cmdline.Log(NatToLoc[Lang]['clear']);
});
cmdline.AddCommand('lang', [Langs], function (Args) {
   ChangeLanguage(Args[0]);
   cmdline.Log(NatToLoc[Lang]['changelang'] + Args[0]);
});