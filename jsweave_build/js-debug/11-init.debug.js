function init() {
   
   //luodaan ruudut
   model.CreateBoxesAsync();

   //kuuntelijat onko hiiri painettu pohjaan
   document.addEventListener("mousedown", function () {
      mousedown = true;
   });
   document.addEventListener("mouseup", function () {
      mousedown = false;
   });

   //CSS:n alustus
   model.UpdateLayout();
   model.ResetScroll();
   

   
   document.onclick = function () {
      //tänne debug-tulosteita yms
      /*
      var data = "{name: 'Bob', occupation: 'Plumber'}";
      var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);
      document.getElementById('savefield').href = url;
      */
   }

   //jos ikkunan kokoa muutetaan, täytyy sliderien skaalaus tehdä uudestaan
   window.onresize = function () {
      model.ResetScroll();
   };

   inputlineJQ.autocomplete({
      source: LocCmds[Lang],
      position: { my: "right bottom", at: "right top", collision: 'fit'},
      minLength: 2,
      delay: 200
   });
   
   cmdline.Log(NatToLoc[Lang]['welcome']);
}