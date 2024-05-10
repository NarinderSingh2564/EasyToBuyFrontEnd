import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/admin/layout/layout.component';
import { ProductsComponent } from './pages/admin/products/products.component';
import { LoginComponent } from './pages/account/login/login.component';
import { RegisterComponent } from './pages/customer/register/register.component';
import { CategoryComponent } from './pages/admin/category/category.component';
import { LandingComponent } from './pages/website/landing/landing.component';
import { WebProductsComponent } from './pages/website/web-products/web-products.component';
import { CustomerCartComponent } from './pages/customer/customer-cart/customer-cart.component';
import { ProductDescriptionComponent } from './pages/website/product-description/product-description.component';
import { VendorRegisterComponent } from './pages/vendor/vendor-register/vendor-register.component';
import { AdminLoginComponent } from './pages/admin/admin-login/admin-login.component';
import { CustomerLoginComponent } from './pages/customer/customer-login/customer-login.component';
import { VendorLoginComponent } from './pages/vendor/vendor-login/vendor-login.component';
import { VendorDashboardComponent } from './pages/vendor/vendor-dashboard/vendor-dashboard.component';
import { vendorAuthGuard } from './guards/vendorAuth.guard';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'AllProducts',
        pathMatch: 'full'
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'vendor-register',
        component:VendorRegisterComponent
    },
    {
        path:'admin-login',
        component:AdminLoginComponent
    },
    {
        path: 'customer-login',
        component:CustomerLoginComponent
    },
    {
        path: 'vendor-login',
        component: VendorLoginComponent
    },
  
    {
        path: '',
        component: LayoutComponent,
        canActivate: [vendorAuthGuard],
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
                component: CustomerCartComponent,
            },
            {
                path: 'product-description/:id',
                component: ProductDescriptionComponent
            },
            {
                
                path: 'vendor-dashboard',
                component: VendorDashboardComponent
            }
        ]
    },

];
