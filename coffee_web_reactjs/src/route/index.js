import HomePage from '../pages/HomePage/HomePage.js'
import OderPage from '../pages/OderPage/OderPage.js'
import ProductsPage from '../pages/ProductsPage/ProductsPage.js'
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage.js'
import TypeProductPage from '../pages/TypeProductPage/TypeProductPage.js'
import SignInPage from '../pages/SignInPage/SignInPage.js'
import SignUpPage from '../pages/SignUpPage/SignUpPage.js'
import ProductDetailPage from '../pages/ProductDetailPage/ProductDetailPage.js'
import ProfilePage from '../pages/Profile/Profile.js'
import AdminPage from '../pages/AdminPage/AdminPage.js'
import PaymentPage from '../pages/PaymentPage/PaymentPage.js'
import OderSuccess from '../pages/OrderSuccess/OrderSuccess.js'
import MyOrderPage from '../pages/MyOrderPage/MyOrderPage.js'
import DetailsOrderPage from '../pages/DetailsOrderPage/DetailsOrderPage.js'


// CẬP NHẬT ĐƯỜNG DẪN CHO CÁC TRANG 
export const routes = [
  {
    path: '/',
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: '/Order',
    page: OderPage,
    isShowHeader: false,
  },
  {
    path: '/my-order',
    page: MyOrderPage,
    isShowHeader: false,
  },
  {
    path: '/details-order/:id',
    page: DetailsOrderPage,
    isShowHeader: false,
  },
  {
    path: '/payment',
    page: PaymentPage,
    isShowHeader: false,
  },
  {
    path: '/orderSuccess',
    page: OderSuccess,
    isShowHeader: false,
  },
  {
    path: '/Product',
    page: ProductsPage,
    isShowHeader: true,
  },
  {
    path: '*',
    page: NotFoundPage
  },
  {
    path: '/product/:type',
    page: TypeProductPage,
    isShowHeader: true,
  },
  {
    path: '/sign-in',
    page: SignInPage,
    isShowHeader: false,
  },
  {
    path: '/sign-up',
    page: SignUpPage,
    isShowHeader: false,
  },
  {
    path: '/product-detail/:id',
    page: ProductDetailPage,
    isShowHeader: true,
  },
  {
    path: '/system/admin',
    page: AdminPage,
    isShowHeader: false,
    isPrivate: true
  },
  {
    path: '/profile-user',
    page: ProfilePage,
    isShowHeader: false,
  },
]