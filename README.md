# shwimple

 shwimple - a simple HTML writer

## TODO

- Implement `ShwimplePageBuilder` functions
  - Implement `renderPipe` functionality
- Implement `insertBefore`, `insertAfter`, `getParent` functions in `ShwimpleNode`
  - getParent -> always return top level node if already main parent node e.g. <html></html>
- Move `ShwimpleDocument.createBoilerplateDocument` to semantic HTML
