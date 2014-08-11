//Copies values from array from_here to to_here without recreating to_here array
function CpyArray(from_here, to_here) {
   to_here.length = from_here.length;
   for (var i = 0; i < from_here.length; ++i) {
      to_here[i] = from_here[i];
   }
}

function isInteger(testattava_str) {
   var testattava_int = parseInt(testattava_str);
   if (testattava_int.toString() !== testattava_str || isNaN(testattava_int)) {
      return false;
   }
   return true;
}

function fileErrorHandler(e) {
   var msg = '';

   switch (e.code) {
      case FileError.QUOTA_EXCEEDED_ERR:
         msg = 'QUOTA_EXCEEDED_ERR';
         break;
      case FileError.NOT_FOUND_ERR:
         msg = 'NOT_FOUND_ERR';
         break;
      case FileError.SECURITY_ERR:
         msg = 'SECURITY_ERR';
         break;
      case FileError.INVALID_MODIFICATION_ERR:
         msg = 'INVALID_MODIFICATION_ERR';
         break;
      case FileError.INVALID_STATE_ERR:
         msg = 'INVALID_STATE_ERR';
         break;
      default:
         msg = 'Unknown Error';
         break;
   };

   console.log('Error: ' + msg);
}

function getCookie(cname) {
   var name = cname + "=";
   var ca = document.cookie.split(';');
   for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
   }
   return "";
}

function PrintCoords(x, y, layer) {
   var fixedx, fixedy;

   //VY
   if (layer == 0) {
      fixedx = model.MainWidth - x;
      fixedy = model.MainHeight - y;
      //OY
   } else if (layer == 1) {
      fixedx = ++x;
      fixedy = model.MainHeight - y;
      //VA
   } else if (layer == 2) {
      fixedx = model.MainWidth - x;
      fixedy = ++y;
      //OA
   } else if (layer == 3) {
      fixedx = ++x;
      fixedy = ++y;
   }

   xcoorddiv.innerHTML = fixedx;
   ycoorddiv.innerHTML = fixedy;
}