function Cmdline(console_div, inputlineJQ) {
   var parent = this; //for callbacks
   //output div
   this.cnsl = console_div;
   this.cnsl.innerHTML = '';

   //input text input as JQ object
   this.inputJQ = inputlineJQ;

   this.InterpreterStatus = "begin"; //"begin", "param"
   this.CurrentCommand = '';
   this.CurrentArgument = 0;
   this.Args = [];

   this.cmdlist = new Array();
   this.cmds = new Object();

   this.CommandsToSave = 50;
   this.CommandHistoryIndex = Infinity;
   this.CommandHistory = [];

   this.normallinestart = '> ';
   this.normallineend = '';

   this.userlinestart = '> <span style="color:blue">';
   this.userlineend = '</span>';

   this.errorlinestart = '> <span style="color:red">';
   this.errorlineend = '</span>';

   this.workinglinestart = '~ <span style="font-style:oblique">';
   this.workinglineend = '</span>';

   //detect special keypresses
   this.inputJQ[0].addEventListener("keydown", function (evt) {
      //return and space
      if (evt.keyCode == 13 || evt.keyCode == 32) {
         evt.preventDefault();
         if (parent.inputJQ.val() == '') {
            return;
         }

         parent.inputJQ.autocomplete('close');
         parent.Interpret(parent.inputJQ.val());
         parent.inputJQ.val('');
         //UP
      } else if (evt.keyCode == 38) {
         evt.preventDefault();
         parent.UP();

         //DOWN
      } else if (evt.keyCode == 40) {
         evt.preventDefault();
         parent.DOWN();
      } else if (evt.keyCode == 67 && evt.ctrlKey) {
         parent.Log("*Cancel*");
         parent.GoToBeginState();
      }

      return false;
   });

   this.Log = function (string, type) {
      if (typeof (type) === 'undefined') {
         type = 'normal';
      }

      var start = '';
      var end = '';

      if (type == 'normal') {
         start = this.CurrentCommand + this.normallinestart;
         end = this.normallineend;

      } else if (type == 'user') {
         start = this.CurrentCommand + this.userlinestart;
         end = this.userlineend;
      }
      else if (type == 'error') {
         start = this.CurrentCommand + this.errorlinestart;
         end = this.errorlineend;
      } else if (type == 'working') {
         start = this.CurrentCommand + this.workinglinestart;
         end = this.workinglineend;
      } else if (type == 'about') {
         start = '<span style="font-style:oblique">';
         end = '</span>';
      }

      var fill = '';
      if (this.cnsl.innerHTML != '') {
         fill = '<br>';
      }
      this.cnsl.innerHTML = this.cnsl.innerHTML + fill + start + string + end;
      this.cnsl.scrollTop = this.cnsl.scrollHeight;
   }

   this.Interpret = function (input) {
      if (this.InterpreterStatus == "begin" && !this.cmds[input]) {
         var guess = this.Completer(input, this.cmdlist);
         if (this.cmds[guess]) {
            this.Interpret(guess);
         } else {
            this.Log(input, 'user');
            this.Log("Unknown command: " + input, 'error');
         }
      } else if (this.InterpreterStatus == "begin") {
         if (this.CommandHistory.length == 0 || this.CommandHistory[this.CommandHistory.length - 1] != input) {
            this.CommandHistory.push(input);
            this.CommandHistoryIndex = Infinity;
            if (this.CommandHistory.length > this.CommandsToSave) {
               this.CommandHistory.splice(0, this.CommandHistory.length - this.CommandsToSave);
            }
         }

         this.Log(input, 'user');
         this.InterpreterStatus = "param";
         this.CurrentCommand = input;
         this.CurrentArgument = 0;

         if (this.cmds[this.CurrentCommand].ArgQuery[this.CurrentArgument]) {
            var asd = this.cmds[this.CurrentCommand];
            if (this.cmds[this.CurrentCommand].ArgOptions[this.CurrentArgument]) {
               this.ParamAutocomplete();
            } else {
               this.DisableAutocomplete();
            }
            this.Log(this.cmds[this.CurrentCommand].ArgQuery[this.CurrentArgument]);
         } else {
            this.cmds[this.CurrentCommand].fcn();
            this.GoToBeginState();
         }
      } else if (this.InterpreterStatus == "param") {
         this.Args[this.CurrentArgument] = this.Completer(input, this.cmds[this.CurrentCommand].ArgOptions[this.CurrentArgument]);
         this.Log(this.Args[this.CurrentArgument], 'user');
         ++this.CurrentArgument;

         if (this.cmds[this.CurrentCommand].ArgQuery[this.CurrentArgument]) {
            if (this.cmds[this.CurrentCommand].ArgOptions[this.CurrentArgument]) {
               this.ParamAutocomplete();
            } else {
               this.DisableAutocomplete();
            }
            this.Log(input + ": " + this.cmds[this.CurrentCommand].ArgQuery[this.CurrentArgument]);
         } else {
            this.cmds[this.CurrentCommand].fcn(this.Args);
            this.GoToBeginState();
         }

      } else {
         this.Log('Logic error: ' + input);
      }
   }

   this.GoToBeginState = function () {
      this.InterpreterStatus = "begin";
      this.CurrentCommand = '';
      this.CurrentArgument = 0;
      this.ResetAutocomplete();
   }

   this.ParamAutocomplete = function () {
      this.inputJQ.autocomplete('option', 'source', this.cmds[this.CurrentCommand].ArgOptions[this.CurrentArgument]);
      this.inputJQ.autocomplete('option', 'minLength', 0);
      this.inputJQ.autocomplete('enable');
   }
   this.DisableAutocomplete = function () {
      this.inputJQ.autocomplete("disable");
   }
   this.ResetAutocomplete = function () {
      this.inputJQ.autocomplete('option', 'source', this.cmdlist);
      this.inputJQ.autocomplete('option', 'minLength', 2);
      this.inputJQ.autocomplete('enable');
      this.inputJQ.autocomplete('close');
   }

   this.Completer = function (input, values) {
      if (values) {
         for (var i = 0; i < values.length; ++i) {
            if (values[i].indexOf(input) == 0) {
               return values[i];
            }
         }
      }

      return input;
   }

   this.UP = function () {
      if (this.InterpreterStatus == "begin") {
         if (this.CommandHistory.length == 0) {
            return;
         } else if (this.CommandHistoryIndex < 1) {
            this.CommandHistoryIndex = -1;
            this.inputJQ.val('');
         } else if (this.CommandHistoryIndex == Infinity) {
            this.CommandHistoryIndex = this.CommandHistory.length - 1;
            this.inputJQ.val(this.CommandHistory[this.CommandHistoryIndex]);
         }
         else {
            --this.CommandHistoryIndex;
            this.inputJQ.val(this.CommandHistory[this.CommandHistoryIndex]);
         }
      }
   }

   this.DOWN = function () {
      if (this.InterpreterStatus == "begin") {
         if (this.CommandHistory.length == 0) {
            return;
         } else if (this.CommandHistoryIndex >= this.CommandHistory.length - 1) {
            this.CommandHistoryIndex = Infinity;
            this.inputJQ.val('');
         } else {
            ++this.CommandHistoryIndex;
            this.inputJQ.val(this.CommandHistory[this.CommandHistoryIndex]);
         }
      }
   }

   this.AddCommand = function (name, helptext, argquery, argoptions, fcn) {
      if (this.cmds[name]) {
         throw "Command " + name + " already exists.";
      }

      if (arguments.length != 5) {
         throw "Too few arguments: " + name;
      }

      this.cmds[name] = new Object();
      this.cmds[name].fcn = fcn;
      this.cmds[name].help = helptext;
      this.cmds[name].ArgQuery = argquery;
      this.cmds[name].ArgOptions = argoptions;

      CpyArray(Object.getOwnPropertyNames(this.cmds).sort(), this.cmdlist);
   }
}

