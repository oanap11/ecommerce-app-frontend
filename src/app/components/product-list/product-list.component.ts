import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {

  products: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;
  previousParameter: string | number = '';

  // properties for pagination
  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;
    this.fetchProducts(keyword);
  }

  handleListProducts() {
    const currentCategoryId = +this.route.snapshot.paramMap.get('id')! || 1; 
    this.fetchProducts(currentCategoryId);
  }

  private fetchProducts(parameter: string | number) {
    if (this.previousParameter !== parameter) {
      this.pageNumber = 1;
    }
    this.previousParameter = parameter;
  
    this.productService
    .getProductsPaginated(this.pageNumber - 1, this.pageSize, parameter)
    .subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    }
  }

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product){
    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }
}
