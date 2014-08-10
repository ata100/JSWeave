function Model(ltname, rtname, lbname, rbname, vscrollname, hscrollname,
   boxwidth, mainwidth, mainheight, rightwidth, bottomheight, margin,
   extrawidth) {
   var parent = this;
   //divs LeftTop RightTop LeftBottom RightBottom
   this.LTname = ltname;
   this.RTname = rtname;
   this.LBname = lbname;
   this.RBname = rbname;
   this.LTdiv = document.getElementById(ltname);
   this.RTdiv = document.getElementById(rtname);
   this.LBdiv = document.getElementById(lbname);
   this.RBdiv = document.getElementById(rbname);

   //vertical and horizontal scrolls and their parents
   this.VSCRLP = document.getElementById(vscrollname);
   this.VSCRL = this.VSCRLP.getElementsByClassName('overview')[0];
   this.HSCRLP = document.getElementById(hscrollname);
   this.HSCRL = this.HSCRLP.getElementsByClassName('overview')[0];

   //measurements
   this.BoxWidth = boxwidth;
   this.MainHeight = mainheight;
   this.MainWidth = mainwidth;
   this.RightWidth = rightwidth;
   this.BottomHeight = bottomheight;

   this.Margin = margin;
   this.ExtraWidth = extrawidth;

   //box object arrays
   this.LTarray = new Array(this.MainWidth);
   this.RTarray = new Array(this.RightWidth);
   this.RBarray = new Array(this.RightWidth);
   this.LBarray = new Array(this.MainWidth);

   //colors
   this.selectedcolor = '#000000';
   this.unselectedcolor = '#BBBBBB';

   //hitboxes
   this.hitbox_padding = 2;
   this.hitbox_content = this.BoxWidth - 2 * this.hitbox_padding;

   //scrollbars
   this.$scrollbar = document.getElementById(vscrollname)
             , this.scrollbar = tinyscrollbar(this.$scrollbar)
   ;
   this.$scrollbar2 = document.getElementById(hscrollname)
                , this.scrollbar2 = tinyscrollbar(this.$scrollbar2, { axis: 'x' })
   ;
   this.scrollscale = 0;
   this.scrollscale2 = 0;

   this.$scrollbar.addEventListener("move", function () {
      var targetpos = parent.scrollbar.contentPosition * (parent.LTdiv.scrollHeight - parent.LTdiv.clientHeight) / parent.scrollscale;
      if (targetpos > parent.LTdiv.scrollHeight - parent.LTdiv.clientHeight - 1) {
         targetpos = parent.LTdiv.scrollHeight - parent.LTdiv.clientHeight - 1;
      }
      parent.LTdiv.scrollTop = targetpos;
      parent.RTdiv.scrollTop = targetpos;
   }, false);

   this.$scrollbar2.addEventListener("move", function () {
      var targetpos = parent.scrollbar2.contentPosition * (parent.LTdiv.scrollWidth - parent.LTdiv.clientWidth) / parent.scrollscale2;
      parent.LTdiv.scrollLeft = targetpos;
      parent.LBdiv.scrollLeft = targetpos;
   }, false);

   //--------------------------------------------------------------------------
   //Stages and layers
   this.CreateStagesLayers = function () {
      this.LTlayername = 'ltlayer';
      this.RTlayername = 'rtlayer';
      this.LBlayername = 'lblayer';
      this.RBlayername = 'rblayer';

      cmdline.Log('Creating stages and layers...', 'working');

      this.LTstage = new Kinetic.Stage({
         container: this.LTname,
         width: this.BoxWidth * this.MainWidth,
         height: this.BoxWidth * this.MainHeight
      });
      this.LTlayer = new Kinetic.Layer({
         name: this.LTlayername
      });
      this.LTstage.add(this.LTlayer);

      this.RTstage = new Kinetic.Stage({
         container: this.RTname,
         width: this.BoxWidth * this.RightWidth,
         height: this.BoxWidth * this.MainHeight
      });
      this.RTlayer = new Kinetic.Layer({
         name: this.RTlayername
      });
      this.RTstage.add(this.RTlayer);

      this.LBstage = new Kinetic.Stage({
         container: this.LBname,
         width: this.BoxWidth * this.MainWidth,
         height: this.BoxWidth * this.BottomHeight
      });
      this.LBlayer = new Kinetic.Layer({
         name: this.LBlayername
      });
      this.LBstage.add(this.LBlayer);

      this.RBstage = new Kinetic.Stage({
         container: this.RBname,
         width: this.BoxWidth * this.RightWidth,
         height: this.BoxWidth * this.BottomHeight
      });
      this.RBlayer = new Kinetic.Layer({
         name: this.RBlayername
      });
      this.RBstage.add(this.RBlayer);
   }

   //--------------------------------------------------------------------------
   //kinetic-js containers

   this.InitAreas = function () {
      this.LTC = this.LTdiv.getElementsByClassName('kineticjs-content')[0];
      this.LTdiv.getElementsByClassName('kineticjs-content')[0].style.position = 'relative';
      this.RTC = this.RTdiv.getElementsByClassName('kineticjs-content')[0];
      this.RTdiv.getElementsByClassName('kineticjs-content')[0].style.position = 'relative';
      this.LBC = this.LBdiv.getElementsByClassName('kineticjs-content')[0];
      this.LBdiv.getElementsByClassName('kineticjs-content')[0].style.position = 'relative';
      this.RBC = this.RBdiv.getElementsByClassName('kineticjs-content')[0];
      this.RBdiv.getElementsByClassName('kineticjs-content')[0].style.position = 'relative';
   }

   this.Init = function () {
      this.CreateStagesLayers();
      this.InitAreas();
   }

   this.Init();

   //--------------------------------------------------------------------------
   //modify css

   this.LayoutChangeRightWidth = function(pix) {
      this.LTdiv.style.right = pix + margin + 'px';
      this.RTdiv.style.width = pix - margin + 'px';
      this.LBdiv.style.right = pix + margin + 'px';
      this.RBdiv.style.width = pix - margin + 'px';
      this.HSCRLP.style.right = pix + margin + 'px';
      if (this.LTdiv.clientWidth > this.LTC.clientWidth) {
         this.LTC.style.left = this.LTdiv.clientWidth - this.LTC.clientWidth + 'px';
         this.LBC.style.left = this.LBdiv.clientWidth - this.LBC.clientWidth + 'px';
      } else {
         this.LTC.style.left = 3 + 'px';
         this.LBC.style.left = 3 + 'px';
      }

      this.RTC.style.left = 0 + 'px';
      this.RBC.style.left = 0 + 'px';

      window.dispatchEvent(new Event('resize'));
   }

   this.LayoutChangeBottomHeight = function (pix) {
      this.LTdiv.style.bottom = pix + margin + 'px';
      this.RTdiv.style.bottom = pix + margin + 'px';
      this.LBdiv.style.height = pix - margin + 'px';
      this.RBdiv.style.height = pix - margin + 'px';
      this.VSCRLP.style.bottom = pix + margin + 'px';

      if (this.LTdiv.clientHeight > this.LTC.clientHeight) {
         this.LTC.style.top = this.LTdiv.clientHeight - this.LTC.clientHeight + 'px';
         this.RTC.style.top = this.RTdiv.clientHeight - this.RTC.clientHeight + 'px';
      } else {
         this.LTC.style.top = 3 + 'px';
         this.RTC.style.top = 3 + 'px';
      }
      this.LBC.style.top = 0 + 'px';
      this.RBC.style.top = 0 + 'px';

      window.dispatchEvent(new Event('resize'));
   }

   //--------------------------------------------------------------------------
   //create boxes

   this.CreateBoxesAsync = function () {
      var parent = this;
      cmdline.Log('Creating boxes...', 'working');
      setTimeout(function () {
         for (var i = 0; i < parent.MainWidth; ++i) {
            parent.LTarray[i] = new Array(parent.MainHeight);
         }
         for (var i = 0; i < parent.MainWidth; ++i) {
            for (var j = 0; j < parent.MainHeight; ++j) {
               parent.CreateBox(i, j, parent.LTlayer, parent.LTarray, false, parent);
            }
         }
         parent.LTlayer.draw();

         for (var i = 0; i < parent.RightWidth; ++i) {
            parent.RTarray[i] = new Array(parent.MainHeight);
         }
         for (var i = 0; i < parent.RightWidth; ++i) {
            for (var j = 0; j < parent.MainHeight; ++j) {
               parent.CreateBox(i, j, parent.RTlayer, parent.RTarray, true, parent);
            }
         }
         parent.RTlayer.draw();

         for (var i = 0; i < parent.RightWidth; ++i) {
            parent.RBarray[i] = new Array(parent.BottomHeight);
         }
         for (var i = 0; i < parent.RightWidth; ++i) {
            for (var j = 0; j < parent.BottomHeight; ++j) {
               parent.CreateBox(i, j, parent.RBlayer, parent.RBarray, true, parent);
            }
         }
         parent.RBlayer.draw();


         for (var i = 0; i < parent.MainWidth; ++i) {
            parent.LBarray[i] = new Array(parent.BottomHeight);
         }
         for (var i = 0; i < parent.MainWidth; ++i) {
            for (var j = 0; j < parent.BottomHeight; ++j) {
               parent.CreateBox(i, j, parent.LBlayer, parent.LBarray, true, parent);
            }
         }
         parent.LBlayer.draw();

         parent.loadReady();
      }, 0);
   }

   this.CreateBox = function(x, y, layer, array, clickable, Model) {
      var box = new Kinetic.Rect({
         x: x * Model.BoxWidth,
         y: y * Model.BoxWidth,
         width: Model.BoxWidth,
         height: Model.BoxWidth,
         fill: Model.unselectedcolor,
         stroke: 'black',
         strokeWidth: 1,
         selected: false,
         hitFunc: function (context) {
            context.beginPath();
            context.rect(Model.hitbox_padding, Model.hitbox_padding, Model.hitbox_content, Model.hitbox_content);
            context.closePath();
            context.fillStrokeShape(this);
         }
      });

      if (layer.attrs.name == Model.LTlayername) {
         box.layind = 0;
      } else if (layer.attrs.name == Model.RTlayername) {
         box.layind = 1;
      } else if (layer.attrs.name == Model.LBlayername) {
         box.layind = 2;
      } else if (layer.attrs.name == Model.RBlayername) {
         box.layind = 3;
      } else {
         box.layind = -1;
      }

      box.x_ind = x;
      box.y_ind = y;
      box.select = function () {
         if (this.selected) {
            return;
         }
         this.fill(Model.selectedcolor);
         this.selected = true;
         this.draw();
      };
      box.unselect = function () {
         if (!this.selected) {
            return;
         }
         this.fill(Model.unselectedcolor);
         this.selected = false;
         this.draw();
      }
      if (clickable) {
         box.toggle = function () {
            if (this.selected) {
               this.unselect();
            } else {
               this.select();
            }
            Model.UpdateAll(this);
            //console.log('lollll');
         };
         box.on('mouseover', function () {
            PrintCoords(this.x_ind, this.y_ind, this.layind);
            if (mousedown) {
               if (select && !this.selected) {
                  this.toggle();
               } else if (!select && this.selected) {
                  this.toggle();
               }
            }
         });
         box.on('mousedown', function () {
            select = !this.selected;
            this.toggle();
         });
      } else {
         box.on('mouseover', function () {
            PrintCoords(this.x_ind, this.y_ind, this.layind);
         });
      }

      layer.add(box);
      array[x][y] = box;
   }

   //--------------------------------------------------------------------------
   //update boxes

   //updates all boxes when given box is changed
   this.UpdateAll = function(ruutu) {
      if (ruutu) {
         var rivi = ruutu.y_ind;
         var sarake = ruutu.x_ind;
         var kerros = ruutu.getLayer();

         if (kerros === this.RTlayer) {
            if (onlyAllowOnePerRow) {
               for (var i = 0; i < this.RightWidth; ++i) {
                  if (i == sarake) {
                     continue;
                  }
                  this.RTarray[i][rivi].unselect();
               }
            }
            for (var i = 0; i < this.MainWidth; ++i) {
               this.UpdateSingle(this.LTarray[i][rivi]);
            }
         } else if (kerros === this.LBlayer) {
            if (onlyAllowOnePerRow) {
               for (var i = 0; i < this.BottomHeight; ++i) {
                  if (i == rivi) {
                     continue;
                  }
                  this.LBarray[sarake][i].unselect();
               }
            }
            for (var i = 0; i < this.MainHeight; ++i) {
               this.UpdateSingle(this.LTarray[sarake][i]);
            }
         } else if (kerros === this.RBlayer) {
            for (var i = 0; i < this.MainWidth; ++i) {
               for (var j = 0; j < this.MainHeight; ++j) {
                  this.UpdateSingle(this.LTarray[i][j]);
               }
            }
         }
      } else {
         for (var i = 0; i < this.MainWidth; ++i) {
            for (var j = 0; j < this.MainHeight; ++j) {
               this.UpdateSingle(this.LTarray[i][j]);
            }
         }
      }
   }

   //fixes single LT box
   this.UpdateSingle = function(LT_box_to_update) {
      var row = LT_box_to_update.y_ind;
      var column = LT_box_to_update.x_ind;

      var columns_of_selected_RT_boxes = [];

      for (var i = 0; i < this.RightWidth; ++i) {
         if (this.RTarray[i][row].selected) {
            columns_of_selected_RT_boxes.push(i);
         }
      }
      if (columns_of_selected_RT_boxes.length === 0) {
         LT_box_to_update.unselect();
         return;
      }

      var rows_of_selected_LB_boxes = [];
      for (var i = 0; i < this.BottomHeight; ++i) {
         if (this.LBarray[column][i].selected) {
            rows_of_selected_LB_boxes.push(i);
         }
      }
      if (rows_of_selected_LB_boxes.length === 0) {
         LT_box_to_update.unselect();
         return;
      }

      for (var i = 0; i < rows_of_selected_LB_boxes.length; ++i) {
         for (var j = 0 ; j < columns_of_selected_RT_boxes.length; ++j) {
            if (this.RBarray[columns_of_selected_RT_boxes[j]][rows_of_selected_LB_boxes[i]].selected) {
               LT_box_to_update.select();
               return;
            }
         }
      }
      LT_box_to_update.unselect();
   }

   //--------------------------------------------------------------------------
   //update boxes on resize etc

   this.ModelChangeRightWidth = function (newwidth_raw) {
      var newwidth = NaN;
      if (newwidth_raw === parseInt(newwidth_raw)) {
         newwidth = newwidth_raw;
      } else if (parseInt(newwidth_raw).toString() === newwidth_raw.toString()) {
         newwidth = parseInt(newwidth_raw);
      } else {
         newwidth = NaN;
      }

      if (isNaN(newwidth) || newwidth < 2 || newwidth > 20) {
         cmdline.Log('Uusi arvo oikean reunan leveydelle on virheellinen: ' + uusileveys_raw + ' (minimi 2, maksimi 20)', 'error');
         return false;
      }

      if (newwidth === this.RightWidth) {
         return true;
      }

      if (newwidth < this.RightWidth) {
         for (var i = newwidth; i < this.RightWidth; ++i) {
            for (var j = 0; j < this.MainHeight; ++j) {
               this.RTarray[i][j].destroy();
            }
         }
         this.RTarray.splice(newwidth, this.RightWidth - newwidth);

         for (var i = newwidth; i < this.RightWidth; ++i) {
            for (var j = 0; j < this.BottomHeight; ++j) {
               this.RBarray[i][j].destroy();
            }
         }
         this.RBarray.splice(newwidth, this.RightWidth - newwidth);
      } else {
         for (var i = this.RightWidth; i < newwidth; ++i) {
            this.RTarray[i] = new Array(this.MainHeight);
         }
         for (var i = this.RightWidth; i < newwidth; ++i) {
            for (var j = 0; j < this.MainHeight; ++j) {
               this.CreateBox(i, j, this.RTlayer, this.RTarray, true, this);
            }
         }

         for (var i = this.RightWidth; i < newwidth; ++i) {
            this.RBarray[i] = new Array(this.BottomHeight);
         }
         for (var i = this.RightWidth; i < newwidth; ++i) {
            for (var j = 0; j < this.BottomHeight; ++j) {
               this.CreateBox(i, j, this.RBlayer, this.RBarray, true, this);
            }
         }

      }
      this.RightWidth = newwidth;
      this.RTstage.setWidth(this.BoxWidth * this.RightWidth);
      this.RBstage.setWidth(this.BoxWidth * this.RightWidth);
      this.LayoutChangeRightWidth(this.RightWidth * this.BoxWidth + margin + extrawidth);
      this.DrawAll();
      return true;
   }

   this.ModelChangeBottomHeight = function(newheight_raw) {
      var newheight = NaN;
      if (newheight_raw === parseInt(newheight_raw)) {
         newheight = newheight_raw;
      } else if (parseInt(newheight_raw).toString() === newheight_raw.toString()) {
         newheight = parseInt(newheight_raw);
      } else {
         newheight = NaN;
      }

      if (isNaN(newheight) || newheight < 2 || newheight > 20) {
         cmdline.Log('Uusi arvo alareunan korkeudelle on virheellinen: ' + newheight_raw + ' (minimi 2, maksimi 20)', 'error');
         return false;
      }

      if (newheight === this.BottomHeight) {
         return true;
      }

      if (newheight < this.BottomHeight) {
         for (var i = 0; i < this.MainWidth; ++i) {
            for (var j = newheight; j < this.BottomHeight; ++j) {
               this.LBarray[i][j].destroy();
            }
         }
         for (var i = 0; i < this.MainWidth; ++i) {
            this.LBarray[i].splice(newheight, this.BottomHeight - newheight);
         }

         for (var i = 0; i < this.RightWidth; ++i) {
            for (var j = newheight; j < this.BottomHeight; ++j) {
               this.RBarray[i][j].destroy();
            }
         }
         for (var i = 0; i < this.RightWidth; ++i) {
            this.RBarray[i].splice(newheight, this.BottomHeight - newheight);
         }

      } else {
         for (var i = 0; i < this.MainWidth; ++i) {
            for (var j = this.BottomHeight; j < newheight; ++j) {
               this.LBarray[i].push({});
            }
         }
         for (var i = 0; i < this.MainWidth; ++i) {
            for (var j = this.BottomHeight; j < newheight; ++j) {
               this.CreateBox(i, j, this.LBlayer, this.LBarray, true, this);
            }
         }

         for (var i = 0; i < this.RightWidth; ++i) {
            for (var j = this.BottomHeight; j < newheight; ++j) {
               this.RBarray[i].push({});
            }
         }
         for (var i = 0; i < this.RightWidth; ++i) {
            for (var j = this.BottomHeight; j < newheight; ++j) {
               this.CreateBox(i, j, this.RBlayer, this.RBarray, true, this);
            }
         }

      }
      this.BottomHeight = newheight;
      this.LBstage.setHeight(this.BoxWidth * this.BottomHeight);
      this.RBstage.setHeight(this.BoxWidth * this.BottomHeight);
      this.LayoutChangeBottomHeight(this.BottomHeight * this.BoxWidth + margin + extrawidth);
      this.DrawAll();
      return true;
   }

   //----------------------------------------------------------
   //piirretään kaikki
   this.DrawAll = function() {
      this.LTlayer.draw();
      this.RTlayer.draw();
      this.LBlayer.draw();
      this.RBlayer.draw();
   }

   //----------------------------------------------------
   //ladataan tallennettu kuvio
   this.LoadPattern = function(raw_json) {
      var loaddata = JSON.parse(raw_json);

      var mainheight = loaddata.MainHeight;
      var mainwidth = loaddata.MainWidth;
      var bottomheight = loaddata.BottomHeight;
      var sidewidth = loaddata.SideWidth;

      var RT = loaddata.RT;
      var LB = loaddata.LB;
      var RB = loaddata.RB;

      if (mainheight != this.MainHeight || mainwidth != this.MainWidth) {
         throw "Kokoja tarvisi muuttaa...";
      }
      
      if (sidewidth != this.RightWidth) {
         this.ModelChangeRightWidth(sidewidth);
      }

      if (bottomheight != this.BottomHeight) {
         this.ModelChangeBottomHeight(bottomheight);
      }
      
      this.UnselectAll();

      var parent = this;
      RT.forEach(function (coords) {
         parent.RTarray[coords[0]][coords[1]].select();
      });
      LB.forEach(function (coords) {
         parent.LBarray[coords[0]][coords[1]].select();
      });
      RB.forEach(function (coords) {
         parent.RBarray[coords[0]][coords[1]].select();
      });
      this.UpdateAll();
      cmdline.Log('Kuvio ladattu');
   }

   this.UpdateLayout = function () {
      this.LayoutChangeRightWidth(this.RightWidth * this.BoxWidth + this.Margin + this.ExtraWidth);
      this.LayoutChangeBottomHeight(this.BottomHeight * this.BoxWidth + this.Margin + this.ExtraWidth);

      //invisible areas for scroll
      this.VSCRL.style.height = this.BoxWidth * this.MainHeight + 'px';
      this.HSCRL.style.width = this.BoxWidth * this.MainWidth + 'px';
   }

   this.ScrollHome = function () {
      this.LTdiv.scrollTop = this.LTdiv.scrollHeight - this.LTdiv.clientHeight - 1;
      this.LTdiv.scrollLeft = this.LTdiv.scrollWidth - this.LTdiv.clientWidth;

      this.RTdiv.scrollTop = this.RTdiv.scrollHeight - this.RTdiv.clientHeight - 1;
      this.LBdiv.scrollLeft = this.LBdiv.scrollWidth - this.LBdiv.clientWidth;
   }

   this.ResetScroll = function () {
      this.ScrollHome();

      this.scrollbar.update('bottom');
      this.scrollscale = this.scrollbar.contentPosition;
      console.log(this.scrollscale);

      this.scrollbar2.update('bottom');
      this.scrollscale2 = this.scrollbar2.contentPosition;
      console.log(this.scrollscale2);
   }

   this.UnselectAll = function() {
      this.RTarray.forEach(function (row) {
         row.forEach(function (box) {
            box.unselect();
         });
      });
      this.LBarray.forEach(function (row) {
         row.forEach(function (box) {
            box.unselect();
         });
      });
      this.RBarray.forEach(function (row) {
         row.forEach(function (box) {
            box.unselect();
         });
      });
   }

   this.loadReady = function () {
      this.Show();
   }

   this.Hide = function (cb) {
      coverdiv.fadeIn("fast", function() {
         coverdiv.show();
         if (cb) {
            cb();
         }
      });
   }

   this.Show = function (cb) {
      coverdiv.fadeOut("fast", function () {
         coverdiv.hide();
         if (cb) {
            cb();
         }
      });
   }
}