import React, { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import {
  Box,
  Heading,
  List,
  ListItem,
  Text,
  Badge,
  Button,
  Link,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Products = () => {
  const [selectedColors, setSelectedColors] = useState({});
  const router = useRouter();

  const {
    data: productList,
    error,
    mutate,
  } = useSWR(
    `http://localhost:3000/products?page=${router.query.page || 1}`,
    fetcher
  );

  const handleColorClick = (productId, color) => {
    setSelectedColors((prevColors) => ({
      ...prevColors,
      [productId]: { colorId: color.color.id, color: color.color.color },
    }));
  };

  //   const handlePlaceOrder = (productId) => {
  //     const selectedColor = selectedColors[productId];
  //     console.log(
  //       `Placing order for product ${productId} with colorId ${selectedColor.colorId} and color ${selectedColor.color}`
  //     );
  //   };
  const handlePlaceOrder = async (productId) => {
    try {
      const selectedColor = selectedColors[productId];
      // Access colorId and color from the selectedColor object
      const { colorId, color } = selectedColor || {};

      if (selectedColor) {
        // Add logic to place an order with the selected product, colorId, and colo
        console.log(selectedColor);
        const response = await axios.post("http://localhost:3000/orders", {
          userId: 1,
          productId,
          colorId,
        });

        console.log(response.data);

        console.log(
          `Placing order for product ${productId} with colorId ${colorId} and color ${color}`
        );
      } else {
        // Handle case where no color is selected
        console.warn(`No color selected for product ${productId}`);
      }
    } catch (error) {}
  };

  const renderProduct = (product) => (
    <ListItem
      key={product.id}
      mb={4}
      p={4}
      borderRadius="md"
      boxShadow="md"
      bg="white"
    >
      <Box>
        <Heading as="h2" size="md" color="teal.500">
          {product.name}
        </Heading>
        <Text fontSize="sm" color="gray.600">
          Brand: {product.brand.name}
        </Text>
        <Text>Price: ${product.price}</Text>
        <Text>
          Available Colors:{" "}
          {product.colors.map((color) => (
            <Badge
              key={color.id}
              colorScheme={color.color.color.toLowerCase()}
              mr={2}
              variant={
                selectedColors[product.id]?.colorId === color.id
                  ? "solid"
                  : "outline"
              }
              cursor="pointer"
              onClick={() => handleColorClick(product.id, color)}
            >
              {color.color.color}
            </Badge>
          ))}
        </Text>
        <Button
          mt={4}
          colorScheme="teal"
          onClick={() => handlePlaceOrder(product.id)}
          isDisabled={!selectedColors[product.id]}
        >
          Place Order
        </Button>
      </Box>
    </ListItem>
  );

  if (error) return <div>Error loading data</div>;
  if (!productList) return <div>Loading...</div>;

  return (
    <Box p={4} minHeight="100vh" bg="gray.100" borderRadius="md">
      <Heading as="h1" mb={4} color="teal.500">
        Product List
      </Heading>
      <List>{productList.products.map(renderProduct)}</List>
      <Box mt={4}>
        {/* Pagination Buttons */}
        <Link
          href={`/products?page=${parseInt(router.query.page) + 1 || 2}`}
          passHref
        >
          <Button as="a" colorScheme="teal" mr={2}>
            Next Page
          </Button>
        </Link>
        <Link
          href={`/products?page=${
            Math.max(1, parseInt(router.query.page) - 1) || 1
          }`}
          passHref
        >
          <Button as="a" colorScheme="teal">
            Previous Page
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Products;
