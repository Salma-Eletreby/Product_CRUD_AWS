import AWS from 'aws-sdk';

export default class ProductsRepo{
    constructor() {
        this.lambda = new AWS.Lambda({ region: 'us-east-1' });
    }

    async getProducts() {
        const params = {
            FunctionName: 'http-crud-tutorial-function',
            InvocationType: 'RequestResponse',
        };

        const response = await this.lambda.invoke(params).promise();
        const products = JSON.parse(response.Payload);

        return products
    }

    async createProduct(product) {
        const params = {
            FunctionName: 'Create_Product_CRUD',
            InvocationType: 'RequestResponse',
            Payload: JSON.stringify({
                name: product.name,
                description: product.description,
                price: product.price,
                stock_quantity: product.stock_quantity
            })
        };
        
        console.log(params);
        
        const response = await this.lambda.invoke(params).promise();
        // const product = JSON.parse(response.Payload);

        return response
    }
}