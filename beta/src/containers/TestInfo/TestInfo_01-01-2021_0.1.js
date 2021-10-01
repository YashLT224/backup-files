//lib/packages import---------------------------------------------------------------------------------------------------------------------------
import React, { useState, useEffect } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { DateRangePicker } from "react-date-range";

//import components/variables/functions/constants----------------------------------------------------------------------------------------------------
import Filter from "../components/Filter/Filter";
import {
  GetTagsAction,
  GetApproversAction,
} from "../services/actions/createNewProjectAction";
import ErrorHandling from "../components/ErrorHandling/Handling";
import {
  GetTestComparisonListAction,
  testcomparisonaction,
  EmptyTestComparisonreducerstate,
} from "../services/actions/TestComparison";
import { UserInfoAction } from "../services/actions/userDetailsAction";
import TestComparisonLoading from "../components/TestComparisonLoading/TestComparisonloading";
import Breadcrum from "../components/Breadcrum/Breadcrum";

//import assets/images/css files----------------------------------------------------------------------------------------------------

import t1 from "../assets/testdetailicons/t1.svg";
import t3 from "../assets/testdetailicons/t3.svg";
import t5default from "../assets/testdetailicons/t5default.svg";
import leftcompare from "../assets/testdetailicons/leftcompare.svg";
// import rightcompare from "../assets/testdetailicons/rightcompare.svg";
// import thumb from "../assets/testdetailicons/Thumb.svg";
// import Settings from "../assets/generic/Settings.svg";
import filter from "../assets/generic/whitefilter.svg";
// import Approved from "../assets/buildlisticons/approveed.svg";
import refresicon from "../assets/testdetailicons/refresh.svg";
import Bug from "../assets/testdetailicons/bug-icon.svg";
import Toggle1 from "../assets/testdetailicons/toggle1.svg";
import Toggle2 from "../assets/testdetailicons/toggle2.svg";
import chromeicon from "../assets/testdetailicons/Chrome.svg";
import edgeicon from "../assets/testdetailicons/edge.svg";
import explorericon from "../assets/testdetailicons/explorer.svg";
import firefoxicon from "../assets/testdetailicons/firefox.svg";
import operaicon from "../assets/testdetailicons/opera.svg";
import safariicon from "../assets/testdetailicons/safari.svg";
import errorbot from "../assets/generic/errorbot.svg";
import { ImageMagnifier } from "../Utilities/Magnify";

const TestDetailView = ({ match }) => {
  const dispatch = useDispatch();
  var a = Toggle1;
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let queryparamprojectid = params.get("projectid");
  let queryparamprojectname = params.get("projectname");
  let queryparambuildid = params.get("buildid");
  let queryparambuildname = params.get("buildname");
  let queryparamtotalbuilds = params.get("totalbuilds");

  //--------------------------------------local state open---------------------------------------------------------------------------

  const [displayfilterbutton, setDisplayfilterButton] = useState(true);
  const [showcalender, setshowcalender] = useState(false);
  const [buttontext, setbuttontext] = useState("Date Range");
  const [selectedTagOption, setSelectedTagOption] = useState([]);
  const [activetestID, setactiveTestID] = useState(" ");
  const [selectedApproverOption, setSelectedApproverOption] = useState([]);
  const [TestComparisonList, settestComparisonList] = useState([]);
  const [searchTest, setsearchTest] = useState("");
  const [approvedicon, setapprovedicon] = useState(t5default);
  const [toggleicons, settoggleicons] = useState({
    icon2: Toggle1,
    icon2type: 1,
  });
  const [activetestcomparison, setActiveTestComparison] = useState({
    browserVersion: 78,
    browserName: "Chrome",
    images: {
      baseline: {
        resolution: "1440 x 900",
        updatedAt: "Pending",
        screenshotUrl: leftcompare,
        screenshotID: "",
        height: 350,
        width: 350,
      },
      toBeCompared: {
        updatedAt: "Pending",
        screenshotUrl: errorbot,
        screenshotID: "",
      },
    },
  });

  const [activecomparisonoutput, setactivecomparisonoutput] = useState({
    screenshotUrl: errorbot,
    screenshotId: "",
  });
  const [date, setdate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [type, settype] = useState("default");
  const [togglebaseline, setTogglebaseline] = useState({
    left: "Baseline",
    right: "TestOutput",
  });

  const selectionRange = {
    startDate: date.startDate,
    endDate: date.endDate,
    key: "selection",
  };

  //--------------------------------------local state close-----------------------------------------------------------------------------------------------

  //--------------------------------------reducer state open-------------------------------------------------------------------
  const { data: TestComparisonListReducerstate = [], loading } = useSelector(
    (state) => state.GetTestComparisonListsReducer
  );

  const { orgid } = useSelector((state) => state.UserInfodataReducer);

  const { data: TestComparisonResultReducerstate = {}, resultloading } =
    useSelector((state) => state.GetTestComparisonResultReducer);

  //------------------------------------reducer state closed-------------------------------------------------------------------

  //---------------------------------------use Effects open----------------------------------------------------------------------
  useEffect(() => {
    dispatch(GetTagsAction());
    dispatch(GetApproversAction());
    dispatch(UserInfoAction());
  }, []);

  useEffect(() => {
    dispatch(
      GetTestComparisonListAction(queryparamprojectid, queryparambuildid)
    );
  }, []);

  useEffect(() => {
    settestComparisonList([
      ...TestComparisonListReducerstate.map((e) => {
        return e;
      }),
    ]);
    if (TestComparisonListReducerstate.length > 0) {
      setActiveTestComparison(TestComparisonListReducerstate[0]);
      setactiveTestID(TestComparisonListReducerstate[0].testID);
    }
  }, [TestComparisonListReducerstate]);

  useEffect(() => {
    if (
      orgid !== "" &&
      activetestcomparison.images.baseline.screenshotID !== "" &&
      activetestcomparison.images.toBeCompared.screenshotID !== ""
    ) {
      const final = {
        orgId: orgid,
        projectId: queryparamprojectid,
        buildId: queryparambuildid,
        firstScreenshotId: activetestcomparison.images.baseline.screenshotID,
        secondScreenshotId:
          activetestcomparison.images.toBeCompared.screenshotID,
      };
      dispatch(testcomparisonaction(final));
    }
  }, [activetestcomparison, orgid]);

  useEffect(() => {
    const filteredResults = TestComparisonListReducerstate.filter((e) => {
      return e.testID.toLowerCase().includes(searchTest);
    });
    settestComparisonList(filteredResults);
  }, [searchTest]);

  useEffect(() => {
    if (Object.keys(TestComparisonResultReducerstate).length > 0) {
      setactivecomparisonoutput(TestComparisonResultReducerstate);
    }
  }, [TestComparisonResultReducerstate]);

  useEffect(() => {
    var searchobject = {
      keyword: searchTest,
      Tags: selectedTagOption,
      Approvers: selectedApproverOption,
      startdate: date.startDate,
      endDate: date.endDate,
    };
    console.log(searchobject);
  }, [selectedTagOption, selectedApproverOption, date]);

  useEffect(() => {
    return () => {
      dispatch(EmptyTestComparisonreducerstate());
    };
  }, []);
  //---------------------------------------use Effects closed-----------------------------------------------------------------------------

  //----------------------------------------defined Functions open------------------------------------------------------------------------

  const setActiveHandler = (testid) => {
    const activetestObject = TestComparisonList.find((e) => {
      return e.testID === testid;
    });

    setActiveTestComparison(activetestObject);
    setactiveTestID(testid);

    if (
      orgid !== "" &&
      activetestObject.images.baseline.screenshotID !== "" &&
      activetestObject.images.toBeCompared.screenshotID !== ""
    ) {
      const final = {
        orgId: orgid,
        projectId: queryparamprojectid,
        buildId: queryparambuildid,
        firstScreenshotId: activetestObject.images.baseline.screenshotID,
        secondScreenshotId: activetestObject.images.toBeCompared.screenshotID,
      };
      dispatch(testcomparisonaction(final));
    }
  };

  const selectDateRangeHandler = (item) => {
    let startDate = moment(item.selection.startDate).format("YYYY-MM-DD");
    let endDate = moment(item.selection.endDate).format("YYYY-MM-DD");

    setdate({
      startDate: startDate,
      endDate: endDate,
    });
    let s = `${startDate} to ${endDate}`;
    setbuttontext(s);
    setshowcalender(!showcalender);
  };

  const clearDateRangeHandler = () => {
    setbuttontext("Set Date Range");
    setdate({
      startDate: new Date(),
      endDate: new Date(),
    });
  };

  const clearAllFiltersHandler = () => {
    setSelectedTagOption([]);
    setSelectedApproverOption([]);
    setdate({
      startDate: null,
      endDate: null,
    });
    setbuttontext("Set Date Range");
  };

  const selectTestId = (e) => {
    setsearchTest(e.target.value);
  };

  const selectbrowsericonhandler = (e) => {
    switch (e) {
      case "Chrome":
        return chromeicon;

      case "Safari":
        return safariicon;

      case "edge":
        return edgeicon;

      case "explorer":
        return explorericon;

      case "opera":
        return operaicon;

      case "firefox":
        return firefoxicon;

      default:
        return chromeicon;
    }
  };

  const toggleHandler = (type, icon) => {
    if (icon === "icon2") {
      settype("icon2");
      setTogglebaseline({
        left: "TestOutput",
        right: "Baseline",
      });
      if (type === 1) {
        settoggleicons({
          icon2: Toggle2,
          icon2type: 2,
        });
      } else {
        settoggleicons({
          icon2: Toggle1,
          icon2type: 1,
        });
      }
    }
  };
  const ChangeResolutionHandler = () => {
    if (type === "default") {
      if (activetestcomparison.images.baseline.resolution === "1280 x 720") {
        return (
          <>
            <div className="bg-white-400 w-4/12 h-80">
              <img
                className="h-full w-full"
                src={activetestcomparison.images.baseline.screenshotUrl}
                alt="text"
              />
            </div>
            <div className="  bg-white-400 w-4/12 h-80">
              <img
                className="h-full w-full"
                src={activecomparisonoutput.screenshotUrl}
                alt="text"
              />
            </div>
          </>
        );
      } else if (
        activetestcomparison.images.baseline.resolution === "1440 x 900"
      ) {
        return (
          <>
            <div className=" w-5/12 h-92 bg-white-400">
              <img
                className="h-full w-full"
                src={activetestcomparison.images.baseline.screenshotUrl}
                alt="text"
              />
            </div>
            <div className="w-5/12 h-92 bg-white-400">
              <img
                className="h-full w-full"
                src={activecomparisonoutput.screenshotUrl}
                alt="text"
              />
            </div>
          </>
        );
      } else if (
        activetestcomparison.images.baseline.resolution === "1920 x 1080"
      ) {
        return (
          <>
            <div className="w-13/14 h-96 bg-white-400">
              <img
                className="h-full w-full"
                src={activetestcomparison.images.baseline.screenshotUrl}
                alt="text"
              />
            </div>
            <div className=" w-13/14 h-96 bg-white-400">
              <img
                className="h-full w-full"
                src={activecomparisonoutput.screenshotUrl}
                alt="text"
              />
            </div>
          </>
        );
      }
    } else if (type === "icon1") {
      if (activetestcomparison.images.baseline.resolution === "1280 x 720") {
        return (
          <>
            <div className="bg-gray-0 w-4/12 h-80">
              <img
                className="h-full w-full"
                src={activetestcomparison.images.baseline.screenshotUrl}
                alt="text"
              />
            </div>
            <div className=" bg-gray-0 w-4/12 h-80">
              <img
                className="h-full w-full"
                src={activecomparisonoutput.screenshotUrl}
                alt="text"
              />
            </div>
          </>
        );
      } else if (
        activetestcomparison.images.baseline.resolution === "1440 x 900"
      ) {
        return (
          <>
            <div className="  w-5/12 h-92 bg-gray-0">
              <img
                className="h-full w-full"
                src={activetestcomparison.images.baseline.screenshotUrl}
                alt="text"
              />
            </div>
            <div className=" w-5/12 h-92 bg-gray-0">
              <img
                className="h-full w-full"
                src={activecomparisonoutput.screenshotUrl}
                alt="text"
              />
            </div>
          </>
        );
      } else if (
        activetestcomparison.images.baseline.resolution === "1920 x 1080"
      ) {
        return (
          <>
            <div className="w-13/14 h-96 bg-gray-0">
              <img
                className="h-full w-full"
                src={activetestcomparison.images.baseline.screenshotUrl}
                alt="text"
              />
            </div>
            <div className=" w-13/14 h-96 bg-gray-0">
              <img
                className="h-full w-full"
                src={activecomparisonoutput.screenshotUrl}
                alt="text"
              />
            </div>
          </>
        );
      }
    } else if (type === "icon2") {
      if (activetestcomparison.images.baseline.resolution === "1280 x 720") {
        return (
          <>
            <div className="bg-gray-0 h-80 w-4/12">
              <img
                className="h-full w-full"
                src={activecomparisonoutput.screenshotUrl}
                alt="text"
              />
            </div>
            <div className="  bg-gray-0 h-80 w-4/12">
              <img
                className="h-full w-full"
                src={activetestcomparison.images.baseline.screenshotUrl}
                alt="text"
              />
            </div>
          </>
        );
      } else if (
        activetestcomparison.images.baseline.resolution === "1440 x 900"
      ) {
        return (
          <>
            <div className=" w-5/12 h-92 bg-gray-0">
              <img
                className="h-full w-full"
                src={activecomparisonoutput.screenshotUrl}
                alt="text"
              />
            </div>
            <div className="w-5/12 h-92 bg-gray-0">
              <img
                className="h-full w-full"
                src={activetestcomparison.images.baseline.screenshotUrl}
                alt="text"
              />
            </div>
          </>
        );
      } else if (
        activetestcomparison.images.baseline.resolution === "1920 x 1080"
      ) {
        return (
          <>
            <div className="w-13/14 h-96 bg-gray-0">
              <img
                className="h-full w-full"
                src={activecomparisonoutput.screenshotUrl}
                alt="text"
              />
            </div>
            <div className=" w-13/14 h-96 bg-gray-0">
              <img
                className="h-full w-full"
                src={activetestcomparison.images.baseline.screenshotUrl}
                alt="text"
              />
            </div>
          </>
        );
      }
    } else if (type === "icon3") {
      if (activetestcomparison.images.baseline.resolution === "1280 x 720") {
        return (
          <>
            <div className="flex items-center justify-center bg-gray-0 w-4/12 h-80">
              <ImageMagnifier
                width={"200px"}
                src={activecomparisonoutput.screenshotUrl}
              />
            </div>
          </>
        );
      } else if (
        activetestcomparison.images.baseline.resolution === "1440 x 900"
      ) {
        return (
          <>
            <div className="flex items-center justify-center  w-5/12 bg-gray-0 h-92">
              <ImageMagnifier
                width={"250px"}
                src={activecomparisonoutput.screenshotUrl}
              />
            </div>
          </>
        );
      } else if (
        activetestcomparison.images.baseline.resolution === "1920 x 1080"
      ) {
        return (
          <>
            <div className=" flex items-center justify-center bg-gray-0 h-96">
              <ImageMagnifier
                width={"600px"}
                height={"350px"}
                src={activecomparisonoutput.screenshotUrl}
              />
            </div>
          </>
        );
      }
    }
  };

  const listing = () => {
    if (loading === false && TestComparisonList.length > 0) {
      return TestComparisonList.map((e) => {
        return (
          <div
            onClick={() => setActiveHandler(e.testID)}
            className={
              e.testID === activetestID
                ? " border-2  border-blue-500  box-border  bg-gray-0 rounded-lg p-4 mb-4 cursor-pointer"
                : "  box-border  bg-gray-0 rounded-lg p-4 mb-4 cursor-pointer"
            }
          >
            <div className="flex  flex-col flex-wrap  justify-start items-start">
              <p className="text-xs font-lato mb-2">Test Id: {e.testID}</p>
              {/* <div className="px-2 py-1 rounded-lg  bg-blue-400 text-gray-100 text-xs font-lato font-light">
                    {e.testStatus}
                  </div> */}
            </div>
            <img
              className="w-full py-2 px-2 h-52"
              src={e.images.toBeCompared.screenshotUrl}
              alt="text"
            />
            <div className="text-xs font-lato my-2 text-gray-600  ">
              Started 24 min ago, by yash verma
            </div>
            <div className="flex  flex-col flex-wrap  justify-start items-start">
              <div className="px-2 py-1 rounded-lg  bg-blue-400 text-gray-100 text-xs font-lato font-light">
                {e.testStatus}
              </div>
            </div>
          </div>
        );
      });
    } else if (!loading) {
      return <ErrorHandling></ErrorHandling>;
    } else if (loading) {
      return <TestComparisonLoading></TestComparisonLoading>;
    }
  };

  //----------------------------------------defined Functions closed---------------------------------------

  return (
    <div className="overflow-hidden h-full">
      <Breadcrum
        projectname={queryparamprojectname}
        buildname={queryparambuildname}
        projectid={queryparamprojectid}
        buildid={queryparambuildid}
        totalbuilds={queryparamtotalbuilds}
        type="buildlisting"
      />
      <div className=" bg-gray-0 overflow-hidden h-full">
        {/* -------------------------------------------Top search bar section open----------------------------------------- */}
        <div className="flex border border-gray-300 py-2 px-6  items-center  justify-between shadow-lg bg-gray-0 mb-2 ">
          <div className="flex w-screen bg-gray-0 ">
            <div
              style={{ minWidth: "290px" }}
              className={`flex items-center  px-2 py-1 border border-gray-300   rounded-xl mr-4 min-w-max ${
                displayfilterbutton ? "w-1/5" : "w-2/6"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                style={{ width: " -webkit-fill-available" }}
                className="bg-gray-0 outline-none ml-2 italic "
                type="text"
                placeholder="Search in Tests"
                value={searchTest}
                onChange={selectTestId}
                autoComplete="off"
              />
            </div>

            {displayfilterbutton ? (
              <div
                className="flex px-2 py-1 items-center  border border-gray-300 rounded-lg bg-teal-450 hover:bg-teal-500"
                onClick={() => setDisplayfilterButton(false)}
              >
                <img
                  className="w-4 h-4 mr-1 text-gray-50"
                  src={filter}
                  alt="text"
                />
                <p className="text-sm font-lato font-light text-gray-50 cursor-pointer">
                  Add Filter
                </p>
              </div>
            ) : (
              <Filter
                setDisplayfilterButton={setDisplayfilterButton}
                setshowcalender={setshowcalender}
                clearDateRangeHandler={clearDateRangeHandler}
                setSelectedTagOption={setSelectedTagOption}
                setSelectedApproverOption={setSelectedApproverOption}
                clearAllFiltersHandler={clearAllFiltersHandler}
                selectedApproverOption={selectedApproverOption}
                selectedTagOption={selectedTagOption}
                showcalender={showcalender}
                buttontext={buttontext}
              ></Filter>
            )}
          </div>
          {/* <img
            className="w-10 h-6 ml-4 p-1 border rounded-2xl border-gray-300"
            src={Settings}
            alt="text"
          /> */}
        </div>
        {showcalender && (
          <DateRangePicker
            ranges={[selectionRange]}
            onChange={(range) => selectDateRangeHandler(range)}
          />
        )}

        <div style={{ height: "83vh" }} className="flex ">
          {/*---------------------------------------------- left section---------------------------------------------------- */}
          <div
            style={{
              height: "100%",
              width: "26%",
              minHeight: "96px",
              minWidth: "320px",
            }}
            className="bg-gray-0  mr-2 overflow-auto shadow-lg"
          >
            <div
              style={{ height: "100%", minHeight: "100%" }}
              className="bg-gray-0 box-border p-4 shadow-lg border border-gray-200 bg-white-400"
            >
              {listing()}
            </div>
          </div>

          {/*---------------------------------------------- right  section---------------------------------------------- */}
          <div
            style={{ height: "100%" }}
            className=" flex-grow bg-gray-0 ml-2 shadow-lg "
          >
            {/* ------------------------------------resolution resizing bar------------------------------------------ */}
            <div className="flex border   justify-between border-gray-200  pt-3 px-4 bg-gray-0">
              <div className="flex bg-gray-0 items-center">
                <img
                  className={
                    type === "icon1"
                      ? "box-content w-5 h-5 mr-3 bg-gray-250 p-2 cursor-pointer hover:bg-red-200"
                      : "box-content w-5 h-5 mr-3   p-2 cursor-pointer hover:bg-red-200"
                  }
                  src={t1}
                  alt="text"
                  onClick={() => {
                    settype("icon1");
                    setTogglebaseline({
                      left: "Baseline",
                      right: "TestOutput",
                    });
                  }}
                />

                <img
                  className={
                    type === "icon3"
                      ? "box-content w-5 h-5 mr-3 bg-gray-250 p-2 cursor-pointer hover:bg-red-200"
                      : "box-content w-5 h-5 mr-3   p-2 text-green-500 cursor-pointer hover:bg-red-200"
                  }
                  src={t3}
                  alt="text"
                  onClick={() => {
                    settype("icon3");
                    setTogglebaseline({
                      left: "Baseline",
                      right: "TestOutput",
                    });
                  }}
                />

                <img
                  className={
                    type === "icon2"
                      ? "box-content w-5 h-5 mr-3 bg-gray-250 p-2  cursor-pointer hover:bg-red-200"
                      : "box-content w-5 h-5 mr-3   p-2 cursor-pointer hover:bg-red-200"
                  }
                  src={toggleicons.icon2}
                  alt="text"
                  // onClick={() => {
                  //   settype("icon2");
                  //   setTogglebaseline({
                  //     left: "TestOutput",
                  //     right: "Baseline",
                  //   });
                  // }}
                  onClick={() => toggleHandler(toggleicons.icon2type, "icon2")}
                />
              </div>

              <div
                style={{ height: "fit-content" }}
                className="flex    px-4 bg-gray-0 "
              >
                <img
                  className="pr-2 pb-2"
                  src={selectbrowsericonhandler(
                    activetestcomparison.browserName
                  )}
                  alt="text"
                />
                <span className="mr-6 font-lato font-light">
                  {activetestcomparison.browserVersion}
                </span>
                {/* <p
                  className={
                    activetestcomparison.images.baseline.resolution ===
                    "1280 x 720"
                      ? `mr-6 border-b-4 border-teal-450 pb-2 text-base font-lato font-light cursor-pointer `
                      : `mr-6 pb-2 font-lato font-light cursor-pointer  `
                  }
                  onClick={() =>
                    setActiveTestComparison({
                      ...activetestcomparison,
                      images: {
                        baseline: {
                          ...activetestcomparison.images.baseline,
                          resolution: "1280 x 720",
                          height: 300,
                          width: 300,
                        },
                        toBeCompared: {
                          ...activetestcomparison.images.toBeCompared,
                          resolution: "1280 x 720",
                        },
                      },
                    })
                  }
                >
                  1280 x 720
                </p>
                <p
                  className={
                    activetestcomparison.images.baseline.resolution ===
                    "1440 x 900"
                      ? `mr-6 border-b-4 border-teal-450 pb-2 font-lato font-light cursor-pointer`
                      : `mr-6 pb-2 font-lato font-light cursor-pointer`
                  }
                  onClick={() =>
                    setActiveTestComparison({
                      ...activetestcomparison,
                      images: {
                        baseline: {
                          ...activetestcomparison.images.baseline,
                          resolution: "1440 x 900",
                          height: 350,
                          width: 350,
                        },
                        toBeCompared: {
                          ...activetestcomparison.images.toBeCompared,
                          resolution: "1440 x 900",
                        },
                      },
                    })
                  }
                >
                  1440 x 900
                </p>
                <p
                  className={
                    activetestcomparison.images.baseline.resolution ===
                    "1920 x 1080"
                      ? `mr-4 border-b-4 border-teal-450 pb-2 font-lato font-light cursor-pointer`
                      : `mr-4 pb-2 font-lato font-light cursor-pointer`
                  }
                  onClick={() =>
                    setActiveTestComparison({
                      ...activetestcomparison,
                      images: {
                        baseline: {
                          ...activetestcomparison.images.baseline,
                          resolution: "1920 x 1080",
                          height: 400,
                          width: 400,
                        },
                        toBeCompared: {
                          ...activetestcomparison.images.toBeCompared,
                          resolution: "1920 x 1080",
                        },
                      },
                    })
                  }
                >
                  1920 x 1080
                </p> */}

                <p
                  className={
                    activetestcomparison.images.baseline.resolution ===
                    "1920 x 1080"
                      ? `mr-4 border-b-4 border-teal-450 pb-2 font-lato font-light cursor-pointer`
                      : `mr-4 border-b-4 border-teal-450 pb-2 font-lato font-light cursor-pointer`
                  }
                >
                  {activetestcomparison.images.baseline.resolution}
                </p>
                <img
                  className={
                    type === "icon4"
                      ? "box-content w-5 h-5 mr-3 bg-gray-250 p-2 cursor-pointer"
                      : "box-content w-5 h-5 mr-3   p-2 cursor-pointer"
                  }
                  src={type === "icon4" ? t1 : Bug}
                  alt="text"
                  onClick={() => settype("icon1")}
                />

                <img
                  className={
                    type === "icon4"
                      ? "box-content w-6 h-6 mr-3 bg-gray-250 p-2  cursor-pointer hover:bg-green-200"
                      : "box-content w-6 h-5  mr-3   p-2 cursor-pointer hover:bg-green-200"
                  }
                  src={approvedicon}
                  // onMouseOver={() => setapprovedicon(Approved)}
                  // onMouseOut={() => setapprovedicon(t5default)}
                  alt="text"
                  onClick={() => settype("icon1")}
                />
              </div>
            </div>

            <div className="flex justify-around bg-gray-0 mx-4 mt-4">
              <div
                className={
                  type === "icon3"
                    ? "flex-col bg-gray-0 hidden"
                    : "flex-col bg-gray-0"
                }
              >
                <p className="text-sm font-light font-lato text-center">
                  {togglebaseline.left}
                </p>
                <div className="flex">
                  <img className="w-4 h2" src={refresicon} alt="text" />
                  <p className="text-gray-500 text-xs my-2 ml-2 font-lato font-light">
                    24 mins ago
                  </p>
                </div>
              </div>

              <div className="flex-col bg-gray-0 ">
                <p className="text-sm font-light font-lato text-center">
                  {togglebaseline.right}
                </p>
                <div className="flex">
                  <img className="w-4 h2" src={refresicon} alt="text" />
                  <p className="text-gray-500 text-xs my-2 ml-2 font-lato font-light">
                    24 mins ago
                  </p>
                </div>
              </div>
            </div>
            <div className="flex  mx-2 mt-4 justify-around items-center bg-white-700">
              {ChangeResolutionHandler()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDetailView;
