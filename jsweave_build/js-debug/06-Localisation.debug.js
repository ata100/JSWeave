var LocToNatCmd = {};
var NatToLocCmd = {};
var LocCmds = {};
var Langs = [];

var NatToLoc = {};
NatToLoc['eng'] = {
   /*MENU*/
   'filelabel_': 'File', 'savelabel_': 'Save', 'tofilelabel_': 'To file', 'tolslabel_': 'To local storage', 'loadlabel_': 'Load', 'fromfilelabel_': 'From file',
   'fromlslabel_': 'From local storage', 'settinglabel_': 'Settings', 'treadlelabel_': 'Treadles', 'shaftlabel_': 'Shafts', 'colorlabel_': 'Colors',
   'helplabel_': 'Help', 'introlabel_': 'Introduction', 'cmdlistlabel_': 'Command list', 'aboutlabel_': 'About',

   /*CMDS and stuff*/
   'badargcount': 'Wrong number of arguments', 'shaftcountset': 'Number of shafts is set to ', 'treadlecountset': 'Number of treadles is set to ',
   'unknowncmd': 'Unknown command: ', 'savedialogopened': 'Save dialog opened', 'cancel': '*Cancel*', 'clear': 'Design cleared', 'changelang': 'Language changed: ',

   'welcome': 'Welcome to JSWeave!', 'creatinglayer': 'Creating layers and stages...', 'creatingboxes': 'Creating boxes...',
   'badtreadlecount': 'Bad argument for treadle count: ', 'badshaftcount': 'Bad argument for shaft count: ', 'patternloaded': 'Pattern loaded',

   'notimpl': 'Not implemented yet'

};
NatToLoc['fin'] = {
   /*MENU*/
   'filelabel_': 'Tiedosto', 'savelabel_': 'Tallenna', 'tofilelabel_': 'Tiedostoon', 'tolslabel_': 'Local storageen', 'loadlabel_': 'Lataa', 'fromfilelabel_': 'Tiedostosta',
   'fromlslabel_': 'Local storagesta', 'settinglabel_': 'Asetukset', 'treadlelabel_': 'Polkuset', 'shaftlabel_': 'Varret', 'colorlabel_': 'Värit',
   'helplabel_': 'Ohje', 'introlabel_': 'Pikaopas', 'cmdlistlabel_': 'Komentolista', 'aboutlabel_': 'Tietoja',

   /*CMDS and stuff*/
   'badargcount': 'Väärä määrä parametreja', 'shaftcountset': 'Varsien määräksi asetettu ', 'treadlecountset': 'Polkusten määräksi asetettu ',
   'unknowncmd': 'Tuntematon komento: ', 'savedialogopened': 'Tallennusvalikko avattu', 'cancel': '*Peruuta*', 'clear': 'Kuvio tyhjennetty', 'changelang': 'Kieli vaihdettu: ',

   'welcome': 'Tervetuloa JSWeaveen!', 'creatinglayer': 'Luodaan kankaita ja kerroksia...', 'creatingboxes': 'Luodaan ruutuja...',
   'badtreadlecount': 'Huono polkusmäärä: ', 'badshaftcount': 'Huono varsimäärä: ', 'patternloaded': 'Kuvio ladattu',

   'notimpl': 'Ei toteutettu vielä'
};


function LocToNatArgs(lang, loccmd, locarg, argnum) {
   var l2nc = LocToNatCmd[lang][loccmd];
   var n2l = NatToLocCmd[lang][l2nc];
   var index = n2l.argoptions[argnum].indexOf(locarg);
   if (index != -1) {
      return cmdline.cmds[LocToNatCmd[lang][loccmd]].argoptions[argnum][index];
   } else {
      return locarg;
   }
}
function NatToLocArgs(lang, natcmd, natarg, argnum) {
   var index = cmdline.cmds[natcmd].argoptions[argnum].indexOf(natarg);
   if (index != -1) {
      return NatToLocCmd[lang][natcmd].argoptions[argnum][index];
   } else {
      return natarg;
   }
}
function GetLocalCommands(lang) {
   return LocCmds[lang];
}
function GetLocalHelp(lang, loccmd) {
   return NatToLocCmd[lang][LocToNatCmd[lang][loccmd]].help;
}
function GetLocalArgQuery(lang, loccmd) {
   return NatToLocCmd[lang][LocToNatCmd[lang][loccmd]].argquery;
}
function GetLocalArgOptions(lang, loccmd) {
   return NatToLocCmd[lang][LocToNatCmd[lang][loccmd]].argoptions;
}
function ChangeLanguage(new_lang) {
   if (Langs.indexOf(new_lang) == -1) {
      throw "No such language: " + new_lang;
   }

   Lang = new_lang;
   document.cookie = 'lang=' + Lang;
   cmdline.GoToBeginState();
   RefreshLabels();
}
function SetHTMLText(label) {
   var elem = document.getElementById(label);
   var text_to_add = NatToLoc[Lang][label];

   if (!elem || !text_to_add) {
      throw "Jotain meni pieleen: " + label;
   }

   elem.innerHTML += text_to_add;
}


function BindCommand(lang, natcmd, loccmd, helptext, argquery, argoptions) {
   if (arguments.length != 6) {
      throw 'Too few arguments to bind a command!';
   }

   if (Langs.indexOf(lang) == -1) {
      Langs.push(lang);
      Langs.sort();
   }

   if (!LocCmds[lang]) {
      LocCmds[lang] = [];
   }

   if (LocCmds[lang].indexOf(loccmd) != -1) {
      throw 'Command already bound: ' + loccmd;
   }

   if (!LocToNatCmd[lang]) {
      LocToNatCmd[lang] = {};
   }

   LocToNatCmd[lang][loccmd] = natcmd;
   LocCmds[lang].push(loccmd);
   LocCmds[lang].sort();

   if (!NatToLocCmd[lang]) {
      NatToLocCmd[lang] = {};
   }

   NatToLocCmd[lang][natcmd] = {};
   NatToLocCmd[lang][natcmd].cmd = loccmd;
   NatToLocCmd[lang][natcmd].help = helptext;
   NatToLocCmd[lang][natcmd].argquery = argquery;
   NatToLocCmd[lang][natcmd].argoptions = argoptions;
}

BindCommand('eng', 'varsia', 'shafts', 'Change the number of shafts', ['Give the number of shafts 2-20'], []);
BindCommand('eng', 'polkusia', 'treadles', 'Change the number of treadles', ['Give the number of treadles 2-20'], []);
BindCommand('eng', 'echo', 'echo', 'Echoes the given string', ['Give the string to echo'], []);
BindCommand('eng', 'commands', 'commands', 'Lists all available commands', [], []);
BindCommand('eng', 'help', 'help', 'Shows info about chosen command', ['Choose command for which to show info'], [LocCmds['eng']]);
BindCommand('eng', 'fsave', 'fsave', 'Saves the current design to a file', [], []);
BindCommand('eng', 'fload', 'fload', 'Loads a design from a file', [], []);
BindCommand('eng', 'clear', 'clear', 'Clears the design', ['Are you sure you want to clear the design?'], [['yes', 'no']]);
BindCommand('eng', 'lang', 'language', 'Changes the language', ['Choose language'], [Langs]);

BindCommand('fin', 'varsia', 'varsia', 'Muuttaa varsien määrän halutuksi', ['Anna varsien määrä 2-20'], []);
BindCommand('fin', 'polkusia', 'polkusia', 'Muuttaa polkusten määrän halutuksi', ['Anna polkusten määrä 2-20'], []);
BindCommand('fin', 'echo', 'tulosta', 'Tulostaa annetun merkkijonon konsoliin', ['Anna kaiutettava merkkijono'], []);
BindCommand('fin', 'commands', 'komennot', 'Näyttää käytettävissä olevat komennot', [], []);
BindCommand('fin', 'help', 'ohje', 'Näyttää tietoja komennoista', ['Anna komento, josta näytetään tietoja'], [LocCmds['fin']]);
BindCommand('fin', 'fsave', 'tallennatiedosto', 'Tallentaa piirrustuksen tiedostoon, josta se voidaan myöhemmin lukea', [], []);
BindCommand('fin', 'fload', 'luetiedosto', 'Lataa tiedostoon tallennetun piirustuksen', [], []);
BindCommand('fin', 'clear', 'tyhjennä', 'Tyhjentää piirustuksen', ['Haluatko varmasti tyhjentää piirustuksen?'], [['kyllä', 'ei']]);
BindCommand('fin', 'lang', 'kieli', 'Vaihtaa ohjelman kielen', ['Valitse kieli'], [Langs]);

var Lang = 'eng';

var cookieLang = getCookie('lang')
if (cookieLang != '' && Langs.indexOf(cookieLang) != -1) {
   Lang = cookieLang;
} else {
   if (window.navigator.language.substr(0, 2) == 'fi') {
      Lang = 'fin';
   }
   document.cookie = 'lang=' + Lang;
}

function GetLabels() {
   var labels = [];
   var translations = Object.getOwnPropertyNames(NatToLoc['eng']);
   for (var i = 0; i < translations.length; ++i) {
      if (translations[i].indexOf('label_') != -1) {
         labels.push(translations[i]);
      }
   }

   return labels;
}

function SetLabels() {
   var labels = GetLabels();
   for (var i = 0; i < labels.length; ++i) {
      SetHTMLText(labels[i]);
   }
}
SetLabels();

function RefreshLabels() {
   var labels = GetLabels();
   for (var i = 0; i < labels.length; ++i) {
      var elem = document.getElementById(labels[i]);
      var new_text = NatToLoc[Lang][labels[i]];

      if (!elem || !new_text) {
         throw "Jotain meni pieleen: " + labels[i];
      }

      elem.innerHTML = new_text;
   }
}

console.log(document.getElementById('filelabel_').firstChild);