var drawAreaX = 156;
var drawAreaY = 100;

var drawAreaWidth = 2000;
var drawAreaHeight = 2000;

var boxDefaultWidth = 100;
var boxDefaultHeight = 50;

var IDCounter = 0;
function giveUniqueID() {
   return IDCounter++;
}

var boxes = [];
var selectedBoxes = [];
selectedBoxes.findBox = function (target) {
   for (var i = this.length - 1; i >= 0; --i) {
      if (this[i].id === target.id) {
         return i;
      }
      return -1;
   }
};

var stage = new Kinetic.Stage({
   container: 'drawarea',
   width: drawAreaWidth,
   height: drawAreaHeight,
   id: giveUniqueID()
});

var layer = new Kinetic.Layer({
   name: 'piirtokerros',
   id: giveUniqueID()
});

stage.add(layer);

function getStageCoordinates(target) {
   var stageId = stage.getId();
   var iter = target;
   var resx = iter.getX();
   var resy = iter.getY();
   do {
      iter = iter.getParent();
      resx += iter.getX();
      resy += iter.getY();
   } while (iter.getId() != stageId);
   return {
      x: resx,
      y: resy
   };
}


var moveGroup = new Kinetic.Group({
   x: 0,
   y: 0,
   draggable: true,
   id: giveUniqueID(),
   toplimit: 0,
   leftlimit: 0
});

moveGroup.on('dragstart', function () {
   this.moveToTop();
   var selecteds = this.getChildren();

   this.toplimit = Infinity;
   //var bottom = -Infinity;
   this.leftlimit = Infinity;
   //var right = -Infinity;

   for (var i = 0; i < selecteds.length; ++i) {
      var sTop = selecteds[i].parent_.Top();
      this.toplimit = sTop < this.toplimit ? sTop : this.toplimit;

      //var sBot = selecteds[i].parent_.Bottom();
      //bottom = sBot > bottom ? sBot : bottom;

      var sLeft = selecteds[i].parent_.Left();
      this.leftlimit = sLeft < this.leftlimit ? sLeft : this.leftlimit;

      //var sRight = selecteds[i].parent_.Right();
      //right = sRight > right ? sRight : right;
   }
   this.toplimit -= this.getY();
   this.leftlimit -= this.getX();
   this.getLayer().draw();
});

moveGroup.on('dragend', function () {
   var selecteds = this.getChildren();
   for (var i = 0; i < selecteds.length; ++i) {
      selecteds[i].fire('dragend');
   }
});
layer.add(moveGroup);
moveGroup.moveToTop();

moveGroup.dragBoundFunc(function (pos) {


   //top = top - this.getY();
   //bottom = bottom - this.getY();
   //left = left - this.getX();
   //right = right - this.getX();

   var oldX = this.getX();
   var oldY = this.getY();
   var left = this.leftlimit;
   var top = this.toplimit;

   var newX = left + pos.x  < 0 ? -left : pos.x;
   var newY = top + pos.y < 0 ? -top : pos.y;

   //console.log([this.leftlimit, top, pos.x, pos.y, this.getX(), this.getY()]);

   return {
      x: newX,
      y: newY
   };
});

function UnSelectAll() {
   //console.log("unselect alkoi");
   /*for (var i = 0; i < selectedBoxes.length; ++i) {
      console.log(selectedBoxes[i].group.index);
   }*/
   selectedBoxes.sort(function (a, b) { return b.group.index - a.group.index; });
   /*for (var i = 0; i < selectedBoxes.length; ++i) {
      console.log(selectedBoxes[i].group.index);
   }*/
   while (selectedBoxes.length > 0) {
      selectedBoxes[selectedBoxes.length - 1].becomeUnSelected();
   }
   //console.log("unselect loppui");
}

var bgRect = new Kinetic.Rect({
   x: 0,
   y: 0,
   width: stage.getWidth(),
   height: stage.getHeight(),
   stroke: 0,
   draggable: true,
   selectionRect: undefined,
   id: giveUniqueID()
});

var bgLayer = new Kinetic.Layer({
   name: 'taustakerros',
   id: giveUniqueID()
});
bgLayer.add(bgRect);
stage.add(bgLayer);
bgLayer.moveToBottom();

bgRect.on('click', function (evt) {
   //console.log("Osuttiin taustaan:" + evt.x + ", " + evt.y);
   //console.log(document.getElementById('drawarea').scrollTop);
   if (evt.which == 1) {
      UnSelectAll();
   }
   else if (evt.which == 2) {
      console.log(selectedBoxes);
   }
});

bgRect.on('dragstart', function (pos) {
   if (pos.which == 1) {
      console.log("taustan drag alkoi");
      //this.fire('click');
      UnSelectAll();

      var alue = document.getElementById('drawarea');
      var scrollY = alue.scrollTop;
      var scrollX = alue.scrollLeft;

      console.log("jatketaan dragstartissa");
      this.selectionRect = new Kinetic.Rect({
         x: pos.x - drawAreaX + scrollX,
         y: pos.y - drawAreaY + scrollY,
         width: 10,
         height: 10,
         stroke: 1,
         dashEnabled: true,
         dash: [5, 10],
         id: giveUniqueID()
      });
      this.getLayer().add(this.selectionRect);
      this.getLayer().moveToTop();

      this.getLayer().draw();
      //console.log([pos.x, pos.y]);
   }
});

bgRect.on('dragmove', function (pos) {
   if (pos.which == 1) {
      console.log("tausta liikkuu...");

      var alue = document.getElementById('drawarea');
      var scrollY = alue.scrollTop;
      var scrollX = alue.scrollLeft;

      this.selectionRect.setWidth(pos.x - this.selectionRect.getX() - drawAreaX + scrollX);
      this.selectionRect.setHeight(pos.y - this.selectionRect.getY() - drawAreaY + scrollY);
      this.getLayer().draw();
   }
});

bgRect.on('dragend', function (pos) {
   if (pos.which == 1) {
      console.log("taustan liike loppui");
      this.getLayer().moveToBottom();
      moveGroup.moveToTop();
      //this.moveToBottom();
      this.setX(0);
      this.setY(0);

      var left = Math.min(this.selectionRect.getX(), this.selectionRect.getX() + this.selectionRect.getWidth());
      var right = Math.max(this.selectionRect.getX(), this.selectionRect.getX() + this.selectionRect.getWidth());
      var top = Math.min(this.selectionRect.getY(), this.selectionRect.getY() + this.selectionRect.getHeight());
      var bottom = Math.max(this.selectionRect.getY(), this.selectionRect.getY() + this.selectionRect.getHeight());

      var selecteds = [];
      for (var i = 0; i < boxes.length; ++i) {
         if (boxes[i].isContained(left, right, top, bottom)) {
            selecteds.push(boxes[i]);
         }
      }
      selecteds.sort(function (a, b) { return a.group.index - b.group.index; });
      for (var i = 0; i < selecteds.length; ++i) {
         selecteds[i].becomeSelected();
      }

      //console.log([left, right, top, bottom]);

      console.log(layer.getChildren());
      console.log(bgLayer.getChildren());

      this.selectionRect.destroy();
      this.getLayer().draw();
      layer.draw();
   }
});

function update(activeAnchor) {
   var group = activeAnchor.getParent();

   var topLeft = group.get('.topLeft')[0];
   var topRight = group.get('.topRight')[0];
   var bottomRight = group.get('.bottomRight')[0];
   var bottomLeft = group.get('.bottomLeft')[0];
   var body = group.get('.body')[0];

   var anchorX = activeAnchor.getX();
   var anchorY = activeAnchor.getY();

   // update anchor positions
   switch (activeAnchor.getName()) {
      case 'topLeft':
         topRight.setY(anchorY);
         bottomLeft.setX(anchorX);
         break;
      case 'topRight':
         topLeft.setY(anchorY);
         bottomRight.setX(anchorX);
         break;
      case 'bottomRight':
         bottomLeft.setY(anchorY);
         topRight.setX(anchorX);
         break;
      case 'bottomLeft':
         bottomRight.setY(anchorY);
         topLeft.setX(anchorX);
         break;
   }
   body.setPosition(topLeft.getPosition());
   //group.setPosition(topLeft.getPosition()+group.getPosition());
   var width = topRight.getX() - topLeft.getX();
   var height = bottomLeft.getY() - topLeft.getY();
   if (width && height) {
      //body.setSize(width, height);
      body.setWidth(width);
      body.setHeight(height);
   }
}

function addAnchor(group, x, y, name) {
   var stage = group.getStage();
   var layer = group.getLayer();

   var anchor = new Kinetic.Circle({
      x: x,
      y: y,
      stroke: '#ffffff',
      fill: '#ffffff',
      strokeWidth: 0,
      radius: 5,
      name: name,
      draggable: true,
      dragOnTop: false,
      opacity: 0,
      id: giveUniqueID()
   });

   anchor.on('dragmove', function () {
      update(this);
      layer.draw();
   });
   anchor.on('mousedown touchstart', function () {
      group.setDraggable(false);
      this.moveToTop();
   });
   anchor.on('dragend', function () {
      group.setDraggable(true);
      layer.draw();
   });
   // add hover styling
   anchor.on('mouseover', function () {
      var layer = this.getLayer();
      document.body.style.cursor = 'pointer';
      this.setOpacity(1);
      layer.draw();
   });
   anchor.on('mouseout', function () {
      var layer = this.getLayer();
      document.body.style.cursor = 'default';
      this.setOpacity(0);
      layer.draw();
   });

   group.add(anchor);
}

function addGroup(color) {
   var group = new Kinetic.Group({
      x: 100,
      y: 40,
      draggable: true,
      body: undefined,
      id: giveUniqueID()
   });
   layer.add(group);

   var box = new Kinetic.Rect({
      x: 0,
      y: 0,
      width: boxDefaultWidth,
      height: boxDefaultHeight,
      fill: color,
      stroke: 'black',
      strokeWidth: 1,
      draggable: false,
      name: 'body',
      id: giveUniqueID()
   });

   group.add(box);
   group.body = group.get('.body')[0];
   addAnchor(group, 0, 0, 'topLeft');
   addAnchor(group, boxDefaultWidth, 0, 'topRight');
   addAnchor(group, 0, boxDefaultHeight, 'bottomLeft');
   addAnchor(group, boxDefaultWidth, boxDefaultHeight, 'bottomRight');

   group.dragBoundFunc(function (pos) {
      var bX = this.body.getX();
      var bY = this.body.getY();
      var newX = pos.x + bX < 0 ? -bX : pos.x;
      newX = pos.x + bX + this.body.getWidth() > drawAreaWidth ? drawAreaWidth - this.body.getWidth() - bX : newX;
      var newY = pos.y + bY < 0 ? -bY : pos.y;
      newY = pos.y + bY + this.body.getHeight() > drawAreaHeight ? drawAreaHeight - this.body.getHeight() - bY : newY;
      return {
         x: newX,
         y: newY
      };
   });

   group.on('dragstart', function () {
      this.moveToTop();
   });

   /*var anchor = new Kinetic.Circle({
      x: 0,
      y: 0,
      stroke: '#ffffff',
      fill: '#0000ff',
      strokeWidth: 0,
      radius: 5,
      name: name,
      draggable: false,
      dragOnTop: false,
      opacity: 1
   });
   group.add(anchor);*/

   layer.draw();

}
//addGroup("red");

var tooltips = new Array("A", "B", "C", "D");
var colors = new Array("green", "blue", "yellow", "cyan");
function createImageTag(nameWithoutPng, counter) {
   return "<img src=\"icons\/" + nameWithoutPng + ".png\" class=\"toolimage\" " + "onclick=\"addGroup('" + colors[counter % colors.length] + "')\" \/>";
}

var tooltipTags = "";
for (i = 0; i < tooltips.length; ++i) {
   tooltipTags += createImageTag(tooltips[i], i) + '\n';
}

document.getElementById("toolbar").innerHTML = tooltipTags;
/*
var box2 = new Kinetic.Rect({
   x: 0,
   y: 0,
   width: boxDefaultWidth,
   height: boxDefaultHeight,
   fill: "cyan",
   stroke: 'black',
   strokeWidth: 1,
   draggable: true,
   name: 'asd',
   dragBoundFunc: function (pos) { return pos; }
});

box2.dragBoundFunc(function (pos) {
   var newX = pos.x < 0 ? 0 : pos.x;
   newX = pos.x + this.getWidth() > drawAreaWidth ? drawAreaWidth - this.getWidth() : newX;
   var newY = pos.y < 0 ? 0 : pos.y;
   newY = pos.y + this.getHeight() > drawAreaHeight ? drawAreaHeight - this.getHeight() : newY;
   return {
      x: newX,
      y: newY
   };
});

layer.add(box2);
layer.draw();
*/
/*
var classgroup = new Kinetic.Group({
   x: 100,
   y: 40,
   draggable: true,
   head: undefined,
   body: undefined
});
layer.add(classgroup);

var head = new Kinetic.Rect({
   x: 0,
   y: 0,
   width: 100,
   height: 50,
   fill: "white",
   stroke: 'black',
   strokeWidth: 1,
   draggable: false,
   name: 'head',
});

classgroup.add(head);
classgroup.head = classgroup.get('.head')[0];

var body = new Kinetic.Rect({
   x: 0,
   y: 50,
   width: 100,
   height: 200,
   fill: "white",
   stroke: 'black',
   strokeWidth: 1,
   draggable: false,
   name: 'body',
});

classgroup.add(body);
classgroup.body = classgroup.get('.body')[0];*/

/*addAnchor(group, 0, 0, 'topLeft');
addAnchor(group, boxDefaultWidth, 0, 'topRight');
addAnchor(group, 0, boxDefaultHeight, 'bottomLeft');
addAnchor(group, boxDefaultWidth, boxDefaultHeight, 'bottomRight');
*/
/*classgroup.on('dragstart', function () {
   this.moveToTop();
});*/
/*
var div = document.getElementById("drawarea");
var input = document.createElement("textarea");
input.className = "textboxes";
input.style.width = "80px";
input.rows = "1";
input.style.resize = "none";
div.appendChild(input); //appendChild
input.style.top = "100px";
input.style.left = "100px";
input.readOnly = 'true';
input.ondblclick = function () { this.readOnly = this.readOnly ? '' : 'true'; };
*/
//input.oninput = function () {
//   input.style.height = ""; /* Reset the height*/
//   input.style.height = input.scrollHeight + "px";
//};

//layer.draw();

var defaultClassBoxWidth = 100;
var defaultClassBoxHeight = 250;
var defaultClassBoxHeadHeight = 50;
var classBoxMinWidth = 50;
var classBoxMinHeight = 75;

function classBox(x, y, layer) {
   this.layer = layer;
   this.anchors = [];
   this.selected = false;
   this.id = giveUniqueID();

   this.group = new Kinetic.Group({
      x: x,
      y: y,
      draggable: false,
      head: undefined,
      body: undefined,
      border: undefined,
      parent_: undefined,
      id: giveUniqueID()
   });
   this.group.parent_ = this;
   this.layer.add(this.group);
   /*this.group.on('dragstart', function () {
      this.moveToTop();
   });*/

   this.group.on('dblclick', function (evt) {
      console.log('tuplaclick');
      /*evt.cancelBubble = true;
      if (this.parent_.selected) {
         this.parent_.becomeSelected();
      }
      else {
         this.parent_.becomeUnSelected();
      }*/
   });

   this.group.on('click', function (evt) {
      //console.log("lollollol");
      if (evt.which == 1) {
         if (!this.parent_.selected) {
            this.parent_.becomeSelected();
         }
         else {
            var lapsia = this.parent.getChildren().length;
            if (this.index != lapsia - 1) {
               this.moveToTop();
               this.getLayer().draw();
            }
            else if (moveGroup.index != layer.getChildren().length - 1) {
               moveGroup.moveToTop()
               moveGroup.getLayer().draw();
            }
            else {
               this.parent_.becomeUnSelected();
            }
         }
      }
      //evt.cancelBubble = true;
      if (evt.which == 2) {
         var tarkasteltava = this.border;/*
         while (tarkasteltava != undefined) {
            console.log(tarkasteltava);
            console.log(tarkasteltava.getPosition());
            tarkasteltava = tarkasteltava.getParent();
         }
         console.log('================');*/
         var pX = this.parent_.Left();
         var pY = this.parent_.Top();
         var pW = this.parent_.Width();
         var pH = this.parent_.Height();

         console.log(getStageCoordinates(tarkasteltava));

         var testRect = new Kinetic.Rect({
            x: pX,
            y: pY,
            width: pW,
            height: pH,
            fill: "red",
            stroke: 'green',
            strokeWidth: 3,
            draggable: false,
            name: 'testilol',
            parent_: undefined,
            id: giveUniqueID()
         });

         this.parent_.layer.add(testRect);
         this.parent_.layer.draw();
      }
   });

   /*this.group.on('dragend', function () {
      this.parent_.x = this.head.getX() + this.getX();
      this.parent_.y = this.head.getY() + this.getY();
   });*/

   this.border = new Kinetic.Rect({
      x: 0,
      y: 0,
      width: defaultClassBoxWidth,
      height: defaultClassBoxHeight,
      fill: "white",
      stroke: 'red',
      strokeWidth: 3,
      draggable: false,
      name: 'border',
      fillEnabled: false,
      dashEnabled: true,
      dash: [10, 10],
      opacity: 0,
      parent_: undefined,
      id: giveUniqueID()
   });
   this.border.parent_ = this;
   this.group.add(this.border);
   this.group.border = this.group.get('.border')[0];

   this.head = new Kinetic.Rect({
      x: this.gLeft(),
      y: this.gTop(),
      width: this.Width(),
      height: defaultClassBoxHeadHeight,
      fill: "white",
      stroke: 'black',
      strokeWidth: 1,
      draggable: false,
      name: 'head',
      parent_: undefined,
      id: giveUniqueID()
   });
   this.head.parent_ = this;
   this.group.add(this.head);
   this.group.head = this.group.get('.head')[0];

   this.body = new Kinetic.Rect({
      x: this.gLeft(),
      y: defaultClassBoxHeadHeight,
      width: this.Width(),
      height: defaultClassBoxHeight - defaultClassBoxHeadHeight,
      fill: "white",
      stroke: 'black',
      strokeWidth: 1,
      draggable: false,
      name: 'body',
      parent_: undefined,
      id: giveUniqueID()
   });
   this.body.parent_ = this;
   this.group.add(this.body);
   this.group.body = this.group.get('.body')[0];

   this.layer.draw();
}
classBox.prototype.setDragBoundFcns = function () {
   var group = this.group;

   var topLeft = group.get('.topLeft')[0];
   var topRight = group.get('.topRight')[0];
   var bottomRight = group.get('.bottomRight')[0];
   var bottomLeft = group.get('.bottomLeft')[0];

   /*group.dragBoundFunc(function (pos) {
      var bX = this.body.getX();
      var bY = this.body.getY();
      var hX = this.head.getX();
      var hY = this.head.getY();

      var top = this.head.getY();
      var bottom = top + this.body.getHeight();
      var left = this.head.getX();
      var right = left + this.head.getWidth();

      var newX = pos.x + left < 0 ? -left : pos.x;
      newX = pos.x + right > drawAreaWidth ? drawAreaWidth - right : newX;
      var newY = pos.y + top < 0 ? -top : pos.y;
      newY = pos.y + bottom > drawAreaHeight ? drawAreaHeight - bottom : newY;
      return {
         x: newX,
         y: newY
      };
   });*/

   topLeft.dragBoundFunc(function (pos) {
      var groupStageCoords = getStageCoordinates(group);
      var x = pos.x - groupStageCoords.x;
      var y = pos.y - groupStageCoords.y;
      var oldRight = topRight.getX();
      var oldBottom = bottomLeft.getY();
      var newX = oldRight - x < classBoxMinWidth ? oldRight - classBoxMinWidth + groupStageCoords.x : pos.x;
      var newY = oldBottom - y < classBoxMinHeight ? oldBottom - classBoxMinHeight + groupStageCoords.y : pos.y;
      return {
         x: newX,
         y: newY
      };
   });
   topRight.dragBoundFunc(function (pos) {
      var groupStageCoords = getStageCoordinates(group);
      var x = pos.x - groupStageCoords.x;
      var y = pos.y - groupStageCoords.y;
      var oldLeft = topLeft.getX();
      var oldBottom = bottomLeft.getY();
      var newX = x - oldLeft < classBoxMinWidth ? oldLeft + classBoxMinWidth + groupStageCoords.x : pos.x;
      var newY = oldBottom - y < classBoxMinHeight ? oldBottom - classBoxMinHeight + groupStageCoords.y : pos.y;
      return {
         x: newX,
         y: newY
      };
   });
   bottomLeft.dragBoundFunc(function (pos) {
      var groupStageCoords = getStageCoordinates(group);
      var x = pos.x - groupStageCoords.x;
      var y = pos.y - groupStageCoords.y;
      var oldRight = topRight.getX();
      var oldTop = topLeft.getY();
      var newX = oldRight - x < classBoxMinWidth ? oldRight - classBoxMinWidth + groupStageCoords.x : pos.x;
      var newY = y - oldTop < classBoxMinHeight ? oldTop + classBoxMinHeight + groupStageCoords.y : pos.y;
      return {
         x: newX,
         y: newY
      };
   });
   bottomRight.dragBoundFunc(function (pos) {
      var groupStageCoords = getStageCoordinates(group);
      var x = pos.x - groupStageCoords.x;
      var y = pos.y - groupStageCoords.y;
      var oldLeft = topLeft.getX();
      var oldTop = topLeft.getY();
      var newX = x - oldLeft < classBoxMinWidth ? oldLeft + classBoxMinWidth + groupStageCoords.x : pos.x;
      var newY = y - oldTop < classBoxMinHeight ? oldTop + classBoxMinHeight + groupStageCoords.y : pos.y;
      return {
         x: newX,
         y: newY
      };
   });
}
classBox.prototype.update = function (activeAnchor) {
   var group = this.group;

   var topLeft = group.get('.topLeft')[0];
   var topRight = group.get('.topRight')[0];
   var bottomRight = group.get('.bottomRight')[0];
   var bottomLeft = group.get('.bottomLeft')[0];
   var head = group.get('.head')[0];
   var body = group.get('.body')[0];

   var anchorX = activeAnchor.getX();
   var anchorY = activeAnchor.getY();

   // update anchor positions
   switch (activeAnchor.getName()) {
      case 'topLeft':
         topRight.setY(anchorY);
         bottomLeft.setX(anchorX);
         break;
      case 'topRight':
         topLeft.setY(anchorY);
         bottomRight.setX(anchorX);
         break;
      case 'bottomRight':
         bottomLeft.setY(anchorY);
         topRight.setX(anchorX);
         break;
      case 'bottomLeft':
         bottomRight.setY(anchorY);
         topLeft.setX(anchorX);
         break;
   }
   head.setPosition(topLeft.getPosition());
   body.setX(head.getX());
   body.setY(head.getY() + head.getHeight());
   //body.setPosition(topLeft.getPosition());
   //group.setPosition(topLeft.getPosition()+group.getPosition());
   var width = topRight.getX() - topLeft.getX();
   var height = bottomLeft.getY() - topLeft.getY();
   if (width && height) {
      //body.setSize(width, height);
      head.setWidth(width);
      body.setWidth(width);
      body.setHeight(height - head.getHeight());
   }
   this.border.setPosition(topLeft.getPosition());
   this.border.setWidth(width);
   this.border.setHeight(height);
}

/*
classBox.prototype.setPosition = function (x, y) {
   this.head.setX(x);
   this.head.setY(y);
   this.body.setX(x);
   this.body.setY(y + this.head.getHeight());
   this.border.setX(x);
   this.border.setY(y);
   this.x = x;
   this.y = y;
}*/

classBox.prototype.becomeUnSelected = function () {
   //return;
   if (!this.selected) {
      return;
   }
   selectedBoxes.splice(selectedBoxes.findBox(this), 1);
   for (var i = 0; i < this.anchors.length; ++i) {
      this.anchors[i].setOpacity(0);
      this.anchors[i].draggable(false);
      this.anchors[i].on('mouseover', function () {
         document.body.style.cursor = 'default';
      });
      this.anchors[i].on('mouseout', function () {
      });
   }
   //this.group.draggable(false);

   //this.group.remove();
   //this.layer.add(this.group);
   this.group.moveTo(this.layer);
   this.group.moveToTop();

   this.group.setX(this.group.getX() + moveGroup.getX());
   this.group.setY(this.group.getY() + moveGroup.getY());

   this.border.setOpacity(0);
   this.selected = false;

   this.layer.draw();
}
classBox.prototype.becomeSelected = function () {
   if (this.selected) {
      this.group.moveToTop();
      return;
   }
   selectedBoxes.push(this);
   for (var i = 0; i < this.anchors.length; ++i) {
      this.anchors[i].setOpacity(1);
      this.anchors[i].draggable(true);
      this.anchors[i].on('mouseover', function () {
         var layer = this.getLayer();
         document.body.style.cursor = 'pointer';
         layer.draw();
      });
      this.anchors[i].on('mouseout', function () {
         var layer = this.getLayer();
         document.body.style.cursor = 'default';
         layer.draw();
      });
   }

   //this.group.remove();
   //moveGroup.add(this.group);
   this.group.moveTo(moveGroup);
   moveGroup.moveToTop();
   this.group.moveToTop();

   this.group.setX(this.group.getX() - moveGroup.getX());
   this.group.setY(this.group.getY() - moveGroup.getY());

   //this.group.draggable(true);
   this.border.setOpacity(1);
   this.selected = true;

   this.layer.draw();
}
function addAnchorB(element, name) {
   var group = element.group;
   var stage = group.getStage();
   var layer = group.getLayer();
   var x = 0; var y = 0;
   switch (name) {
      case 'topLeft':
         break;
      case 'topRight':
         x = element.Width();
         break;
      case 'bottomRight':
         x = element.Width();
         y = element.Height();
         break;
      case 'bottomLeft':
         y = element.Height();
         break;
   }

   var anchor = new Kinetic.Circle({
      x: x,
      y: y,
      stroke: '#000000',
      fill: '#ffffff',
      strokeWidth: 2,
      radius: 5,
      name: name,
      draggable: false,
      dragOnTop: false,
      //dashEnabled: true,
      //dash: [1, 2],
      opacity: 0
   });

   element.anchors.push(anchor);

   anchor.on('dragmove', function () {
      element.update(this);
      layer.draw();
   });
   anchor.on('mousedown touchstart', function () {
      //group.setDraggable(false);
      this.moveToTop();
   });
   anchor.on('dragend', function () {
      //group.setDraggable(true);
      layer.draw();
   });/*
   // add hover styling 
   anchor.on('mouseover', function () {
      var layer = this.getLayer();
      document.body.style.cursor = 'pointer';
      this.setOpacity(1);
      layer.draw();
   });
   anchor.on('mouseout', function () {
      var layer = this.getLayer();
      document.body.style.cursor = 'default';
      this.setOpacity(1);
      layer.draw();
   }); */

   group.add(anchor);
   layer.draw();
}

classBox.prototype.gLeft = function () {
   return this.border.getX();
}
classBox.prototype.gRight = function () {
   return this.border.getX() + this.border.getWidth();
}
classBox.prototype.gTop = function () {
   return this.border.getY();
}
classBox.prototype.gBottom = function () {
   return this.border.getY() + this.border.getHeight();
}

classBox.prototype.Left = function () {
   return getStageCoordinates(this.border).x;
}
classBox.prototype.Right = function () {
   return getStageCoordinates(this.border).x + this.border.getWidth();
}
classBox.prototype.Top = function () {
   return getStageCoordinates(this.border).y;
}
classBox.prototype.Bottom = function () {
   return getStageCoordinates(this.border).y + this.border.getHeight();
}
classBox.prototype.Width = function () {
   return this.border.getWidth();
}
classBox.prototype.Height = function () {
   return this.border.getHeight();
}

classBox.prototype.isContained = function (left, right, top, bottom) {
   return this.Left() >= left && this.Right() <= right && this.Top() >= top && this.Bottom() <= bottom;
}

var cB = new classBox(300, 100, layer);
addAnchorB(cB, 'topLeft');
addAnchorB(cB, 'topRight');
addAnchorB(cB, 'bottomLeft');
addAnchorB(cB, 'bottomRight');
cB.setDragBoundFcns();
boxes.push(cB);

var cB2 = new classBox(500, 100, layer);
addAnchorB(cB2, 'topLeft');
addAnchorB(cB2, 'topRight');
addAnchorB(cB2, 'bottomLeft');
addAnchorB(cB2, 'bottomRight');
cB2.setDragBoundFcns();
boxes.push(cB2);
