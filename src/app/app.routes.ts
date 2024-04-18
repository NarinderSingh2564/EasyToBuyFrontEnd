import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/admin/layout/layout.component';
import { ProductsComponent } from './pages/admin/products/products.component';
import { LoginComponent } from './pages/account/login/login.component';
import { RegisterComponent } from './pages/account/register/register.component';
import { CategoryComponent } from './pages/admin/category/category.component';
import { authGuard } from './guards/auth.guard';
import { LandingComponent } from './pages/website/landing/landing.component';
import { WebProductsComponent } from './pages/website/web-products/web-products.component';
import { CustomerCartComponent } from './pages/website/customer-cart/customer-cart.component';
import { ProductDescriptionComponent } from './pages/website/product-description/product-description.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'AllProducts',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
  
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'products',
                component: ProductsComponent
            },
            {
                path: 'category',
                component: CategoryComponent
            },
        ]
    },
    {
        path: '',
        component: LandingComponent,
        children: [
            {
                path: 'AllProducts',
                component: WebProductsComponent
            },
            {
                path: 'ProductsByCategory/:id/:searchText',
                component: WebProductsComponent
            },
            {
                path: 'customer-cart',
                component: CustomerCartComponent
            },
            {
                path: 'product-description',
                component: ProductDescriptionComponent
            },
        ]
    },

];
