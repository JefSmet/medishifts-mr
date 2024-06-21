import React from "react";
// Importeer hier de componenten die je wilt testen
// bijvoorbeeld: import MyComponent from './components/MyComponent';
import MonthYearSelector from "./components/MonthYearSelector";
import MonthView from "./components/MonthView";
import TestComponent from "./components/TestComponent";

const events = [
  {
    id: 1,
    name: "Design review",
    time: "10AM",
    datetime: "2024-06-04T10:00",
    href: "#",
  },
  {
    id: 2,
    name: "Sales meeting",
    time: "2PM",
    datetime: "2024-06-04T14:00",
    href: "#",
  },
  {
    id: 3,
    name: "Sales meeting",
    time: "2PM",
    datetime: "2024-06-04T14:00",
    href: "#",
  },
  {
    id: 4,
    name: "Sales meeting",
    time: "2PM",
    datetime: "2024-06-04T14:00",
    href: "#",
  },
  {
    id: 5,
    name: "Sales meeting",
    time: "2PM",
    datetime: "2024-06-04T14:00",
    href: "#",
  },
  {
    id: 6,
    name: "Sales meeting",
    time: "2PM",
    datetime: "2024-06-04T14:00",
    href: "#",
  },
  {
    id: 7,
    name: "Sales meeting",
    time: "2PM",
    datetime: "2024-06-04T14:00",
    href: "#",
  },
  {
    id: 8,
    name: "Sales meeting",
    time: "2PM",
    datetime: "2024-06-04T14:00",
    href: "#",
  },
  {
    id: 9,
    name: "Sales meeting",
    time: "2PM",
    datetime: "2024-06-04T14:00",
    href: "#",
  },
  {
    id: 10,
    name: "Sales meeting",
    time: "2PM",
    datetime: "2024-06-04T14:00",
    href: "#",
  },
  {
    id: 11,
    name: "Sales meeting",
    time: "2PM",
    datetime: "2024-06-04T14:00",
    href: "#",
  },
];
const TestApp = () => {
  return (
    <div>
      <MonthView events={events} />
    </div>
  );
};

export default TestApp;
