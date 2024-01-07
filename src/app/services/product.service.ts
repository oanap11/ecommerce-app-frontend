import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProductListPaginated(page: number, pageSize: number, categoryId: number): Observable<GetResponseProducts> {
    
    const searchUrl = `${this.baseUrl}/search/findProductByCategoryId?id=${categoryId}`
                    + `&page=${page}&size=${pageSize}`;
    
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(categoryId: number): Observable<Product[]> {
    
    const searchUrl = `${this.baseUrl}/search/findProductByCategoryId?id=${categoryId}`;
    
    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient
    .get<GetResponseProductCategory>(this.categoryUrl)
    .pipe(
       map(response => response._embedded.productCategory),
     );
  }

  searchProducts(keyword: any): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findProductByNameContaining?name=${keyword}`;
    
    return this.getProducts(searchUrl);
  }

  getProduct(productId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${productId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient
      .get<GetResponseProducts>(searchUrl)
      .pipe(
        map(response => response._embedded.products)
      );
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number // current page number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
