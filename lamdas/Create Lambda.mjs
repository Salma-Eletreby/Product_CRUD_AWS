import pkg from 'pg';
const { Client } = pkg;

const createProduct = async (event) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    let { name, description, price, stock_quantity } = event;

    price = parseFloat(price);
    stock_quantity = parseInt(stock_quantity, 10);

    await client.connect();

    let result = await client.query(
      "INSERT INTO products(name, description, price, stock_quantity) VALUES($1, $2, $3, $4) RETURNING *",
      [name, description, price, stock_quantity]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: result.rows[0] }),
    };

  } catch (err) {
    throw new Error(`Error executing query: ${err.message}`);
  } finally {
    await client.end();
  }
};

export const handler = async (event) => {
  try {
    const result = await createProduct(event);
    return result
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
