(function () {
  "use strict";

  /* ---------- Machine-readable lines (ICAO 9303 TD3 layout, 2 x 44 chars) ---------- */
  var WEIGHTS = [7, 3, 1];

  function charValue(ch) {
    if (ch >= "0" && ch <= "9") return ch.charCodeAt(0) - 48;
    if (ch >= "A" && ch <= "Z") return ch.charCodeAt(0) - 55;
    return 0; // "<" counts as zero
  }

  function checkDigit(str) {
    var sum = 0;
    for (var i = 0; i < str.length; i++) sum += charValue(str[i]) * WEIGHTS[i % 3];
    return String(sum % 10);
  }

  function pad(str, len) {
    str = str.replace(/[^A-Z0-9<]/g, "<");
    return (str + new Array(len + 1).join("<")).slice(0, len);
  }

  function clean(str) {
    return String(str || "").toUpperCase().replace(/[^A-Z0-9 ]/g, "").trim().replace(/ +/g, "<");
  }

  function buildMrz(d) {
    var country = pad(clean(d.country), 3);
    var line1 = pad("U<" + country + clean(d.surname) + "<<" + clean(d.given), 44);

    var number = pad(clean(d.number), 9);
    var since = pad(d.since, 6);
    var updated = pad(d.updated, 6);
    var personal = pad("", 14);

    var line2 =
      number + checkDigit(number) +
      country +
      since + checkDigit(since) +
      "<" +
      updated + checkDigit(updated) +
      personal + "0";

    var composite = line2.slice(0, 10) + line2.slice(13, 20) + line2.slice(21, 43);
    line2 += checkDigit(composite);

    return [line1, line2];
  }

  /* One orchestrated moment: characters scramble, then lock in left to right. */
  function reveal(el, text, delay) {
    var glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<";
    var start = null;
    var perChar = 22; // ms between each character locking
    var total = text.length * perChar + 250;

    function frame(now) {
      if (start === null) start = now;
      var t = now - start;
      var locked = Math.floor(t / perChar);
      var out = "";
      for (var i = 0; i < text.length; i++) {
        out += i < locked ? text[i] : glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      el.textContent = out;
      if (t < total) requestAnimationFrame(frame);
      else el.textContent = text;
    }

    setTimeout(function () { requestAnimationFrame(frame); }, delay);
  }

  var card = document.querySelector(".card");
  if (card) {
    var lines = buildMrz(card.dataset);
    var els = card.querySelectorAll(".mrz__line");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    lines.forEach(function (text, i) {
      if (!els[i]) return;
      if (reduce) els[i].textContent = text;
      else {
        els[i].textContent = pad("", 44);
        reveal(els[i], text, 250 + i * 350);
      }
    });
  }

  /* ---------- Copy email ---------- */
  var copyBtn = document.querySelector(".copy");
  if (copyBtn) {
    var status = document.querySelector(".copy__status");
    var timer;

    function say(msg) {
      status.textContent = msg;
      clearTimeout(timer);
      timer = setTimeout(function () { status.textContent = ""; }, 2500);
    }

    copyBtn.addEventListener("click", function () {
      var text = copyBtn.dataset.copy;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { say("Copied"); },
          function () { say("Select the address to copy it"); }
        );
      } else {
        say("Select the address to copy it");
      }
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
