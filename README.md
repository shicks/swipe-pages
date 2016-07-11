swipe-pages
================

See the [component page](http://shicks.github.io/swipe-pages) for
more information.

Note that this version is specifically **not compatible** with the
version it was forked from.  Specifically, the `<swipe-page>`
element has been removed and compatibility with `<iron-pages>`
has been added.


## TODO

- [ ] Allow wraparound scrolling via some clever tricks
- [ ] Save and restore the scroll vertical position of each page
- [x] Make element play nicer with the polymer core-elements
- [x] Include sane defaults for hardware acceleration (translateZ hack in the right places)
- [ ] Make a nicer demo with more features to better explain the element
- [ ] Add option to reverse direction for rtl languages
- [ ] Do some more rigorous testing to ensure stability!!!
- [ ] Allow for individual pages to be created dynamically. 


## Installation
With Bower:

```shell
bower install shicks/swipe-pages
```

## Basic Example

```html
<swipe-pages selected="foo" attr-for-selected="name">
  <div name="foo">I am page 0</div>
  <div name="bar">I am page 1</div>
  <div name="baz">I am page 2</div>
</swipe-pages>
```

