export const shippingZones = {
  1: {
    additionalFee: 0,
    markets: ["GB"],
    daysToShip: 2,
  },
  2: {
    additionalFee: 10,
    markets: ["IR"],
    daysToShip: 3,
  },
  3: {
    additionalFee: 10,
    markets: ["FR", "DE"],
    daysToShip: 3,
  },
};

/* Sends a request to an API that returns location data by api*/
export const getIpData = async () => {
  const response = await fetch("https://ipapi.co/json/");
  const data = await response.json();
  return data;
};

/* Calculates the relevant shipping zone for a given country code */
export const getZone = (countryCode: string) => {
  const activeZoneIndex = Object.keys(shippingZones).filter((i) => {
    return shippingZones[i].markets.includes(countryCode);
  });

  return activeZoneIndex ? shippingZones[activeZoneIndex] : {};
};

/*
  Adds a variable amount of working days to todays date
  Todo: take into consideration bank holidays
*/
export const addWorkingDays = (daysToAdd: number) => {
  const date = new Date();

  for (let i = 0; i < daysToAdd; i++) {
    date.setDate(date.getDate() + 1);
    const dayOfWeek = date.getDay();

    if (dayOfWeek == 0) {
      // sunday, add another day to Monday
      date.setDate(date.getDate() + 1);
    }

    if (dayOfWeek == 6) {
      // saturday, add another two days to get to Monday
      date.setDate(date.getDate() + 2);
    }
  }

  return date;
};
