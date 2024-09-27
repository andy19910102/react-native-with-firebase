import { useState, useEffect } from 'react';
import moment from "moment";
import { StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity } from 'react-native';
import { db } from "@/services/firebase";
import { collection, addDoc, getDocs, query, orderBy, DocumentData } from 'firebase/firestore';


interface Product extends DocumentData {
  id: string;
  name: string;
  price: number;
  createdAt: number;
}

export default function HomeScreen() {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [productList, setProductList] = useState<Product[]>([]);

  useEffect(() => {
    console.log("Prepare to get some data");
    getDocs(query(collection(db, "productList"), orderBy("createdAt", "desc")))
      .then(querySnapshot => {
        const productList: Product[] = [];
        querySnapshot.forEach(doc => {
          const product = doc.data() as Product;
          product.id = doc.id;
          productList.push(product);
        });
        setProductList(productList);
      })
      .catch(err => console.log(err));
  }, []);



  const onPressHandler = async () => {
    if (!name.trim() || !price.trim()) {
      alert('Please provide name and price');
      return;
    }

    const priceNumber = parseInt(price);
    if (isNaN(priceNumber)) {
      alert('Please provide a valid price');
      return;
    }

    const product = {
      id: "",
      name: name.trim(),
      price: priceNumber,
      createdAt: new Date().getTime(),
    };
    console.log(product);

    const docRef = await addDoc(collection(db, "productList"), product);
    console.log("Document ID:", docRef.id);

    product.id = docRef.id;

    setName("");
    setPrice("");
    setProductList([product, ...productList]);
    alert("New product added successfully");
  }

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Text style={styles.title}>My first Native App</Text>
        <Text style={styles.subtitle}>Fill the form below to create data</Text>

        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={newValue => setName(newValue)}
        />

        <Text style={styles.label}>Price:</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={newValue => setPrice(newValue)}
          keyboardType="number-pad"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={onPressHandler}
        >
          <Text style={styles.buttonText}>Create a new Product</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {
          productList.map(product => {

            const time = moment(product.createdAt).format("YYYY.MM.DD HH:mm:ss");
            return (
              <View key={product.id} style={styles.card}>
                <Text style={styles.cardName}>{product.name}</Text>
                <Text style={styles.cardPrice}>$ {product.price} NTD</Text>
                <Text style={styles.cardCreatedAt}>{time}</Text>
              </View>
            )
          })
        }
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    paddingTop: 60,
    paddingBottom: 60,
  },
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    color: "#333",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginTop: 12,
  },
  label: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    padding: 10,
    color: '#333',
    fontSize: 18,
  },
  button: {
    backgroundColor: "#333",
    paddingVertical: 16,
    paddingHorizontal: 6,
    marginTop: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#333',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // 用於 Android
  },
  cardName: {
    fontSize: 20,
    fontWeight: "900",
    color: "#333",
    marginBottom: 12,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 12,
  },
  cardCreatedAt: {
    fontSize: 14,
    fontWeight: "400",
    color: "#aaa",
  }
});
