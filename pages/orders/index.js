// pages/orders.js
import React from "react";
import useSWR from "swr";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Orders = () => {
  const router = useRouter();
  const { data: orderedList, error } = useSWR(
    `http://localhost:3000/orders?page=${router.query.page || 1}`,
    fetcher
  );

  if (error) return <div>Error loading data</div>;
  if (!orderedList) return <div>Loading...</div>;

  return (
    <Box p={4} minHeight="100vh" bg="gray.100" borderRadius="md">
      <Heading as="h1" mb={4} color="teal.500">
        Ordered List
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Product Name</Th>
            <Th>Product ID</Th>
            <Th>Price</Th>
            <Th>Color</Th>
            <Th>Ordered At</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orderedList.orders.map((order) => (
            <Tr key={order.id}>
              <Td>{order.product.name}</Td>
              <Td>{order.productId}</Td>
              <Td>${order.product.price}</Td>
              <Td>{order.color.color}</Td>
              <Td>{new Date(order.createdAt).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Box mt={4}>
        {/* Pagination Buttons */}
        <Link
          href={`/orders?page=${
            Math.max(1, parseInt(router.query.page) - 1) || 1
          }`}
          passHref
        >
          <Button as="a" colorScheme="teal">
            Previous Page
          </Button>
        </Link>
        <Link
          href={`/orders?page=${parseInt(router.query.page) + 1 || 2}`}
          passHref
        >
          <Button as="a" colorScheme="teal" mr={2}>
            Next Page
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Orders;
