import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reportActions } from "../Features/ReportSlice/reportSlice";
import useSearchParams from "./useSearchParams";
function formatDate(date) {
  let day = date.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  let year = date.getFullYear();
  return `${year}-${month}-${day}`;
}
const useInitialDate = () => {
  const iDate = useSelector((state) => state.report.initialDate);
  const [initialdate, setInitialdate] = useState(new Date(iDate));
  const [params, setParams] = useSearchParams();
  const dispatch = useDispatch();
  useEffect(() => {
    if ("startDate" in params) {
      dispatch(reportActions.updateInitialDate(params["startDate"]));
    }
  }, [params]);
  useEffect(() => {
    setInitialdate(new Date(iDate));
  }, [iDate]);
  function updateInitialDate(newdateobj) {
    let sParams = new URLSearchParams(window.location.search);
    const entries = sParams.entries();
    let temp = { ...params };
    for (const [key, value] of entries) {
      if (!(key in temp)) {
        temp[key] = value;
      }
    }
    temp = { ...temp, startDate: formatDate(newdateobj) };
    setParams(temp);
  }
  // useEffect(() => {
  //   let day = initialdate.getDate();
  //   if (day < 10) {
  //     day = "0" + day;
  //   }
  //   let month = initialdate.getMonth() + 1;
  //   if (month < 10) {
  //     month = "0" + month;
  //   }
  //   const year = initialdate.getFullYear();
  //   const d = `${year}-${month}-${day}`;
  //   console.log("start : ", d);
  //   dispatch(reportActions.updateInitialDate(d));
  //   setParams({ ...params, startDate: d });
  // }, [initialdate, dispatch]);
  return [initialdate, updateInitialDate];
};
export default useInitialDate;
