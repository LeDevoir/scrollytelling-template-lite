/**
 * scroller.js
 * ===========
 * Defines the logic used by the scroller. This script does not need external dependencies and uses native functions
 * of the browser.
 *
 * It is a lightweight version of the scroller script used in Le Devoir's articles.
 *
 * @author Antoine Béland
 * @licence MIT
 * @copyright Le Devoir, All rights reserved
 */

'use strict';

/**
 * Defines a step associated with a specific visualization. A step is activated or deactivated based on the scroll
 * position. This class is used by the scroller function.
 */
class ScrollerStep {
  /**
   * Initializes a new instance of ScrollerStep.
   *
   * @param el          The native element that represents the step in the HTML document.
   * @param index       The index of the step.
   * @param callback    The function to call when the step is activate.
   */
  constructor(el, index, callback) {
    this.el = el;
    this.index = index;
    this.callback = callback;
    this._isActivate = false;
  }

  /**
   * Activates the current step.
   *
   * @param scrollDirection   The current scroll direction.
   */
  activate(scrollDirection) {
    if (this._isActivate) {
      return;
    }
    this._isActivate = true;
    this.el.classList.add('active');
    this.callback(scrollDirection);
  }

  /**
   * Deactivates the current step.
   */
  deactivate() {
    if (!this._isActivate) {
      return;
    }
    this._isActivate = false;
    this.el.classList.remove('active');
  }
}

/**
 * Defines the scroll directions.
 *
 * @type {{down: string, up: string}}
 */
export const scrollDirections = {
  down: 'down',
  up: 'up'
};

/**
 * Defines the scroller to use with the Le Devoir's scrollytelling articles. Please see "README.md"
 * to know how to use it.
 *
 * /!\ Be sure to use the good CSS class names in your HTML file before to use the function.
 *
 * @param callbacks   A multi-dimensional array of callbacks to use with each step.
 * @returns {*}       The instance of the scroller.
 */
export function scroller(callbacks) {
  let _offsetTop = 0;
  let _offsetBottom = 0;

  let innerHeight = window.innerHeight;
  let isInitialized = false;
  let lastScroll = 0;
  let steps = [];
  let viz = [];
  let visibleSteps = [];

  const vizSections = document.querySelectorAll('.viz-section');
  if (vizSections.length !== callbacks.length) {
    throw new Error(`The number of viz sections (${vizSections.length}) mismatch with the length of the first ` +
      `dimension of the callbacks array (${callbacks.length}). Please, be sure that the two elements ` +
      `have the same size.`);
  }
  vizSections.forEach((vizSection, i) => {
    const sections = [...vizSection.querySelectorAll('section')];
    if (sections.length !== callbacks[i].length) {
      throw new Error(`The number of steps (${sections.length}) in the viz section #${i + 1} mismatch with the ` +
        `number of callbacks specified (${callbacks[i].length}) at the index "${i}". Please, be sure that the two ` +
        `elements have the same size.`);
    }
    steps = steps.concat(sections.map((e, j) => new ScrollerStep(e, `${i}-${j}`, callbacks[i][j])));
    viz = viz.concat(viz, vizSection.querySelector('.viz > *'));
  });

  /**
   * Updates the display based on scrollbar position.
   * @private
   */
  const _update = () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    steps.forEach(step => {
      // Check if the current step is in the viewport.
      const boundingRect = step.el.getBoundingClientRect();
      if (innerHeight - boundingRect.top - _offsetBottom > 0
        && boundingRect.top + boundingRect.height - _offsetTop > 0) {
        visibleSteps.push(step);
      } else {
        step.deactivate();
      }
    });

    // For the visible steps, choose the good one based on the scroll direction.
    visibleSteps.forEach((section, i) => {
      if (currentScroll >= lastScroll) { // Scroll down (↓)
        if (i === visibleSteps.length - 1) {
          section.activate(scrollDirections.down);
        } else {
          section.deactivate();
        }
      } else { // Scroll up (↑)
        if (i === 0) {
          section.activate(scrollDirections.up);
        } else {
          section.deactivate();
        }
      }
    });

    // Reset the variables for the next function call.
    visibleSteps = [];
    lastScroll = currentScroll;
  };

  const publicInterface = {
    /**
     * Initializes the scroller. Please note that this function can be only called once.
     *
     * @returns {*} The instance of the scroller.
     */
    initialize: () => {
      if (isInitialized) {
        throw new Error('The scroller is already initialized.');
      }
      isInitialized = true;
      window.addEventListener('scroll', _update);
      window.addEventListener('resize', () => {
        innerHeight = window.innerHeight;
      });
      if ((window.pageYOffset || document.documentElement.scrollTop) > 0) {
        _update();
      }
      return publicInterface;
    },

    /**
     * Gets or sets the bottom offset to use.
     *
     * @param offsetBottom
     * @returns {*} The instance of the scroller.
     */
    offsetBottom: offsetBottom => {
      if (offsetBottom === undefined) {
        return _offsetBottom;
      }
      if (!Number.isInteger(offsetBottom)) {
        throw new Error('The offset must be an integer number.');
      }
      _offsetBottom = offsetBottom;
      return publicInterface;
    },

    /**
     * Gets or sets the top offset to use.
     *
     * @param offsetTop
     * @returns {*} The instance of the scroller.
     */
    offsetTop: offsetTop => {
      if (offsetTop === undefined) {
        return _offsetTop;
      }
      if (!Number.isInteger(offsetTop)) {
        throw new Error('The offset must be an integer number.');
      }
      _offsetTop = offsetTop;
      return publicInterface;
    }
  };
  return publicInterface;
}
