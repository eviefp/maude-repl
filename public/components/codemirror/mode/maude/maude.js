/* Example definition of a simple mode that understands a subset of
 * JavaScript:
 */

CodeMirror.defineSimpleMode("maude", {
  // The start state contains the rules that are intially used
  start: [
    // The regex matches the token, the token property contains the type
    {regex: /"(?:[^\\]|\\.)*?"/, token: "string"},
    
    {regex: /is\b/, token: "keyword", indent: true},
    {regex: /endfm\b/, token: "keyword", dedent: true, dedentIfLineStart: true},
    
    {regex: /(?:sort|subsort|subsorts|fmod|op|ops|sorts|var|ceq|vars|eq|in|assoc|comm|prec)\b/,
     token: "keyword"},

    {regex: /(reduce|parse)\s/, token: "atom"},
    {regex: /red\s/, token: "atom"},

    {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
     token: "number"},

    {regex: /\*\*\*.*/, token: "comment"},

    {regex: /\/(?:[^\\]|\\.)*?\//, token: "variable-3"},
    // A next property will cause the mode to move to a different state
    {regex: /[-+\/*\.=<>!]+/, token: "operator"},
    // indent and dedent properties guide autoindentation
    // {regex: /.*is/, indent: true},
    {regex: /[a-z$][A-Z$][\w$]*/, token: "variable-2"},
  ],
  // The multi-line comment state.
  comment: [
    {regex: /.*?\*\//, token: "comment", next: "start"},
    {regex: /.*/, token: "comment"}
  ],
  // The meta property contains global information about the mode. It
  // can contain properties like lineComment, which are supported by
  // all modes, and also directives like dontIndentStates, which are
  // specific to simple modes.
  meta: {
    dontIndentStates: ["comment"],
    lineComment: "***"
  }
});
