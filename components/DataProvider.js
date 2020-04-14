import { createContext } from "react";
const DataContext = createContext({
  data: [],
  getClass: () => {},
  addClass: () => {},
  removeClass: () => {},
  addWeight: () => {},
  getWeight: () => {},
  modifyGrade: () => {},
});

export default DataContext;
