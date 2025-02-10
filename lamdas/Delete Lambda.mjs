import pkg from 'pg';
const { Client } = pkg;

const deleteProduct = async (event) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const { product_id } = event;

    if (!product_id) {
      throw new Error("Product ID is required for deletion.");
    }

    await client.connect();

    const checkProduct = await client.query("SELECT 1 FROM products WHERE product_id = $1", [product_id]);
    if (checkProduct.rowCount === 0) {
      throw new Error(`No product found with ID ${product_id}`);
    }

    const query = "DELETE FROM products WHERE product_id = $1 RETURNING *;";
    const values = [product_id];

    const result = await client.query(query, values);

    return {
      statusCode: 200,
      body: { success: true, message: "Product deleted successfully", data: result.rows[0] },
    };

  } catch (err) {
    throw new Error(`Error executing query: ${err.message}`);
  } finally {
    await client.end();
  }
};

export const handler = async (event) => {
  try {
    return await deleteProduct(event);
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: { success: false, error: err.message, stack: err.stack },
    };
  }
};