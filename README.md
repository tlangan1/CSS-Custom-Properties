# [Dynamic CSS with Custom Properties (AKA CSS Variables)](https://frontendmasters.com/courses/css-variables/)

## Notes:

1. I should study [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).
1. As of 8/25/2023 there is no way to unregister a CSS custom property. Search for "unregister properties" in [this](https://drafts.css-houdini.org/css-properties-values-api/) document to see the reference in the Houdini draft at the W3C.
1. The `currentcolor` keyword is interesting. It resolves to the value of the color property for the target of the rule it is used in. For example,
   ```
   #myDIV {
       color: blue; /* Blue text color */
       border: 10px solid currentcolor; /* Blue border color */
   }
   ```
1. I should learn a little about `lch` colors. They apparently provide a wider spectrum than `hsl` and other color types.
1. An easy way to test the browser behavior when an unsupported feature is used is to just make one up like the `tom()` function.
1. I used the [windows sandbox](https://www.thewindowsclub.com/windows-sandbox) to download and install an old version of Chrome from [this](https://www.slimjet.com/chrome/google-chrome-old-version.php) website. This technique may come in handy in the future as you cannot have two different versions of Chrome installed at the same time.

## Inheritance & Fallbacks

### Inheritance

1. It is crucially important to know that custom properties (AKA CSS variables) obey the same inheritance rules as other CSS properties.
1. For example, consider a CSS variable defined on some element in the DOM with a given value. This is the value that is inherited by this elements descendants; however, if a descendant element reassigns this variable another value then that is the value inherited by its descendants similar to variable shadowing in JavaScript. The original variable value is retained in that portion of the DOM above the reassignment and the new value is only seen in that portion of the DOM that is at and below the reassignment.

### Creating Style Hooks

1. Lea illustrates how CSS custom properties provide a great mechanism for a web component library to expose styling capabilities to the users of the library. See `Inheritance and Fallbacks/style-hooks.html` for an example of this.
1. She also demonstrates the use of the ::part() pseudo element documented [here](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_shadow_parts) as another mechanism with which a web component library can expose styling to the user. Again, see `Inheritance and Fallbacks/style-hooks.html` for an example of this.
1. Custom properties are inherited across shadow DOM boundaries.
1. A shadow DOM is a DOM tree attached to an element where the internals of this tree is hidden from JavaScript and CSS running in the page.

### Fallbacks

1. The `var` function in CSS actually accepts two parameters. The first is the CSS variable being referenced and the second is a default value that can be used by the browser in the event that the CSS variable does not have a value at that point in the DOM. The syntax is as follows:
   ```
   var([some CSS custom property name], [some value])
   ```
1. See `Inheritance and Fallbacks/fallback-images.html` for some examples. Also, note this statement in fallback.css.
   ```
   @import url("fallback-images.css");
   ```
1. However, since the var function only makes sense in the context of referencing a custom property in the scope of a CSS rule it only has relevance `in the scope of a rule`.
1. The @property is a more powerful mechanism with which to provide a default value for a custom property because it exists `outside the scope of a rule`, and as such, is available everywhere in the DOM. The syntax is as follows:
   ```
   @property [property name] {
       syntax: "<[some accepted syntax name]>";
       inherits: [true or false];
       initial-value: [a value that may include units if necessary]
   }
   ```
   Consider the following examples.
   ```
   @property --row-count {
       syntax: "<number>";
       inherits: true;
       initial-value: 0;
   }
   @property --rotate {
       syntax: "<angle>";
       inherits: false;
       initial-value: 0deg;
   }
   @property --border-color {
       syntax: "<color>";
       inherits: false;
       initial-value: skyblue;
   }
   ```
1. At the end of the `Fallbacks` subsection of the `Inheritance & Fallbacks` section Lea illustrates how to check if a browser supports the @property at rule. She first shows that one can not use the `@supports` rule to do this. See [@supports](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports) for more information about this rule.
1. I discovered a discussion [here](https://github.com/w3c/csswg-drafts/issues/2463#issuecomment-1016720310) concerning the possibility of adding `at-rule` function with syntax `at-rule(@keyword)` to enhance @supports to test support for
   `at rules`.

### DRY Fallback Strategies

1. Custom properties can be very useful as fallbacks. Instead of duplicating a fallback value in multiple places in your CSS, use a custom property to hold the fallback value and use that custom property in those places instead. Using this strategy is much more maintainable. If you want to change the fallback value you do so in only one place, where it is assigned to the custom property.
1. If the fallback is always the same throughout the application then registering the property with `@property` is ideal.
1. However, I discovered a weird behavior that occurs when you attempt to override a registered property using the var() function with a custom property that is not defined. In this case the initial-value of the registered property is ignored as if the browser aborts when trying to parse the CSS statement. See `Inheritance and Fallbacks/fallback-DRY.html` for examples.
1. There is also an example of the `pseudo-private` fallback strategy in the bottom paragraph of the page.
1. Lea points out something I had already concluded. If you are having a problem with an @property rule it is virtually impossible to conclude the rule is invalid for some reason but if you use the JavaScript registerProperty API and you will get feedback in the console if there is a problem.

## Invalid Values & Custom Properties Practice

### Invalid Values & Computed Values

1. The browser processes CSS in multiple stages, the most important of which are `parse time`, `computed value time` and `used value time`
1. Parse Time: This is the initial stage of CSS resolution. This is a one and done operation. It is not redone when CSS values change or the window dimensions change, etc. This is when duplicate properties in the same rule are removed and when shortcut properties are expanded.
1. Computed Value Time: This is an intermediate stage of CSS resolution. This is when most relative values are resolved to px
1. Used Value Time: This is the final stage of CSS resolution. This is when `most` values obtain their actual value.
1. The concept of `Invalid At Computed Value Time` or `IACVT` for short is the name given to the situation at computed value time when the value on the right hand side of a property assignment is not valid for that property. The browser will treat this situation as being equivalent to the assignment of the `unset` keyword.
1. The `unset` CSS value is the same as `initial` for non-inherited properties and `inherit` for inherited properties.
1. It is important to understand the difference between how a browser handles invalid at computed value time and an unsupported CSS feature. An unsupported feature is thrown away at parse time and this makes a big difference. Consider the following two examples:

   ```
   target-1 {
       --color: 2px;
       background: red;
       background: --color;
   }

   target-2 {
       background: red;
       background: tom(4)
   }
   ```

   In the first example the `background: red` statement is thrown away at parse time; hence, at computed value time --color has an invalid value of tom(4) and that will result in the default background color, `transparent`. In the second example the `background: tom(4)` is thrown away at parse time because as of 2023 tom() is not a supported feature in any browser and the background will be `red`. See parse-vs-computed-time.html .test-2 and .test-3 divs that illustrate this.

1. Note that a custom property is even more flexible than a variable in JavaScript and, as such, can be assigned anything. The browser makes no attempt at parse time to `validate` the value being assigned. In the example above the browser accepts `--color: tom(4)`.
1. See `parse-vs-computed-time.html` in the `Invalid Values and Computed Values` folder for an example of how differently the browser handles the use of a custom property to assign an invalid value to a property as opposed to simply assigning the invalid value to the property.

   ```
   @property --custom-property-color {
        syntax: "<color>";
        inherits: true;
        initial-value: skyblue;
    }

    div {
        height: 30vh;
        margin-bottom: 2vh;
    }

    .test-1 {
        /* *** these two lines result in identical behavior *** */
        --custom-property-color: lch(100% 100 0px);
        /* --custom-property-color: g(100% 100 0px); */
        background: red;
        background: var(--custom-property-color);
    }

   .test-2 {
        height: 50vh;
        width: 100vw;
        --color: lch(100% 100 0px);
        background: red;
        background: var(--color);
   }

   .test-3 {
        height: 50vh;
        width: 100vw;
        background: red;
        background: lch(100% 100 0px);
   }
   ```

   The `test-2` div has a transparent background while the `test-3` div has a red background even though the two sets of code might be expected to behave the same way. This is because the syntax of custom properties is checked at computed value time, not at parse time. The `test-1` div behaves the same as the `test-2` div because registered properties, like custom properties are have their syntax checked at computed-value time not parse time.

1. Performance considerations motivated the behavior illustrated in the `parse-vs-computed-time` example. If custom properties values were verified by the browser at then the browser would have to parse the CSS every time the value of a custom variable changed.
1. The most important observation I made concerning custom properties is how they behave as RHS values. Since a custom property is a variable, the browser will allow it to be assigned anything as the browser does not know how and when it will be used. See one-custom-variable-does-everything.html for an extreme example of this. In this example the custom property --some-custom-property has the following values:
   ```
   --some-custom-property: red;
   --some-custom-property: 50vh;
   --some-custom-property: 20px 50px 50px 30px;
   --some-custom-property: 2s;
   ```

### @supports & Custom Properties

1.  Historically, the CSS cascade provided a fallback strategy that was nothing more than a sequence of property assignments as follows:
    ```
    [some property]: [feature browsers support]
    [some property]: [feature not all browsers support]
    [some property]: [feature even fewer browsers support]
    ```
    The browser would apply the last one it could support
1.  The introduction of custom properties breaks this cascade strategy. Consider the following CSS:
    ```
    [some property]: [feature all browsers support]
    [some property]: [feature not all browsers support]
    [some property]: [feature some browsers don't support including a custom property]
    ```
    In this example the last entry contains a reference to a custom property within a feature. Even browsers that don't support the feature will throw away the first two assignments.
1.  See parse-vs-computed-time-with-@supports in the `Invalid Values and Computed Values` folder for an example. in test1
1.  This example also illustrates how @supports comes to the rescue in this scenario. The @supports syntax is as follows:

    ```
    @supports ([some css property assignment]) {
        [some selector]: [some css property assignment]
    }
    ```

    For example,

    ```
    @supports (color: lch(50 230 0)) {
        :root {
            --test-2-color: lch(50 230 0)
        }
    }
    ```

    The @supports at rule forces the browser to evaluate a property assignment at parse time so that one can know the custom property values will be syntactically valid (at least for one value) at computed value time.

1.  Lea made an interesting observation which I find to be more of a bug than a reasonable behavior. See unsupported-feature-using-custom-property.html in the `Invalid Values and Computed Values` folder for an example. The associated CSS file contains the following code:

    ```
    .test-1 {
        font-size: 20px;
        font-size: tom(24px, 100 * var(--font-scale), 30px);
    }

    .test-3 {
        font-size: 20px;
        font-size: tom(24px);
    }
    ```

    In the case of `.test-1` the browser throws away the `font-size: 20px`
