     ____                     __      __
    /\  _`\                  /\ \    /\ \                                       __
    \ \ \ \ \     __      ___\ \ \/'\\ \ \____    ___     ___      __    ___   /\_\    ____
     \ \  _ <'  /'__`\   /'___\ \ , < \ \ '__`\  / __`\ /' _ `\  /'__`\/' __`\ \/\ \  /',__\
      \ \ \ \ \/\ \ \.\_/\ \__/\ \ \\`\\ \ \ \ \/\ \ \ \/\ \/\ \/\  __//\ \/_/_ \ \ \/\__, `\
       \ \____/\ \__/.\_\ \____\\ \_\ \_\ \_,__/\ \____/\ \_\ \_\ \____\ \_\/\_\_\ \ \/\____/
        \/___/  \/__/\/_/\/____/ \/_/\/_/\/___/  \/___/  \/_/\/_/\/____/\/_/\/_/\ \_\ \/___/
                                                                               \ \____/
                                                                                \/___/
    (_'___________________________________________________________________________________'_)
    (_.———————————————————————————————————————————————————————————————————————————————————._)


[Backbone](https://github.com/jashkenas/backbone) supplies structure to JavaScript-heavy applications by providing models key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing application over a RESTful JSON interface.

Backboner only does some of these things, because many of them are done well by modern, modular libraries.

Backboner is intended for new projects, not as a drop-in replacement for Backbone.

####Backboner is Backbone, revised.

* No Backbone.Views. [React](https://github.com/facebook/react/) is a popular choice, but Backboner is entirely agnostic.

* No Backbone.Routes or Backbone.History. If you're using React, try [react-router-component](https://github.com/andreypopp/react-router-component).
Otherwise, check out the excellent [page.js](https://github.com/visionmedia/page.js). Backboner don't care.

* No [jQuery](https://github.com/jquery/jquery). Backboner uses [superagent](https://github.com/visionmedia/superagent) for Ajax.

* No [Underscore](https://github.com/jashkenas/underscore). Backboner uses [LoDash](https://github.com/lodash/lodash) instead.

* No callbacks. Callbacks are annoying, but jQuery's `options.success` and `options.error` are awful.
Backboner uses [bluebird](https://github.com/petkaantonov/bluebird) Promises instead.

* No Backbone.Events. Backboner uses [EventEmitter2](https://github.com/asyncly/EventEmitter2) derived from [Node](https://github.com/joyent/node) instead.

* No tests! Backboner is not recommended for production use.

Thanks to [TJ Holowaychuk](https://github.com/visionmedia) for superagent, [John-David Dalton](https://github.com/jdalton) for LoDash, [Petka Antonov](https://github.com/petkaantonov) for bluebird, and [Paolo Fragomeni](https://github.com/hij1nx) for EventEmitter2.

Special thanks to [Jeremy Ashkenas](https://github.com/jashkenas) for the original Backbone behind Backboner.