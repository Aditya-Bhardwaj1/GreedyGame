import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  report: [],
  errors: {},
  titles: [
    { value: "fill rate", active: false },
    { value: "CTR", active: false },
    { value: "date", active: false },
    { value: "requests", active: false },
    { value: "responses", active: false },
    { value: "impressions", active: false },
    { value: "clicks", active: false },
    { value: "revenue", active: false },
    { value: "app", active: false },
  ],
  initialDate: "2021-06-01", // yyyy-mm-dd
  endDate: "2021-06-30", // yyyy-mm-dd
};
const getReports = (function () {
  const reportCache = {};
  return createAsyncThunk("report/get", async (arg, { getState }) => {
    const state = getState();
    const url = `https://go-dev.greedygame.com/v3/dummy/report?startDate=${state.report.initialDate}&endDate=${state.report.endDate}`;
    if (url in reportCache) {
      return reportCache[url].then((res) => res.json());
    }
    const pr = fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    reportCache[url] = pr;
    return pr.then((res) => res.json());
  });
})();
const report = createSlice({
  name: "report",
  initialState,
  reducers: {
    updateInitialDate: (state, action) => {
      state.initialDate = action.payload;
    },
    updateEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    updateTitles: (state, action) => {
      state.titles = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getReports.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getReports.fulfilled, (state, action) => {
      state.errors = {};
      state.loading = false;
      state.report = action.payload.data;
    });
    builder.addCase(getReports.rejected, (state, action) => {
      state.errors = action.payload;
      state.report = [];
      state.loading = false;
    });
  },
});
const reportActions = report.actions;
reportActions["getReports"] = getReports;
export { reportActions };
const reportReducers = report.reducer;
export default reportReducers;
