import ProductsRepo from "../../controllers/products-repo";

const repo = new ProductsRepo();

async function getProducts(req, res) {
    try {
        const products = await repo.getProducts();
        return res.status(200).json(products);
    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({ error: "Failed to get Products" });
    }
}

async function createProduct(req, res) {
    try {
        const product = req.body; 
        const newProduct = await repo.createProduct(product);
        return res.status(200).json(newProduct);
    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({ error: "Failed to create product" });
    }
}

async function updateProduct(req, res) {
    try {
        const product = req.body; 
        const newProduct = await repo.updateProduct(product);
        return res.status(200).json(newProduct);
    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({ error: "Failed to update product" });
    }
}

async function deleteProduct(req, res) {
    try {
        const productId = req.body; 
        const response = await repo.deleteProduct(productId);
        return res.status(200).json(response);
    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({ error: "Failed to delete product" });
    }
}

export default async function handler(req, res) {
    if (req.method === 'GET') {
        return getProducts(req, res); 
    } else if (req.method === 'POST') {
        return createProduct(req, res);
    }else if (req.method === 'PUT') {
        return updateProduct(req, res);
    }else if (req.method === 'DELETE') {
        return deleteProduct(req, res);
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
