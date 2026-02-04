// public/js/api.js - API Client for Product Management
class ProductAPI {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    
    async getAllProducts(category = null) {
        let url = `${this.baseURL}/products`;
        if (category) {
            url += `?category=${category}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        return await response.json();
    }
    
    async getProductById(id) {
        const response = await fetch(`${this.baseURL}/products/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product');
        }
        return await response.json();
    }
    
    async createProduct(productData) {
        const response = await fetch(`${this.baseURL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }
        
        return await response.json();
    }
    
    async updateProduct(id, productData) {
        const response = await fetch(`${this.baseURL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }
        
        return await response.json();
    }
    
    async deleteProduct(id) {
        const response = await fetch(`${this.baseURL}/products/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }
        
        return await response.json();
    }
}

// Initialize API client
const api = new ProductAPI('http://localhost:3000/api');