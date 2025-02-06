import pkg from 'pg';
const { Client } = pkg;

const getProducts = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const results = await client.query("SELECT * FROM products");
    return results.rows;
  } catch (err) {
    throw new Error(`Error executing query: ${err.message}`);
  } finally {
    await client.end();
  }
};

export const handler = async (event) => {
  try {
    const products = await getProducts();
    return products
  } catch (err) {
    console.error("Error:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message,
        stack: err.stack,
      }),
    };
  }
};
