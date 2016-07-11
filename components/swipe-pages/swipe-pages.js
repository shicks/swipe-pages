// Copyright (c) 2014 Hassan Hayat <hassan.hayat7@gmail.com>
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

(function(){
  'use strict';

  var isWebkit = document.body.style.webkitTransform !== undefined;

  var getPositionArray = function(length) {
    var a = [];
    for (var i = 0; i < length; i++) {
      a[i] = (i * 100);
    }
    return a;
  };

  var resetAnimations = function(element) {
    setTransition("", element);
  };

  var setAnimationDuration = function(duration, element, easingFunction) {
    easingFunction = easingFunction || "ease-out";
    var transition =
        (isWebkit ? "-webkit-" : "") + "transform " +
        duration.toString() + "s " + easingFunction;
    setTransition(transition, element);
  };

  var setTransition = function(transition, element) {
    if (isWebkit){
      element.$.pagesContainer.style.webkitTransition = transition;
    } else {
      element.$.pagesContainer.style.transition = transition;
    }
  };

  var setTransform = function(transform, element) {
    if (isWebkit) {
      element.$.pagesContainer.style.webkitTransform = transform;
    } else {
      element.$.pagesContainer.style.transform = transform;
    }
  };

  var moveToPosition = function(position, element) {
    var transform = "translateX(" + position.toString() + "%)";
    setTransform(transform, element);
  };

  var moveToPage = function(pageNumber, element) {
    var position = -pageNumber * 100 / element.pageCount;
    moveToPosition(position, element);
  };

  Polymer({
    is: 'swipe-pages',

    behaviors: [
      Polymer.IronResizableBehavior,
      Polymer.IronSelectableBehavior
    ],

    properties: {
      threshold: Number,
      transitionDuration: Number
    },

    hostAttributes: {
      threshold: 0.3,
      transitionDuration: 0.3
    },

    listeners: {
      'track': 'trackHandler'
    },

    observers: [
      'selectedChanged(selected, items)'
    ],

    get pageCount() {
      return Polymer.dom(this.$.pages).getDistributedNodes().length;
    },

    get pages() {
      return Polymer.dom(this.$.pages).getDistributedNodes();;
    },

    get pageWidth() {
      return this.getBoundingClientRect().width;
    },

    resetPositions: function() {
      var positionArray = getPositionArray(this.pageCount);
      for (var i = 0; i < this.pageCount; i++){
        this.pages[i].style.left =
            ""  + (positionArray[i] / this.pageCount) + "%";
      }
    },
    resetWidths: function() {
      this.$.pagesContainer.style.width = "" + (100 * this.pageCount) + "%";
      for (var i = 0; i < this.pageCount; i++){
        this.pages[i].style.width = "" + (100 / this.pageCount) + "%";
      }
    },

    trackHandler: function(event) {
      var index = this.indexOf(this.selectedItem);
      var isFirstPage = (index === 0);
      var isLastPage  = (index === (this.pageCount - 1));
      var swipingLeft = (event.detail.dx < 0);
      var swipingRight = (event.detail.dx > 0);
      var swipingOutOfBounds =
          (swipingRight && isFirstPage) || (swipingLeft && isLastPage);
      var thresholdWasCrossed =
          (Math.abs(event.detail.dx) / this.pageWidth) > this.threshold;
          
      switch (event.detail.state) {
        case 'start':

          resetAnimations(this);
          break;

        case 'track':

          if (!swipingOutOfBounds) {
            var position =
                -(index - (event.detail.dx / this.pageWidth)) * 100 /
                this.pageCount;
            moveToPosition(position, this);
          }
          break;

        case 'end':

          setAnimationDuration(this.getAttribute('transitionDuration'), this);
          if (thresholdWasCrossed) {
            // Switch page
            if (swipingRight && !isFirstPage) this.selectPrevious();
            if (swipingLeft && !isLastPage) this.selectNext();
          } else {
            // Otherwise reset
            moveToPage(index, this);
          }
          break;
      }
    },

    selectedChanged: function() {
      if (!this.items.length) return;
      // Note: we need to do this later since the callback fires
      // before this.selectedItem is set.
      // TODO(sdh): consider using Promise.resolve().then()
      window.setTimeout(function() {
        var newValue = this.indexOf(this.selectedItem);
        if (newValue < 0) {
          throw new Error("Page " + this.selectedItem + " not defined.");
        }
        moveToPage(newValue, this);
      }.bind(this), 0);
    },

    ready: function(){
      this.resetPositions();
      this.resetWidths();
    }
  });
})();


