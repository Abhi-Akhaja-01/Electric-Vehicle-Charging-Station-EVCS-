export const routes = {
  auth: {
    start: {
      name: "start",
      path: "start",
      options: {
        title: "Start",
      },
    },
    login: {
      name: "login",
      path: "login",
      options: {
        title: "Login",
      },
    },
    register: {
      name: "register",
      path: "register",
      options: {
        title: "Register",
      },
    },
  },
  home: {
    index: {
      name: "home",
      path: "home",
      options: {
        title: "Home",
      },
    },
  },
  station: {
    index: {
      name: "station",
      path: "station",
      options: {
        title: "Station",
      },
    },
  },
  stationDetails: {
    index: {
      name: "stationDetails",
      path: "stationDetails",
    },
  },
  slotBooking: {
    index: {
      name: "slotBooking",
      path: "slotBooking",
    },
  },
  myBooking: {
    index: {
      name: "myBooking",
      path: "myBooking",
    },
  },
  myPayments: {
    index: {
      name: "myPayments",
      path: "myPayments",
    },
  },
};

export function sectionToArray(section) {
  return Object.values(section);
}
