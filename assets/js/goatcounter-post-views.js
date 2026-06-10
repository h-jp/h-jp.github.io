(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setUnavailable(element) {
    element.textContent = "unavailable";
  }

  function getGoatCounterPath(element) {
    if (window.goatcounter && typeof window.goatcounter.get_data === "function") {
      try {
        var data = window.goatcounter.get_data();
        if (data && data.p) {
          return data.p;
        }
      } catch (error) {
        // Fall back to the rendered post URL below.
      }
    }

    return element.getAttribute("data-goatcounter-path") || window.location.pathname;
  }

  function fetchViewCount(element) {
    var code = (element.getAttribute("data-goatcounter-code") || "").trim();
    if (!code || code.indexOf("REPLACE_WITH") === 0 || !/^[A-Za-z0-9-]+$/.test(code)) {
      setUnavailable(element);
      return;
    }

    var path = getGoatCounterPath(element);
    var url = "https://" + code + ".goatcounter.com/counter/" + encodeURIComponent(path) + ".json";
    var request = new XMLHttpRequest();

    request.addEventListener("load", function () {
      if (request.status < 200 || request.status >= 300) {
        setUnavailable(element);
        return;
      }

      try {
        var response = JSON.parse(request.responseText);
        element.textContent = response.count || "unavailable";
      } catch (error) {
        setUnavailable(element);
      }
    });

    request.addEventListener("error", function () {
      setUnavailable(element);
    });

    request.open("GET", url);
    request.send();
  }

  function waitForGoatCounter(element) {
    var attempts = 0;
    var timer = window.setInterval(function () {
      attempts += 1;
      if ((window.goatcounter && typeof window.goatcounter.get_data === "function") || attempts >= 50) {
        window.clearInterval(timer);
        fetchViewCount(element);
      }
    }, 100);
  }

  ready(function () {
    var elements = document.querySelectorAll("[data-goatcounter-views]");
    for (var i = 0; i < elements.length; i += 1) {
      waitForGoatCounter(elements[i]);
    }
  });
})();
