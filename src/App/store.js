import { configureStore } from "@reduxjs/toolkit";
import appListReducers from "../Features/AppListSlice/applistSlice";
import reportReducers, {
  reportActions,
} from "../Features/ReportSlice/reportSlice";
// import reportSlic from "../Features/ReportSlice/reportSlice";

const store = configureStore({
  reducer: {
    report: reportReducers,
    appList: appListReducers,
  },
});
export default store;
