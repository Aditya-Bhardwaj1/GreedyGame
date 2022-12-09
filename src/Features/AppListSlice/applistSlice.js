import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const getApps = (function () {
  let appCache;
  return createAsyncThunk("apps/get", () => {
    if (typeof appCache != "undefined") {
      return appCache.then((res) => res.json()).then((res) => res.data);
    }
    const promise = fetch("http://go-dev.greedygame.com/v3/dummy/apps", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    appCache = promise;
    return promise.then((res) => res.json()).then((res) => res.data);
  });
})();
const initialState = {
  appList: [],
  loading: false,
  errors: {},
};
const appList = createSlice({
  name: "apps",
  initialState,
  reducers: {
    updateList: (state, action) => {
      state.appList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getApps.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getApps.fulfilled, (state, action) => {
      state.loading = false;
      console.log(action.payload);
      state.appList = action.payload;
      state.errors = {};
    });
    builder.addCase(getApps.rejected, (state, action) => {
      state.loading = false;
      state.appList = [];
      state.errors = action.payload;
    });
  },
});
const appActions = appList.actions;
appActions["getApps"] = getApps;
export { appActions };
const appListReducers = appList.reducer;
export default appListReducers;
