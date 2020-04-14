import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import {
  Card,
  Layout,
  Text,
  Divider,
  Input,
  Button,
} from "@ui-kitten/components";
import DataContext from "./DataProvider";
import { ScrollView } from "react-native-gesture-handler";

const AddClassModalTwo = ({ setModalVisible, classID, weightID }) => {
  const [gradeName, setGradeName] = useState("");
  const [gradeScore, setGradeScore] = useState("0");
  const [gradeTotal, setGradeTotal] = useState("0");
  const { modifyGrade } = useContext(DataContext);

  useEffect(() => {}, [gradeName, gradeScore, gradeTotal]);
  const AddWeightFooter = () => {
    return (
      <Layout>
        <Button
          appearance="outline"
          status="primary"
          style={styles.button}
          onPress={() => {
            if (
              gradeName !== "" &&
              Number(gradeScore) >= 0 &&
              Number(gradeScore) <= Number(gradeTotal)
            ) {
              modifyGrade(
                1,
                gradeName,
                Number(gradeScore),
                Number(gradeTotal),
                weightID,
                classID,
                null
              );
              setModalVisible(false);
            } else {
              alert(
                "Error: Make sure no fields are empty and score is less than total"
              );
            }
          }}
        >
          Add Grade
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
        New Grade
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
              placeholder="Grade name"
              value={gradeName}
              onChangeText={(val) => setGradeName(val)}
            />
            <Text style={{ paddingBottom: 10 }}>Score</Text>
            <Input
              placeholder="0"
              value={gradeScore}
              onChangeText={(val) => setGradeScore(val)}
              keyboardType="numbers-and-punctuation"
            />
            <Text style={{ paddingBottom: 10, paddingTop: 10 }}>
              Points possible
            </Text>
            <Input
              placeholder="0"
              value={gradeTotal}
              onChangeText={(val) => setGradeTotal(val)}
              keyboardType="numbers-and-punctuation"
            />
          </Card>
        </Layout>
      </Modal>
    </Layout>
  );
};

const WeightDetail = ({ navigation, route }) => {
  const { weightID, classID } = route.params;
  const { getWeight, modifyGrade } = useContext(DataContext);
  const [currWeight, setCurrWeight] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    let currWeight = getWeight(weightID, classID);
    setCurrWeight(currWeight);
  }, []);

  const Header = () => {
    return (
      <>
        {currWeight !== 0 && (
          <Card
            status="warning"
            style={styles.cardGradesHeader}
            onPress={() => navigation.navigate("Classes")}
          >
            <Text style={styles.weightTitle}>
              {`${currWeight.weight_group}`}{" "}
              <Text
                style={styles.percentOfGradeText}
              >{`(${currWeight.weight_value}% of grade)`}</Text>
            </Text>
            <Text style={styles.weightPercent}>
              {`${(currWeight.weight_percent + 0).toFixed(2)}% `}
              <Text style={styles.bar}>|</Text>

              <Text style={styles.weightTotal}>
                {` ${(
                  (currWeight.weight_percent / 100) *
                  currWeight.weight_value
                ).toFixed(2)}%`}
              </Text>
            </Text>
          </Card>
        )}
      </>
    );
  };

  return (
    <Layout style={styles.container} level="1">
      <ScrollView>
        <Card style={styles.card} header={Header}>
          {currWeight ? (
            currWeight.grades.map((grade, index) => {
              return (
                <Card key={index} style={styles.cardGrades}>
                  <Text style={styles.gradeTitle2}>{grade.name}</Text>
                  <Divider style={styles.divider} />
                  <Text style={styles.weightPercent2}>
                    {`${((grade.score / grade.total) * 100).toFixed(2)}% `}
                    <Text style={styles.bar2}>|</Text>

                    <Text style={styles.weightTotal2}>
                      {` ${grade.score}/${grade.total}`}
                    </Text>
                  </Text>

                  <Button
                    style={styles.deleteBtn}
                    status="danger"
                    appearance="outline"
                    onPress={() =>
                      modifyGrade(
                        0,
                        null,
                        null,
                        null,
                        weightID,
                        classID,
                        grade.id
                      )
                    }
                  >
                    Delete
                  </Button>
                </Card>
              );
            })
          ) : (
            <></>
          )}
        </Card>
      </ScrollView>
      {modalVisible ? (
        <AddClassModalTwo
          classID={classID}
          weightID={weightID}
          setModalVisible={setModalVisible}
        />
      ) : (
        <></>
      )}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.fab}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
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
    marginBottom: 0,
  },
  deleteBtn: {
    marginTop: 20,
  },
  cardGradesHeader: {
    margin: 20,
    marginBottom: 20,
  },
  cardGrades: {
    marginBottom: 20,
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
    fontSize: 25,
  },
  weightCard: {
    marginBottom: 15,
  },
  weightTitle: {
    fontSize: 25,
    paddingBottom: 5,
  },
  percentOfGradeText: {
    fontSize: 20,
    color: "gray",
    textAlign: "right",
  },
  weightPercent: {
    fontSize: 27,
    paddingTop: 5,
    marginRight: 15,
  },
  weightTotal: {
    fontSize: 27,
    color: "gray",
  },
  bar: {
    fontSize: 27,
    color: "gray",
  },
  weightPercent2: {
    fontSize: 22,
    paddingTop: 5,
    marginRight: 15,
  },
  weightTotal2: {
    fontSize: 22,
    color: "gray",
  },
  bar2: {
    fontSize: 22,
    color: "gray",
  },
  gradeTitle2: {
    fontSize: 20,
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 40,
    bottom: 60,
    backgroundColor: "orange",
    borderRadius: 30,
    elevation: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  fabIcon: {
    fontSize: 40,
    marginBottom: 10,
    marginLeft: 2,
    marginTop: 1,
    color: "white",
  },
  button: {
    margin: 10,
  },
});

export default WeightDetail;
