
if (navigator.userAgent.indexOf('Chrome') === -1) {
   alert("This javascript application works best in Chrome (i.e. it probably won't work with other browsers).");
}

function clearErrors() {
   var errors = document.getElementsByClassName('error');
   for (var i = 0; i < errors.length; ++i) {
      errors[i].parentNode.removeChild(errors[i]);
   }
}

function isInteger(testattava_str) {
   var testattava_int = parseInt(testattava_str);
   if (testattava_int.toString() !== testattava_str || isNaN(testattava_int)) {
      return false;
   }
   return true;
}



function loadReady() {
   document.getElementById('loading').style.display = 'none';
}



//muutaKaikkienOsumaboksia(1);
console.log('lol');

function tallennusString() {
   var OYtallennus = new Array(oikean_reunan_leveys);
   for (var i = 0; i < oikean_reunan_leveys; ++i) {
      OYtallennus[i] = new Array(pystykoko);
   }

   var VAtallennus = new Array(vaakakoko);
   for (var i = 0; i < vaakakoko; ++i) {
      VAtallennus[i] = new Array(alareunan_korkeus);
   }

   var OAtallennus = new Array(oikean_reunan_leveys);
   for (var i = 0; i < oikean_reunan_leveys; ++i) {
      OAtallennus[i] = new Array(alareunan_korkeus);
   }

   for (var i = 0; i < oikean_reunan_leveys; ++i) {
      for (var j = 0; j < pystykoko; ++j) {
         OYtallennus[i][j] = OYarray[i][j].selected;
      }
   }
   for (var i = 0; i < vaakakoko; ++i) {
      for (var j = 0; j < alareunan_korkeus; ++j) {
         VAtallennus[i][j] = VAarray[i][j].selected;
      }
   }
   for (var i = 0; i < oikean_reunan_leveys; ++i) {
      for (var j = 0; j < alareunan_korkeus; ++j) {
         OAtallennus[i][j] = OAarray[i][j].selected;
      }
   }

   var tallennus = {
      vaakakoko: vaakakoko,
      pystykoko: pystykoko,
      oikean_reunan_leveys: oikean_reunan_leveys,
      alareunan_korkeus: alareunan_korkeus,
      OYtallennus: OYtallennus,
      VAtallennus: VAtallennus,
      OAtallennus: OAtallennus
   };
   return JSON.stringify(tallennus);
}

function zoom(uusi_ruudun_sivu) {
   if (uusi_ruudun_sivu === -1) {
      ruudun_sivu_raw = document.getElementById('ruutubox').value;
      uusi_ruudun_sivu = parseInt(ruudun_sivu_raw);

      if (!isInteger(ruudun_sivu_raw) || uusi_ruudun_sivu < 12 || uusi_ruudun_sivu > 100) {
         var tekstikentta = document.getElementById('ruutubox');
         tekstikentta.value = ruudun_sivu;
         var nappitd = document.getElementById('zoomok');
         var errordiv = document.createElement('div');
         errordiv.className = 'error';
         errordiv.id = 'leveyserror';
         errordiv.innerHTML = 'Ruudun sivuksi annettu arvo oli virheellinen (oltava kokonaisluku väliltä 12...100)';
         nappitd.appendChild(errordiv);
         errordiv.style.top = '40px';
         errordiv.style.left = '0px';
         errordiv.onclick = function () { errordiv.parentNode.removeChild(errordiv); };
         return;
      }
   }

   ruudun_sivu = uusi_ruudun_sivu;

   OAdiv.style.width = ruudun_sivu * oikean_reunan_leveys + "px";
   OAdiv.style.height = ruudun_sivu * alareunan_korkeus + "px";

   OYdiv.style.width = (ruudun_sivu * oikean_reunan_leveys + 15) + "px";
   OYdiv.style.bottom = (30 + ruudun_sivu * alareunan_korkeus) + "px";

   VYdiv.style.right = (30 + ruudun_sivu * oikean_reunan_leveys) + "px";
   VYdiv.style.bottom = (30 + ruudun_sivu * alareunan_korkeus) + "px";

   VAdiv.style.right = (30 + ruudun_sivu * oikean_reunan_leveys) + "px";
   VAdiv.style.height = (ruudun_sivu * alareunan_korkeus + 15) + "px";

   VYstage.setWidth(ruudun_sivu * vaakakoko);
   VYstage.setHeight(ruudun_sivu * pystykoko);

   OYstage.setWidth(ruudun_sivu * oikean_reunan_leveys);
   OYstage.setHeight(ruudun_sivu * pystykoko);

   VAstage.setWidth(ruudun_sivu * vaakakoko);
   VAstage.setHeight(ruudun_sivu * alareunan_korkeus);

   OAstage.setWidth(ruudun_sivu * oikean_reunan_leveys);
   OAstage.setHeight(ruudun_sivu * alareunan_korkeus);

   for (var i = 0; i < vaakakoko; ++i) {
      for (var j = 0; j < pystykoko; ++j) {
         VYarray[i][j].setWidth(ruudun_sivu);
         VYarray[i][j].setHeight(ruudun_sivu);
         VYarray[i][j].x(ruudun_sivu * i);
         VYarray[i][j].y(ruudun_sivu * j);
      }
   }
   for (var i = 0; i < oikean_reunan_leveys; ++i) {
      for (var j = 0; j < pystykoko; ++j) {
         OYarray[i][j].setWidth(ruudun_sivu);
         OYarray[i][j].setHeight(ruudun_sivu);
         OYarray[i][j].x(ruudun_sivu * i);
         OYarray[i][j].y(ruudun_sivu * j);
      }
   }
   for (var i = 0; i < vaakakoko; ++i) {
      for (var j = 0; j < alareunan_korkeus; ++j) {
         VAarray[i][j].setWidth(ruudun_sivu);
         VAarray[i][j].setHeight(ruudun_sivu);
         VAarray[i][j].x(ruudun_sivu * i);
         VAarray[i][j].y(ruudun_sivu * j);
      }
   }
   for (var i = 0; i < oikean_reunan_leveys; ++i) {
      for (var j = 0; j < alareunan_korkeus; ++j) {
         OAarray[i][j].setWidth(ruudun_sivu);
         OAarray[i][j].setHeight(ruudun_sivu);
         OAarray[i][j].x(ruudun_sivu * i);
         OAarray[i][j].y(ruudun_sivu * j);
      }
   }

   VYlayer.draw();
   OYlayer.draw();
   VAlayer.draw();
   OAlayer.draw();
   OYdiv.scrollTop = OYdiv.scrollHeight;
   OYdiv.scrollLeft = 0;
   VAdiv.scrollLeft = VAdiv.scrollWidth;
   VAdiv.scrollTop = 0;

}

function muutaAlareunanKorkeutta() {
   var uusikorkeus_raw = document.getElementById('alareunan_korkeus').value;
   var uusikorkeus = parseInt(uusikorkeus_raw);

   if (!isInteger(uusikorkeus_raw) || uusikorkeus < 2 || uusikorkeus > 20) {
      var tekstikentta = document.getElementById('alareunan_korkeus');
      tekstikentta.value = alareunan_korkeus;
      var nappitd = document.getElementById('alareunaok');
      var errordiv = document.createElement('div');
      errordiv.className = 'error';
      errordiv.id = 'korkeuserror';
      errordiv.innerHTML = 'Reunan korkeudeksi annettu arvo oli virheellinen (oltava kokonaisluku väliltä 2...20)';
      nappitd.appendChild(errordiv);
      errordiv.style.top = '40px';
      errordiv.style.left = '0px';
      errordiv.onclick = function () { errordiv.parentNode.removeChild(errordiv); };
      return;
   }

   if (uusikorkeus === alareunan_korkeus) {
      return;
   }

   if (uusikorkeus < alareunan_korkeus) {
      for (var i = 0; i < vaakakoko; ++i) {
         for (var j = uusikorkeus; j < alareunan_korkeus; ++j) {
            VAarray[i][j].destroy();
         }
      }
      for (var i = 0; i < vaakakoko; ++i) {
         VAarray[i].splice(uusikorkeus, alareunan_korkeus - uusikorkeus);
      }

      for (var i = 0; i < oikean_reunan_leveys; ++i) {
         for (var j = uusikorkeus; j < alareunan_korkeus; ++j) {
            OAarray[i][j].destroy();
         }
      }
      for (var i = 0; i < oikean_reunan_leveys; ++i) {
         OAarray[i].splice(uusikorkeus, alareunan_korkeus - uusikorkeus);
      }

   } else {
      for (var i = 0; i < vaakakoko; ++i) {
         for (var j = alareunan_korkeus; j < uusikorkeus; ++j) {
            VAarray[i].push({});
         }
      }
      for (var i = 0; i < vaakakoko; ++i) {
         for (var j = alareunan_korkeus; j < uusikorkeus; ++j) {
            LuoRuutu(i, j, VAlayer, VAarray, true);
         }
      }

      for (var i = 0; i < oikean_reunan_leveys; ++i) {
         for (var j = alareunan_korkeus; j < uusikorkeus; ++j) {
            OAarray[i].push({});
         }
      }
      for (var i = 0; i < oikean_reunan_leveys; ++i) {
         for (var j = alareunan_korkeus; j < uusikorkeus; ++j) {
            LuoRuutu(i, j, OAlayer, OAarray, true);
         }
      }

   }
   alareunan_korkeus = uusikorkeus;
   zoom(ruudun_sivu);
}

function tyhjenna() {
   var vahvistus = confirm("Do you really want to clear the sheet?");
   if (vahvistus) {
      OYarray.forEach(function (rivi) {
         rivi.forEach(function (ruutu) {
            ruutu.unselect();
         });
      });
      VAarray.forEach(function (rivi) {
         rivi.forEach(function (ruutu) {
            ruutu.unselect();
         });
      });
      OAarray.forEach(function (rivi) {
         rivi.forEach(function (ruutu) {
            ruutu.unselect();
         });
      });
      VYarray.forEach(function (rivi) {
         rivi.forEach(function (ruutu) {
            Update2(ruutu);
         });
      });
   }
}

function tallenna() {
   VYstage.toDataURL({
      callback: function (VYdataUrl) {
         OYstage.toDataURL({
            callback: function (OYdataUrl) {
               VAstage.toDataURL({
                  callback: function (VAdataUrl) {
                     OAstage.toDataURL({
                        callback: function (OAdataUrl) {
                           var canvas = document.createElement('canvas');
                           canvas.width = ruudun_sivu * (vaakakoko + oikean_reunan_leveys) + 10;
                           canvas.height = ruudun_sivu * (pystykoko + alareunan_korkeus) + 10;
                           var ctx = canvas.getContext('2d');
                           var imageObj1 = new Image();
                           var imageObj2 = new Image();
                           var imageObj3 = new Image();
                           var imageObj4 = new Image();
                           imageObj1.src = VYdataUrl;
                           imageObj2.src = OYdataUrl;
                           imageObj3.src = VAdataUrl;
                           imageObj4.src = OAdataUrl;
                           imageObj1.onload = function () {
                              ctx.drawImage(imageObj1, 0, 0, ruudun_sivu * vaakakoko, ruudun_sivu * pystykoko);
                              imageObj2.onload = function () {
                                 ctx.drawImage(imageObj2, ruudun_sivu * vaakakoko + 10, 0, ruudun_sivu * oikean_reunan_leveys, ruudun_sivu * pystykoko);
                                 imageObj3.onload = function () {
                                    ctx.drawImage(imageObj3, 0, ruudun_sivu * pystykoko + 10, ruudun_sivu * vaakakoko, ruudun_sivu * alareunan_korkeus);
                                    imageObj4.onload = function () {
                                       ctx.drawImage(imageObj4, ruudun_sivu * vaakakoko + 10, ruudun_sivu * pystykoko + 10, ruudun_sivu * oikean_reunan_leveys, ruudun_sivu * alareunan_korkeus);
                                       var img = canvas.toDataURL("image/png");
                                       window.open(img);
                                    }
                                 }
                              }
                           }
                        }
                     });
                  }
               });
            }
         });
      }
   });
}

function toggleMenu() {
   if (menu_hidden) {
      document.getElementById('ylareuna').style.top = '0px';
      menu_hidden = false;
   } else {
      document.getElementById('ylareuna').style.top = '-135px';
      menu_hidden = true;
   }
}