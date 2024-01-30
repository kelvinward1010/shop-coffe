import { combineReducers, configureStore } from '@reduxjs/toolkit'
//khởi tạo một store đơn thuần, configureStore sẽ mặc định thiết lập cho phép sử dụng 
//redux devtool để debug và theo dõi quá trình cập nhật state cũng như thiết lập sẵn một số middleware.
import  productReducer  from './slide/productSlide'
import userReducer from './slide/userSlide'
import orderReducer from './slide/orderSlide'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['product','user']
}

const rootReducer = combineReducers({
  product: productReducer,
  user: userReducer,
  order: orderReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store)