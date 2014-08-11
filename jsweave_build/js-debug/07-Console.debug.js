function Cmdline(console_div, inputlineJQ) {
   var parent = this; //for callbacks
   //output div
   this.cnsl = console_div;
   this.cnsl.innerHTML = '';

   //input text input as JQ object
   this.inputJQ = inputlineJQ;

   this.InterpreterStatus = "begin"; //"begin", "param"
   this.CurrentCommand = ''; //NATIVE: ohje => help
   this.CurrentArgument = 0; //LOCAL: kyllä => kyllä
   this.Args = [];

   this.NatCmds = new Array();
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
         parent.Log(NatToLoc[Lang]['cancel']);
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

      var CurrentLocalCommand = '';
      if (NatToLocCmd[Lang][this.CurrentCommand]) {
         CurrentLocalCommand = NatToLocCmd[Lang][this.CurrentCommand].cmd;
      }

      if (type == 'normal') {
         start = CurrentLocalCommand + this.normallinestart;
         end = this.normallineend;

      } else if (type == 'user') {
         start = CurrentLocalCommand + this.userlinestart;
         end = this.userlineend;
      }
      else if (type == 'error') {
         start = CurrentLocalCommand + this.errorlinestart;
         end = this.errorlineend;
      } else if (type == 'working') {
         start = CurrentLocalCommand + this.workinglinestart;
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
      if (this.InterpreterStatus == "begin" && !this.cmds[LocToNatCmd[Lang][input]]) {
         var guess = this.Completer(input, LocCmds[Lang]);
         if (this.cmds[LocToNatCmd[Lang][guess]]) {
            this.Interpret(guess);
         } else {
            this.Log(input, 'user');
            this.Log(NatToLoc[Lang]['unknowncmd'] + input, 'error');
         }
      } else if (this.InterpreterStatus == "begin") {
         if (this.CommandHistory.length == 0 || this.CommandHistory[this.CommandHistory.length - 1] != LocToNatCmd[Lang][input]) {
            this.CommandHistory.push(LocToNatCmd[Lang][input]);
            this.CommandHistoryIndex = Infinity;
            if (this.CommandHistory.length > this.CommandsToSave) {
               this.CommandHistory.splice(0, this.CommandHistory.length - this.CommandsToSave);
            }
         }

         this.Log(input, 'user');
         this.InterpreterStatus = "param";
         this.CurrentCommand = LocToNatCmd[Lang][input];
         this.CurrentArgument = 0;

         if (NatToLocCmd[Lang][this.CurrentCommand].argquery[this.CurrentArgument]) {
            if (NatToLocCmd[Lang][this.CurrentCommand].argoptions[this.CurrentArgument]) {
               this.ParamAutocomplete();
            } else {
               this.DisableAutocomplete();
            }
            this.Log(NatToLocCmd[Lang][this.CurrentCommand].argquery[this.CurrentArgument]);
         } else {
            this.cmds[this.CurrentCommand].fcn();
            this.GoToBeginState();
         }
      } else if (this.InterpreterStatus == "param") {
         this.Args[this.CurrentArgument] = this.Completer(input, NatToLocCmd[Lang][this.CurrentCommand].argoptions[this.CurrentArgument]);
         this.Log(this.Args[this.CurrentArgument], 'user');
         ++this.CurrentArgument;

         if (NatToLocCmd[Lang][this.CurrentCommand].argquery[this.CurrentArgument]) {
            if (NatToLocCmd[Lang][this.CurrentCommand].argoptions[this.CurrentArgument]) {
               this.ParamAutocomplete();
            } else {
               this.DisableAutocomplete();
            }
            this.Log(input + ": " + NatToLocCmd[Lang][this.CurrentCommand].argquery[this.CurrentArgument]);
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
      this.inputJQ.autocomplete('option', 'source', NatToLocCmd[Lang][this.CurrentCommand].argoptions[this.CurrentArgument]);
      this.inputJQ.autocomplete('option', 'minLength', 0);
      this.inputJQ.autocomplete('enable');
   }
   this.DisableAutocomplete = function () {
      this.inputJQ.autocomplete("disable");
   }
   this.ResetAutocomplete = function () {
      this.inputJQ.autocomplete('option', 'source', LocCmds[Lang]);
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
            this.inputJQ.val(NatToLocCmd[Lang][this.CommandHistory[this.CommandHistoryIndex]].cmd);
         }
         else {
            --this.CommandHistoryIndex;
            this.inputJQ.val(NatToLocCmd[Lang][this.CommandHistory[this.CommandHistoryIndex]].cmd);
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
            this.inputJQ.val(NatToLocCmd[Lang][this.CommandHistory[this.CommandHistoryIndex]].cmd);
         }
      }
   }

   this.AddCommand = function (name, argoptions, fcn) {
      if (this.cmds[name]) {
         throw "Command " + name + " already exists.";
      }

      if (arguments.length != 3) {
         throw "Too few arguments: " + name;
      }

      this.cmds[name] = new Object();
      this.cmds[name].argoptions = argoptions;
      this.cmds[name].fcn = fcn;

      CpyArray(Object.getOwnPropertyNames(this.cmds).sort(), this.NatCmds);
   }
}

