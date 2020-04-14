import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./components/Home";
import WeightDetail from "./components/WeightDetail";
import ClassDetail from "./components/ClassDetail";
import data from "./assets/data.json";
import DataContext from "./components/DataProvider";

import * as eva from "@eva-design/eva";

import { ApplicationProvider } from "@ui-kitten/components";

const Stack = createStackNavigator();

const App = () => {
  const [state, setState] = useState([...data.classes]);

  const getClass = (id) => {
    return state.find((x) => x.id === Number(id));
  };

  const addClass = (name) => {
    setState([...state, newClass(name)]);
  };

  const removeClass = (classID) => {
    let newState = state.filter((ele) => {
      return ele.id != Number(classID);
    });
    setState([...newState]);
  };

  const newClass = (name) => {
    let aclass = {
      id: Math.floor(Math.random() * 1000000000),
      name: name,
      total_grade: 0,
      all_weights_combined: 0,
      weights: [],
    };
    return aclass;
  };

  const newWeight = (name, weight) => {
    let aweight = {
      id: Math.floor(Math.random() * 1000000000),
      weight_group: name,
      weight_percent: 0,
      weight_value: weight,
      grades: [],
    };
    return aweight;
  };

  const addWeight = (name, weight, classID) => {
    let index = state.findIndex((x) => x.id === classID);
    let newState = state;
    let currClass = getClass(classID);
    currClass.weights.push(newWeight(name, weight));
    currClass.all_weights_combined = currClass.all_weights_combined + weight;
    newState.splice(index, 1, currClass);
    setState([...newState]);
  };

  const getWeight = (weightID, classID) => {
    let currClass = getClass(classID);
    return currClass.weights.find((x) => x.id === weightID);
  };

  const newGrade = (name, score, total) => {
    let agrade = {
      id: Math.floor(Math.random() * 1000000000),
      name: name,
      score: score,
      total: total,
    };
    return agrade;
  };

  const modifyGrade = (
    indicator,
    name,
    score,
    total,
    weightID,
    classID,
    gradeID
  ) => {
    let currClass = getClass(classID);
    let currWeight = getWeight(weightID, classID);

    if (indicator === 1) {
      currWeight.grades.push(newGrade(name, score, total));
    } else {
      if (currWeight.grades.length > 1) {
        currWeight.grades = currWeight.grades.filter((ele) => {
          return ele.id !== gradeID;
        });
      } else {
        currWeight.grades = [];
      }
    }
    if (currWeight.grades.length !== 0) {
      //calculate new category percentages
      let aggregateScore = 0;
      let aggregateTotal = 0;
      for (let grade of currWeight.grades) {
        aggregateScore += grade.score;
        aggregateTotal += grade.total;
      }

      currWeight.weight_percent = (aggregateScore / aggregateTotal) * 100;
    } else {
      currWeight.weight_percent = 0;
    }

    // replace with new weight
    let index = currClass.weights.findIndex((x) => x.id === weightID);
    currClass.weights.splice(index, 1, currWeight);

    //calculate new overall percentage

    if (currWeight.grades.length !== 0) {
      let totalWeightPercents = 0;
      let divideTotalWeightsBy = 0;
      for (let weight of currClass.weights) {
        if (weight.weight_percent > 0) {
          divideTotalWeightsBy += weight.weight_value;
          totalWeightPercents +=
            (weight.weight_percent / 100) * weight.weight_value;
        }
      }

      currClass.total_grade =
        (totalWeightPercents / divideTotalWeightsBy) * 100;
    } else {
      currClass.total_grade = 0;
    }

    //replace curr class
    let indexClass = state.findIndex((x) => x.id === classID);
    let newState = state;
    newState.splice(indexClass, 1, currClass);
    setState([...newState]);
  };

  return (
    <DataContext.Provider
      value={{
        data: state,
        getClass: getClass,
        addClass: addClass,
        removeClass: removeClass,
        addWeight: addWeight,
        getWeight: getWeight,
        modifyGrade: modifyGrade,
      }}
    >
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen data="something" name="Home" component={Home} />
            <Stack.Screen name="Classes" component={ClassDetail} />
            <Stack.Screen name="Class Weights" component={WeightDetail} />
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </DataContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  addBtn: {
    marginRight: 30,
    paddingBottom: 50,
    fontSize: 30,
  },
});

export default App;
