import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, ScrollView } from "react-native";
import DataContext from "../components/DataProvider";
import Modal from "react-native-modal";
import {
  Text,
  Layout,
  Card,
  Button,
  Divider,
  Input,
} from "@ui-kitten/components";

const AddClassModalTwo = ({ setModalVisible, classId, allWeightsCombined }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryWeight, setCategoryWeight] = useState("0");
  const { addWeight } = useContext(DataContext);
  useEffect(() => {}, [categoryWeight, setCategoryName]);
  const AddWeightFooter = () => {
    console.log(allWeightsCombined);
    return (
      <Layout>
        <Button
          appearance="outline"
          status="primary"
          style={styles.button}
          onPress={() => {
            if (
              categoryName !== "" &&
              Number(categoryWeight) > 0 &&
              Number(categoryWeight) + allWeightsCombined <= 100
            ) {
              addWeight(categoryName, Number(categoryWeight), classId);
              setModalVisible(false);
            } else {
              alert(
                "Error: Make sure no fields are empty and that total category weight does not exceed 100"
              );
            }
          }}
        >
          Add Category
        </Button>
        <Button
          appearance="outline"
          status="danger"
          style={styles.button}
          onPress={() => setModalVisible(false)}
        >
          Close
        </Button>
      </Layout>
    );
  };

  const AddWeightHeader = () => {
    return (
      <Text
        style={{
          textAlignVertical: "center",
          textAlign: "center",
          paddingTop: 15,
          paddingBottom: 15,
          color: "#4c4c4c",
        }}
        category="h6"
      >
        New Category
      </Text>
    );
  };

  return (
    <Layout>
      <Modal isVisible={true} onBackdropPress={() => setModalVisible(false)}>
        <Layout
          styles={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card header={AddWeightHeader} footer={AddWeightFooter}>
            <Text style={{ paddingBottom: 10 }}>Name</Text>
            <Input
              style={{ paddingBottom: 10 }}
              placeholder="Category name"
              value={categoryName}
              onChangeText={(val) => setCategoryName(val)}
            />
            <Text style={{ paddingBottom: 10 }}>Weight</Text>
            <Input
              placeholder="0"
              value={categoryWeight}
              onChangeText={(val) => setCategoryWeight(val)}
              keyboardType="numbers-and-punctuation"
            />
          </Card>
        </Layout>
      </Modal>
    </Layout>
  );
};

const WeightList = ({ navigation, currClass }) => {
  return (
    <ScrollView>
      {currClass ? (
        currClass.weights.map((weight, index) => {
          return (
            <Card
              style={styles.weightCard}
              key={index}
              onPress={() =>
                navigation.navigate("Class Weights", {
                  weightID: weight.id,
                  classID: currClass.id,
                })
              }
            >
              <Text style={styles.weightTitle}>
                {`${weight.weight_group}`}{" "}
                <Text
                  style={styles.percentOfGradeText}
                >{`(${weight.weight_value}% of grade)`}</Text>
              </Text>
              <Text style={styles.weightPercent}>
                {`${(weight.weight_percent + 0).toFixed(2)}% `}
                <Text style={styles.bar}>|</Text>

                <Text style={styles.weightTotal}>
                  {` ${(
                    (weight.weight_percent / 100) *
                    weight.weight_value
                  ).toFixed(2)}%`}
                </Text>
              </Text>
            </Card>
          );
        })
      ) : (
        <></>
      )}
    </ScrollView>
  );
};

const ClassHeader = ({ currClass }) => {
  return (
    <>
      <Card style={styles.classDescription} status="basic">
        <Text category="h5">{currClass ? currClass.name : null}</Text>
        <Divider style={styles.divider} />
        <Text style={styles.gradeTitle}>Overall Grade</Text>
        <Text style={styles.grade}>
          {currClass ? (currClass.total_grade + 0).toFixed(2) : null}%
        </Text>
      </Card>
      <Divider style={styles.divider2} />
    </>
  );
};

const ClassFooter = ({ removeClass, classID, navigation, setModalVisible }) => {
  return (
    <Layout style={styles.btnGroup}>
      <Button
        style={styles.button}
        appearance="outline"
        status="primary"
        onPress={() => {
          setModalVisible(true);
        }}
      >
        NEW CATEGORY
      </Button>
      <Button
        style={styles.button}
        appearance="outline"
        status="danger"
        onPress={() => {
          removeClass(classID);
          navigation.navigate("Home");
        }}
      >
        DELETE CLASS
      </Button>
    </Layout>
  );
};

const ClassDetail = ({ navigation, route }) => {
  const { getClass, removeClass, addWeight } = useContext(DataContext);
  const [currClass, setCurrClass] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { classId } = route.params;
  useEffect(() => {
    let currClass = getClass(classId);
    setCurrClass(currClass);
  });

  useEffect(() => {
    console.log(currClass);
  }, [currClass]);
  return (
    <Layout style={styles.container} level="1">
      <ScrollView>
        <Card style={styles.card} navigation={navigation} classId={classId}>
          <ClassHeader currClass={currClass} />
          <Layout
            styles={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                textAlignVertical: "center",
                textAlign: "center",
                paddingBottom: 15,
                color: "#4c4c4c",
              }}
              category="h6"
            >
              Grade Categories
            </Text>
          </Layout>

          <WeightList navigation={navigation} currClass={currClass} />
          <ClassFooter
            addWeight={addWeight}
            navigation={navigation}
            removeClass={removeClass}
            classID={classId}
            setModalVisible={setModalVisible}
          />
        </Card>
      </ScrollView>
      {modalVisible ? (
        <AddClassModalTwo
          classId={classId}
          allWeightsCombined={currClass.all_weights_combined}
          setModalVisible={setModalVisible}
        />
      ) : (
        <></>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: "#F5F5F5",
    minHeight: 128,
  },
  card: {
    margin: 20,
  },
  divider: {
    marginBottom: 10,
    marginTop: 10,
  },
  gradeTitle: {
    fontSize: 20,
    paddingBottom: 10,
    color: "gray",
  },
  grade: {
    fontSize: 40,
  },
  button: {
    margin: 10,
  },
  weightCard: {
    marginBottom: 15,
  },
  weightTitle: {
    fontSize: 17,
    paddingBottom: 5,
  },
  percentOfGradeText: {
    color: "gray",
    textAlign: "right",
  },
  weightPercent: {
    fontSize: 25,
    paddingTop: 5,
    marginRight: 15,
  },
  weightTotal: {
    fontSize: 25,
    color: "gray",
  },
  bar: {
    fontSize: 25,
    color: "gray",
  },
  divider2: {
    marginBottom: 15,
    marginTop: 20,
  },
});

export default ClassDetail;
