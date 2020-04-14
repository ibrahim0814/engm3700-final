import React, { useState, useEffect, useContext } from "react";
import Modal from "react-native-modal";
import { StyleSheet, ScrollView, TouchableOpacity, View } from "react-native";
import DataContext from "../components/DataProvider";
import {
  Card,
  Text,
  Divider,
  Button,
  Layout,
  Input,
} from "@ui-kitten/components";

const AddClassModal = (props) => {
  const [className, setClassName] = useState("");
  const { addClass } = useContext(DataContext);
  useEffect(() => {}, [className]);
  const AddClassFooter = () => {
    return (
      <Layout style={styles.btnGroup}>
        <Button
          appearance="outline"
          status="primary"
          style={styles.button}
          onPress={() => {
            if (className !== "") {
              addClass(className);
              props.setModalVisible(false);
            } else {
              alert("Class name cannot be empty");
            }
          }}
        >
          Add Class
        </Button>
        <Button
          appearance="outline"
          status="danger"
          style={styles.button}
          onPress={() => props.setModalVisible(false)}
        >
          Close
        </Button>
      </Layout>
    );
  };

  const AddClassHeader = () => {
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
        New Class
      </Text>
    );
  };

  return (
    <View>
      <Modal
        isVisible={true}
        onBackdropPress={() => props.setModalVisible(false)}
      >
        <Layout
          styles={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card header={AddClassHeader} footer={AddClassFooter}>
            <Input
              placeholder="Class name"
              value={className}
              onChangeText={(val) => setClassName(val)}
            />
          </Card>
        </Layout>
      </Modal>
    </View>
  );
};

const Home = ({ navigation }) => {
  const { data } = useContext(DataContext);
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <View style={styles.container} level="1">
        <ScrollView>
          <View>
            {data.length !== 0 ? (
              data.map((myclass, index) => {
                return (
                  <Card
                    key={index}
                    style={styles.card}
                    status="basic"
                    appearance="outline"
                    onPress={() =>
                      navigation.navigate("Classes", { classId: myclass.id })
                    }
                  >
                    <Text category="h5">{myclass.name}</Text>
                    <Divider style={styles.divider} />
                    <Text style={styles.gradeTitle}>Overall Grade</Text>
                    <Text style={styles.grade}>
                      {(myclass.total_grade + 0).toFixed(2)}%
                    </Text>
                  </Card>
                );
              })
            ) : (
              <Text
                style={{
                  paddingLeft: 145,
                  paddingTop: 150,
                  fontSize: 20,
                }}
              >
                NO CLASSES
              </Text>
            )}
          </View>
        </ScrollView>
        {modalVisible ? (
          <AddClassModal
            modalVisible={modalVisible}
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
      </View>
    </>
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
    marginBottom: -5,
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
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 40,
    bottom: 60,
    backgroundColor: "#0080ff",
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

export default Home;
