// Functie voor het berekenen van Pasen
function pasen(jaar) {
  const a = jaar % 19;
  const b = Math.floor(jaar / 100);
  const c = jaar % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const maand = Math.floor((h + l - 7 * m + 114) / 31);
  const dag = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(jaar, maand - 1, dag);
}

// Functie voor het berekenen van de Herfstvakantie
function herfstVakantie(jaar) {
  let date = new Date(jaar, 10, 1); // 1 november
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0) {
    // zondag
    date.setDate(date.getDate() + 1);
  } else {
    date.setDate(date.getDate() - dayOfWeek + 1);
  }
  return {
    startDate: date,
    endDate: new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000),
    info: 'Herfstvakantie',
  };
}

// Functie voor het berekenen van de Kerstvakantie
function kerstVakantie(jaar) {
  let date = new Date(jaar, 11, 25); // 25 december
  const dayOfWeek = date.getDay();
  if (dayOfWeek > 5) {
    // zaterdag of zondag
    date.setDate(date.getDate() + (8 - dayOfWeek));
  } else {
    date.setDate(date.getDate() - dayOfWeek + 1);
  }
  return {
    startDate: date,
    endDate: new Date(date.getTime() + 13 * 24 * 60 * 60 * 1000),
    info: 'Kerstvakantie',
  };
}

// Functie voor het berekenen van de Krokusvakantie
function krokusVakantie(jaar) {
  let pasenDate = pasen(jaar);
  pasenDate.setDate(pasenDate.getDate() - 42); // 42 dagen voor Pasen
  let start = new Date(pasenDate);
  start.setDate(start.getDate() - (start.getDay() ? start.getDay() - 1 : 6)); // Start van de week
  return {
    startDate: start,
    endDate: new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000),
    info: 'Krokusvakantie',
  };
}

// Functie voor het berekenen van de Paasvakantie
function paasVakantie(jaar) {
  const pasenDate = pasen(jaar);
  let start;
  if (pasenDate.getMonth() === 2) {
    // Maart
    start = new Date(pasenDate.getTime() + 1 * 24 * 60 * 60 * 1000); // 1 dag na Pasen
  } else if (pasenDate > new Date(jaar, 3, 15)) {
    // Na 15 april
    start = new Date(pasenDate);
    start.setDate(start.getDate() - (start.getDay() ? start.getDay() - 1 : 6)); // Start van de week 1 week voor Pasen
  } else {
    // Voor 15 april
    for (let i = 1; i <= 7; i++) {
      start = new Date(jaar, 3, i);
      if (start.getDay() === 1) break; // Eerste maandag van april
    }
  }
  return {
    startDate: start,
    endDate: new Date(start.getTime() + 13 * 24 * 60 * 60 * 1000),
    info: 'Paasvakantie',
  };
}

// Functie voor het berekenen van de Hemelvaartvakantie
function hemelvaartVakantie(jaar) {
  const hemelvaartDate = new Date(
    pasen(jaar).getTime() + 39 * 24 * 60 * 60 * 1000
  ); // 39 dagen na Pasen
  const start = new Date(hemelvaartDate.getTime() + 1 * 24 * 60 * 60 * 1000); // De dag na Hemelvaart
  return {
    startDate: start,
    endDate: new Date(start.getTime() + 1 * 24 * 60 * 60 * 1000),
    info: 'Hemelvaart Schoolvakantie',
  };
}

// Functie voor het berekenen van de Zomervakantie
function zomerVakantie(jaar) {
  const start = new Date(jaar, 6, 1); // 1 juli
  const end = new Date(jaar, 7, 31); // 31 augustus
  return { startDate: start, endDate: end, info: 'Zomervakantie' };
}

// Functie voor het berekenen van de Kerstvakantie voor het tweede deel van het vorige jaar
function kerstVakantieVorigeJaar(jaar) {
  const start = new Date(jaar - 1, 11, 25); // 25 december van het vorige jaar
  return {
    startDate: start,
    endDate: new Date(start.getTime() + 13 * 24 * 60 * 60 * 1000),
    info: 'Kerstvakantie',
  };
}

// Functie voor het berekenen van alle schoolvakanties voor een kalenderjaar
function schoolVakantiesKalenderjaar(jaar) {
  const vakanties = [];
  const kerstVakantiePrev = kerstVakantieVorigeJaar(jaar);

  // Voeg het overlopende deel van de kerstvakantie van het vorige jaar toe (alleen januari)
  if (kerstVakantiePrev.endDate.getFullYear() === jaar) {
    vakanties.push({
      startDate: new Date(jaar, 0, 1),
      endDate: kerstVakantiePrev.endDate,
      info: kerstVakantiePrev.info,
    });
  }

  vakanties.push(krokusVakantie(jaar));
  vakanties.push(paasVakantie(jaar));
  vakanties.push(hemelvaartVakantie(jaar));
  vakanties.push(zomerVakantie(jaar));
  vakanties.push(herfstVakantie(jaar));

  const kerstVakantieCurrent = kerstVakantie(jaar);

  // Voeg het deel van de kerstvakantie van het huidige jaar toe (alleen december)
  if (kerstVakantieCurrent.startDate.getFullYear() === jaar) {
    vakanties.push(kerstVakantieCurrent);
  } else {
    vakanties.push({
      startDate: kerstVakantieCurrent.startDate,
      endDate: new Date(jaar, 11, 31),
      info: kerstVakantieCurrent.info,
    });
  }

  return vakanties;
}

// Functie voor het berekenen van de officiële Belgische feestdagen
function feestdagen(jaar) {
  const pasenDate = pasen(jaar);
  const paasmaandag = new Date(pasenDate.getTime() + 1 * 24 * 60 * 60 * 1000);
  const hemelvaart = new Date(pasenDate.getTime() + 39 * 24 * 60 * 60 * 1000);
  const pinksteren = new Date(pasenDate.getTime() + 49 * 24 * 60 * 60 * 1000);
  const pinkstermaandag = new Date(
    pinksteren.getTime() + 1 * 24 * 60 * 60 * 1000
  );

  return [
    { datum: new Date(jaar, 0, 1), info: 'Nieuwjaar' }, // 1 januari
    { datum: paasmaandag, info: 'Paasmaandag' }, // Paasmaandag
    { datum: new Date(jaar, 4, 1), info: 'Dag van de Arbeid' }, // 1 mei
    { datum: hemelvaart, info: 'O.L.H. Hemelvaart' }, // Hemelvaart
    { datum: pinkstermaandag, info: 'Pinkstermaandag' }, // Pinkstermaandag
    { datum: new Date(jaar, 6, 21), info: 'Nationale Feestdag' }, // 21 juli
    { datum: new Date(jaar, 7, 15), info: 'O.L.V. Hemelvaart' }, // 15 augustus
    { datum: new Date(jaar, 10, 1), info: 'Allerheiligen' }, // 1 november
    { datum: new Date(jaar, 10, 11), info: 'Wapenstilstand' }, // 11 november
    { datum: new Date(jaar, 11, 25), info: 'Kerstmis' }, // 25 december
  ];
}

// Exports
export {
  pasen,
  herfstVakantie,
  kerstVakantie,
  krokusVakantie,
  paasVakantie,
  hemelvaartVakantie,
  zomerVakantie,
  schoolVakantiesKalenderjaar,
  feestdagen,
};
