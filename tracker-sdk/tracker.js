console.log("Trackora SDK Loaded");
(function () {

  const Trackora = {

    apiUrl: "",

    init(config) {
      this.apiUrl = config.apiUrl;

      this.trackPageView();
      this.trackClicks();
    },

    getSessionId() {

      let sessionId = localStorage.getItem(
        "trackora_session"
      );

      if (!sessionId) {

        sessionId = crypto.randomUUID();

        localStorage.setItem(
          "trackora_session",
          sessionId
        );
      }

      return sessionId;
    },

    async sendEvent(eventData) {
        console.log("Sending Event:", eventData);

      try {

        await fetch(
          `${this.apiUrl}/api/events`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify(eventData),
          }
        );

      } catch (error) {

        console.log(error);
      }
    },

    trackPageView() {

      this.sendEvent({

        session_id: this.getSessionId(),

        event_type: "page_view",

        page_url: "/pricing",

        timestamp: new Date(),

        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },

        user_agent: navigator.userAgent,
      });
    },

    trackClicks() {

      document.addEventListener(
        "click",
        (e) => {

          this.sendEvent({

            session_id: this.getSessionId(),

            event_type: "click",

            page_url: window.location.pathname,

            timestamp: new Date(),

            coordinates: {
              x: e.clientX,
              y: e.clientY,
            },

            viewport: {
              width: window.innerWidth,
              height: window.innerHeight,
            },

            user_agent: navigator.userAgent,
          });
        }
      );
    },
  };

  window.Trackora = Trackora;

})();