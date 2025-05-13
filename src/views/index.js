// container.js
import React from 'react';
import LoaderView from '../components/LoaderView';
import loadable from '@loadable/component';

const fallback = { fallback: <LoaderView /> };

const DashboardView = loadable(() => import('./Dashboard'), fallback);
const HomeView = loadable(() => import('./Home'), fallback);
const OrderDetailsView = loadable(() => import('./OrderDetail'), fallback);
const OrdersView = loadable(() => import('./Order'), fallback);
const QuickSaleView = loadable(() => import('./QuickSale'), fallback);
const ProductsView = loadable(() => import('./Products'), fallback);
const PricesView = loadable(() => import('./Prices'), fallback);
const UsersView = loadable(() => import('./Users'), fallback);
const LoginView = loadable(() => import('./Login'), fallback);
const CashReportView = loadable(() => import("./CashReport"), fallback);
const ReadyToPayOrdersView = loadable(() => import("./SubmittedOrders"), fallback);
const CreditView = loadable(() => import("./Credits"), fallback);
const ClientsView = loadable(() => import("./Clients"), fallback);
const OpeningCashView = loadable(() => import("./OpeningCash"), fallback);
const SalesView = loadable(() => import("./Sales"), fallback);
const EventsView = loadable(() => import("./Events"), fallback);
const EventDetailsView = loadable(() => import("./EventDetails"), fallback);

import reducer from '../store/reducer';
import saga from '../saga';

const routes = [
  {
    component: DashboardView,
    path: '/dashboard',
    exact: true,
  },
  {
    component: HomeView,
    path: '/home',
    exact: true,
  },
  {
    component: SalesView,
    path: '/sales',
    exact: true,
  },
  {
    component: OrderDetailsView,
    path: '/order-details/:id',
    exact: false
  },
  {
    component: OrdersView,
    path: '/orders',
    exact: true,
  },
  {
    component: EventsView,
    path: '/events',
    exact: true,
  },
  {
    component: EventDetailsView,
    path: '/event/:id',
    exact: true,
  },
  {
    component: QuickSaleView,
    path: '/quick-sale',
    exact: true,
  },
  {
    component: ProductsView,
    path: '/products',
    exact: true,
  },
  {
    component: PricesView,
    path: '/prices',
    exact: true,
  },
  {
    component: UsersView,
    path: '/users',
    exact: true,
  },
  {
    component: LoginView,
    path: '/login',
    exact: true,
  },
  {
    component: OpeningCashView,
    path: '/opening-cash',
    exact: true,
  },
  {
    component: CashReportView,
    path: '/cash-report',
    exact: true,
  },
  {
    component: ReadyToPayOrdersView,
    path: '/submitted-orders',
    exact: true,
  },
  {
    component: CreditView,
    path: '/credit',
    exact: true,
  },
  {
    component: ClientsView,
    path: '/clients',
    exact: true,
  },
];

const container = {
  reducer,
  routes,
  saga
};

export default container;
