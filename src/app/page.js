// pages/index.js

import React from "react";
import Link from "next/link";

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Next.js!</h1>
      <p>This is a default Next.js page.</p>

      <Link href="/products">Go to Products</Link>

      <Link href="/orders">Go to Orders</Link>
    </div>
  );
};

export default HomePage;
