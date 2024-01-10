import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = `${environment.apiUrl}/products`;
  private categoryUrl = `${environment.apiUrl}/product-category`;

  constructor(private httpClient: HttpClient) { }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient
    .get<GetResponseProductCategory>(this.categoryUrl)
    .pipe(
       map(response => response._embedded.productCategory),
     );
  }

  getProduct(productId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${productId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  getProductsPaginated(page: number, pageSize: number, searchBy: string | number): Observable<GetResponseProducts> {
    // determine if the user is searching by category or by keyword
    const paramName = typeof searchBy === 'number' ? 'id' : 'name';
    const endpoint = typeof searchBy === 'number' ? 'findProductByCategoryId' : 'findProductByNameContaining';
  
    const searchUrl = `${this.baseUrl}/search/${endpoint}?${paramName}=${searchBy}&page=${page}&size=${pageSize}`;
    
    return this.httpClient.get<GetResponseProducts>(searchUrl);
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
