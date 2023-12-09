import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchProductById, fetchAllProductsByFilters} from './productAPI';

const initialState = {
  products: [],
  status: 'idle',
  totalItems: 0,
  value: 0,
  selectedProduct: null,
};

export const fetchProductByIdAsync = createAsyncThunk(
  'product/fetchProductById',
  async (id) => {
    const response = await fetchProductById(id);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const fetchAllProductsByFiltersAsync = createAsyncThunk(
  'product/fetchAllProductsByFilters',
  async ({ filter, sort, pagination}) => {
    const response = await fetchAllProductsByFilters(filter, sort, pagination);

    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProductsByFiltersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllProductsByFiltersAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.products = action.payload.data.products;
        state.totalItems = action.payload.data.totalItems;
      })
      .addCase(fetchProductByIdAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.selectedProduct = action.payload;
      })
  },
});

export const { clearSelectedProduct } = productSlice.actions;

export const selectAllProducts = (state) => state.product.products;

export const selectProductById = (state) => state.product.selectedProduct;

export const selectTotalItems = (state) => state.product.totalItems;

export default productSlice.reducer;
