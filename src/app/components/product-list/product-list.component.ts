import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})

export class ProductListComponent {

  products: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;
  
  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }   
  }

  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

    this.productService.searchProducts(keyword).subscribe(
      data => {
        this.products = data;
      }
    )
  }

  handleListProducts(){
    const hasCategoryId: boolean = this. route.snapshot.paramMap.has('id');
    if(hasCategoryId){
      // use the "+" symbol to convert a string to a number
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      // default to category id 1
      this.currentCategoryId = 1;
    }

    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }
}
