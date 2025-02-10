import pkg from 'pg';
const { Client } = pkg;

const updateProduct = async (event) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const { product_id, ...newProduct } = event;
    
    if (!product_id) {
      throw new Error("Product ID is required for updating.");
    }

    const fields = Object.keys(newProduct);
    
    if (fields.length === 0) {
      throw new Error("At least one field must be provided for an update.");
    }

    const query = `
      UPDATE products
      SET ${fields.map((key, i) => `${key} = $${i + 1}`).join(", ")}
      WHERE product_id = $${fields.length + 1}
      RETURNING *;
    `;

    const values = [...Object.values(newProduct), product_id];

    await client.connect();
    const result = await client.query(query, values);

    if (result.rowCount === 0) {
      throw new Error(`No product found with ID ${product_id}`);
    }

    return {
      statusCode: 200,
      body: { success: true, data: result.rows[0] },
    };

  } catch (err) {
    throw new Error(`Error executing query: ${err.message}`);
  } finally {
    await client.end();
  }
};

export const handler = async (event) => {
  try {
    return await updateProduct(event);
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body:{ success: false, error: err.message, stack: err.stack },
    };
  }
};
