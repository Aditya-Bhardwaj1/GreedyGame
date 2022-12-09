import "./App.css";
import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reportActions } from "../Features/ReportSlice/reportSlice";
import { useState } from "react";
import useSearchParams from "../utils/useSearchParams";
import Loading from "../Components/Loading/Loading";
const Table = lazy(() => import("../Components/Table/Table"));
const SetDate = lazy(() => import("../Components/SetDate/setDate"));
function App() {
  const titles = useSelector((state) => state.report.titles);
  const [tempTitles, setTempTitles] = useState(titles);
  const [params, setParams] = useSearchParams();
  const dispatch = useDispatch();
  useEffect(() => {
    let temp = [];
    titles.forEach((title) => {
      if (title.value in params) {
        temp.push({ active: true, value: title.value });
      } else {
        temp.push({ active: false, value: title.value });
      }
    });
    dispatch(reportActions.updateTitles(temp));
  }, [params, dispatch]);
  useEffect(() => {
    setTempTitles(titles);
  }, [titles]);
  function applyChanges() {
    dispatch(reportActions.updateTitles(tempTitles));
    let temp = { ...params };
    tempTitles.forEach((title) => {
      if (title.active) {
        temp[title.value] = "true";
      } else {
        delete temp[title.value];
      }
    });
    const sParams = new URLSearchParams(window.location.search);
    const entries = sParams.entries();
    for (const [key, value] of entries) {
      if (!(key in temp)) {
        temp[key] = value;
      }
    }
    setParams(temp);
  }
  function clearTitles() {
    let temp = {};
    if ("page" in params) {
      temp["page"] = params["page"];
    }
    if ("startDate" in params) {
      temp["startDate"] = params["startDate"];
    }
    if ("endDate" in params) {
      temp["endDate"] = params["endDate"];
    }
    setParams({ ...temp });
  }
  function displayAppNames() {
    return tempTitles.map((l, i) => {
      return (
        <button
          className={
            tempTitles[i].active
              ? "btn d-flex justify-content-start p-1 btn-active"
              : "btn d-flex justify-content-start p-1"
          }
          style={{
            border: "1px solid rgba(0,0,0,0.125)",
            minWidth: "150px",
            justifyContent: "start !important",
          }}
          onClick={(e) => {
            let id = parseInt(e.target.dataset.index);
            let temp = [...tempTitles];
            if (!temp[id].active) {
              temp[id] = {
                active: true,
                value: temp[id].value,
              };
            } else {
              temp[id] = {
                active: false,
                value: temp[id].value,
              };
            }
            setTempTitles(temp);
          }}
          data-index={i}
          draggable={true}
          key={i}
          onDragEnd={handleDrag}
        >
          {l.value.cap()}
        </button>
      );
    });
  }
  function handleDrag(e) {
    const selectedItem = e.target,
      div = selectedItem.parentNode,
      x = e.clientX,
      y = e.clientY;
    let swapItem =
      document.elementFromPoint(x, y) === null
        ? selectedItem
        : document.elementFromPoint(x, y);
    if (div === swapItem.parentNode && swapItem !== selectedItem) {
      let id1 = parseInt(selectedItem.dataset.index);
      let id2 = parseInt(swapItem.dataset.index);
      let l1 = [...tempTitles];
      let temp = l1[id1];
      l1[id1] = l1[id2];
      l1[id2] = temp;
      // appActions.updateList(l1);
      setTempTitles(l1);
    }
  }
  return (
    <div
      className="container"
      style={{
        width: "100%",
        backgroundColor: "#ffffffde",
        height: "100%",
        paddingRight: 0,
        paddingLeft: "0",
        borderRadius: "1rem",
      }}
    >
      <div
        className="card"
        style={{
          borderRadius: "1rem",
          backgroundColor: "inherit",
          height: "100%",
        }}
      >
        <div
          className="card-header"
          style={{ backgroundColor: "inherit", borderRadius: "1rem" }}
        >
          <div className="d-flex flex-column ">
            <b>Analytics</b>
            <div className="d-flex justify-content-between">
              <div className="d-flex justify-content-start">
                <Suspense fallback={<Loading />}>
                  <SetDate />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
        <div
          className="card-body"
          style={{ backgroundColor: "inherit", borderRadius: "1rem" }}
        >
          <div className="d-flex flex-column p-2">
            <b>Dimensions and Metrics</b>
            <div className="container">
              <div className="d-flex justify-content-evenly flex-wrap">
                {displayAppNames()}
              </div>
            </div>
            <div className="d-flex justify-content-end my-2 py-1">
              <button
                className="btn"
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid rgba(0,0,0,0.2)",
                  color: "#2078F9",
                }}
                onClick={clearTitles}
              >
                Clear
              </button>
              <button className="btn btn-primary mx-1" onClick={applyChanges}>
                Apply Changes
              </button>
            </div>
          </div>
        </div>
        <div
          className="card-footer"
          style={{
            height: "100%",
            overflow: "scroll",
            background: "inherit",
            borderBottomLeftRadius: "1rem",
            borderBottomRightRadius: "1rem",
          }}
        >
          <Suspense fallback={<Loading />}>
            <Table />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default App;
