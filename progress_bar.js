/* progress_bar.js -- A progress bar widget for Conkeror

 Copyright (c) 2014, Jon Yamokoski <code@jonyamo.us>

 Permission to use, copy, modify, and/or distribute this software for any
 purpose with or without fee is hereby granted, provided that the above
 copyright notice and this permission notice appear in all copies.

 THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

 */

function progress_bar_widget (window) {
    text_widget.call(this, window);
    this.add_hook("content_buffer_started_loading_hook",
                  method_caller(this, this.start));
    this.add_hook("content_buffer_progress_change_hook",
                  method_caller(this, this.update));
    this.add_hook("content_buffer_finished_loading_hook",
                  method_caller(this, this.finish));
}

progress_bar_widget.prototype = {
    constructor: progress_bar_widget,
    __proto__: text_widget.prototype,
    class_name: "progress-bar-widget",

    start_time: null,
    pad_len: 10,

    start: function () {
        this.start_time = new Date;
        this.view.text = "[Waiting...]  0.0s";
    },

    update: function (buffer, request, curSelf, maxSelf, curTotal, maxTotal) {
        if (typeof buffer == 'undefined')
            return;

        if (maxTotal < 1)
            return;

        // https://github.com/tj/node-progress
        var ratio = curTotal / maxTotal;
        ratio = Math.min(Math.max(ratio, 0), 1);

        var percent = ratio * 100;
        var elapsed = new Date - this.start_time;
        elapsed = isNaN(elapsed) ? "0.0" : (elapsed / 1000).toFixed(1);

        var percent_str = "#".repeat(percent.toFixed(0) / 10);
        if (percent_str.length < this.pad_len)
            percent_str = percent_str + Array(this.pad_len + 1 - percent_str.length).join(" ");
        var elapsed_str = elapsed + "s";

        this.view.text = "[" + percent_str + "]  " + elapsed_str;
    },

    finish: function () {
        this.start_time = null;
        this.view.text = "";
    }
};

add_hook("mode_line_hook", mode_line_adder(progress_bar_widget));
