import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/admin/layout/layout.component';
import { ProductsComponent } from './pages/vendor/products/products/products.component';
import { LoginComponent } from './pages/account/login/login.component';
import { RegisterComponent } from './pages/customer/customer-register/register.component';
import { CategoryComponent } from './pages/admin/category/category.component';
import { LandingComponent } from './pages/website/landing/landing.component';
import { WebProductsComponent } from './pages/website/web-products/web-products.component';
import { CustomerCartComponent } from './pages/customer/customer-cart/customer-cart.component';
import { ProductDescriptionComponent } from './pages/website/product-description/product-description.component';
import { VendorRegisterComponent } from './pages/vendor/vendor-register/vendor-register.component';
import { VendorDashboardComponent } from './pages/vendor/vendor-dashboard/vendor-dashboard.component';
import { vendorAuthGuard } from './guards/vendorAuth.guard';
import { PlaceOrderComponent } from './pages/website/place-order/place-order.component';
import { OrderListComponent } from './pages/account/order-list/order-list.component';
import { VendorOrderListComponent } from './pages/vendor/vendor-order-list/vendor-order-list.component';
import { CustomerOrdersComponent } from './pages/customer/customer-orders/customer-orders.component';
import { customerAuthGuard } from './guards/customerAuth.guard';
import { ProductImagesComponent } from './pages/vendor/products/product-images/product-images.component';
import { AccountProfileComponent } from './pages/customer/account-profile/account-profile.component';


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
        path:'app-login',
        component:LoginComponent
    },
    {
        path: 'order-list',
        component:OrderListComponent
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
                path: 'product-images',
                component: ProductImagesComponent
            },
            {
                path: 'category',
                component: CategoryComponent
            },
            {
                path: 'vendor-dashboard',
                component: VendorDashboardComponent
            },
            {
                path: 'vendor-order-list/:id',
                component:VendorOrderListComponent
            },
            // {
            //     path: 'my-orders',
            //     component:VendorOrderListComponent
            // },
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
                canActivate: [customerAuthGuard]
            },
            {
                path: 'product-description/:id/:variationId',
                component: ProductDescriptionComponent
            },
            {
                path: 'place-order',
                component:PlaceOrderComponent,
                canActivate: [customerAuthGuard]
            },
            {
                path: 'customer-order',
                component:CustomerOrdersComponent,
                canActivate: [customerAuthGuard]
            },
            {
                path:'account-profile',
                component:AccountProfileComponent,
                canActivate: [customerAuthGuard]
            }
        ]
    },

];
