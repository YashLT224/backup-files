//lib/packages import---------------------------------------------------------------------------------------------------------------------------
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

//import components/variables/functions/constants----------------------------------------------------------------------------------------------------
import Breadcrum from "../components/Breadcrum/Breadcrum";
import TestComparisonLoading from "../components/TestComparisonLoading/TestComparisonloading";
import ErrorHandling from "../components/ErrorHandling/Handling";
import { ImageMagnifier } from "../Utilities/Magnify";
import { gettime } from "../Utilities/gettime";
import {
  GetTagsAction,
  GetApproversAction,
} from "../services/actions/createNewProjectAction";
import {
  GetTestComparisonListAction,
  testcomparisonaction,
  EmptyTestComparisonreducerstate,
  EmptyTestResultreducerstate,
} from "../services/actions/TestComparison";
import { UserInfoAction } from "../services/actions/userDetailsAction";
//import assets/images/css files----------------------------------------------------------------------------------------------------

import t1 from "../assets/testdetailicons/t1.svg";
import t3 from "../assets/testdetailicons/t3.svg";
import t5default from "../assets/testdetailicons/t5default.svg";
import leftcompare from "../assets/testdetailicons/leftcompare.svg";
import filter from "../assets/generic/whitefilter.svg";
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

//----------------------------------------defined Functions open------------------------------------------------------------------------

const TestDetailview2 = () => {
  const dispatch = useDispatch();

  let search = window.location.search;
  let params = new URLSearchParams(search);
  let queryparamprojectid = params.get("projectid");
  let queryparamprojectname = params.get("projectname");
  let queryparambuildid = params.get("buildid");
  let queryparambuildname = params.get("buildname");
  let queryparamtotalbuilds = params.get("totalbuilds");

  //--------------------------------------reducer state open-------------------------------------------------------------------
  const { data: TestComparisonListReducerstate = [], loading } = useSelector(
    (state) => state.GetTestComparisonListsReducer
  );

  const { orgid } = useSelector((state) => state.UserInfodataReducer);

  const { data: TestComparisonResultReducerstate = {} } = useSelector(
    (state) => state.GetTestComparisonResultReducer
  );

  //------------------------------------reducer state closed-------------------------------------------------------------------

  //--------------------------------------local state open---------------------------------------------------------------------------

  // const [displayfilterbutton, setDisplayfilterButton] = useState(true);
  // const [showcalender, setshowcalender] = useState(false);
  // const [buttontext, setbuttontext] = useState("Date Range");
  const [selectedTagOption, setSelectedTagOption] = useState([]);
  const [selectedApproverOption, setSelectedApproverOption] = useState([]);
  const [date, setdate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const selectionRange = {
    startDate: date.startDate,
    endDate: date.endDate,
    key: "selection",
  };
  //--filter section state closed

  const [searchTest, setsearchTest] = useState("");
  const [approvedicon, setapprovedicon] = useState(t5default);
  //main state
  const [TestComparisonList, settestComparisonList] = useState([]);
  const [activetestcomparison, setActiveTestComparison] = useState({
    browserVersion: 78,
    height: "300px",
    width: "300px",
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

  const [toggleobject, settoggleobject] = useState({
    activetestID: "",
    icontype: "default",
    leftside: "Baseline",
    leftsidetime: "pending",
    rightside: "TestOutput",
    rightsidetime: "pending",
    Baselinecolor: "green",
    TestOutputcolor: "yellow",
    icon2toggletype: 1,
    icon2image: Toggle1,
  });

  const [activetestID, setactiveTestID] = useState("");

  //--------------------------------------local state close-----------------------------------------------------------------------------------------------
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
      setActiveTestComparison({
        ...TestComparisonListReducerstate[0],
      });
      setactiveTestID(TestComparisonListReducerstate[0].testID);
      settoggleobject({
        ...toggleobject,
        leftsidetime: gettime(
          TestComparisonListReducerstate[0].images.baseline.updatedAt
        ),
      });
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
    if (Object.keys(TestComparisonResultReducerstate).length > 0) {
      setactivecomparisonoutput(TestComparisonResultReducerstate);
      settoggleobject({
        ...toggleobject,
        rightsidetime: gettime(
          TestComparisonListReducerstate[0].images.baseline.updatedAt
        ),
      });
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

  useEffect(() => {}, [activetestcomparison]);
  useEffect(() => {
    return () => {
      dispatch(EmptyTestComparisonreducerstate());
      dispatch(EmptyTestResultreducerstate());
    };
  }, []);

  //----------------------------------------defined Functions open------------------------------------------------------------------------
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

  const ChangeResolutionHandler = () => {
    if (toggleobject.icontype === "default") {
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
    } else if (toggleobject.icontype === "icon1") {
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
    } else if (toggleobject.icontype === "icon2") {
      if (activetestcomparison.images.baseline.resolution === "1280 x 720") {
        return (
          <>
            <div
              className={`bg-gray-0 h-80 w-4/12   ${
                toggleobject.leftside === "TestOutput"
                  ? "bg-gray-150"
                  : "bg-gray-0"
              } `}
            >
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
          </>
        );
      }
    } else if (toggleobject.icontype === "icon3") {
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

  const listings = () => {
    if (loading === false && TestComparisonList.length > 0) {
      return TestComparisonList.map((e) => {
        return (
          <div
            onClick={() => setActiveHandler(e.testID)}
            className={
              e.testID === activetestID
                ? " border-2  border-blue-500  box-border  bg-gray-0 rounded-lg mx-3 p-2 mb-4 cursor-pointer"
                : "  box-border  bg-gray-0 rounded-lg mx-3 p-2 mb-4 cursor-pointer"
            }
          >
            <div className="flex  flex-col flex-wrap  justify-start items-start">
              <p className="text-xs font-lato mb-2 pt-1 pl-1">
                Test Id: {e.testID}
              </p>
            </div>
            <img
              className="w-full py-2  h-52"
              src={e.images.toBeCompared.screenshotUrl}
              alt="text"
            />
            <div className="text-xs font-lato my-2 text-gray-600 pl-1 ">
              Started {gettime(e.testMetaData.startedAt)} by{" "}
              {e.testMetaData.username}
            </div>
            <div className="flex  flex-col flex-wrap  justify-start items-start">
              <div className=" ml-1 px-4 py-1 rounded-lg  bg-blue-400 text-gray-100 text-xs font-lato font-light">
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
    <div>
      <Breadcrum
        projectname={queryparamprojectname}
        buildname={queryparambuildname}
        projectid={queryparamprojectid}
        buildid={queryparambuildid}
        totalbuilds={queryparamtotalbuilds}
        type="buildlisting"
      />

      <div className="flex">
        {/* -----------------------------------left section open ------------------------------------------------------------ */}
        <div
          style={{
            minWidth: "318px",
            maxWidth: "320px",
            height: `calc(100vh - 83px) `,
          }}
          className="bg-gray-0 flex flex-col  shadow-xl"
        >
          <div className=" flex py-2  items-center bg-gray-0 pl-3 mb-4">
            <div className="flex   mr-2 bg-gray-0 border border-gray-300   rounded-lg px-2 py-1 items-center">
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
                style={{ width: " -webkit-fill-available", minWidth: "200px" }}
                className="bg-gray-0 outline-none ml-2 italic   "
                type="text"
                placeholder="Search in Tests"
                autoComplete="off"
              />
            </div>

            <div className="flex items-center justify-center bg-teal-450 hover:bg-teal-500  px-3 py-2  mr-3 rounded-md">
              <img className="w-4 h-4  text-gray-50" src={filter} alt="text" />
            </div>
          </div>
          <div className="bg-gray-0 flex-grow overflow-scroll">
            {listings()}
          </div>
        </div>
        {/* -----------------------------------left section closed ------------------------------------------------------------ */}

        {/* -----------------------------------right section open ------------------------------------------------------------ */}
        <div className="flex-grow bg-gray-0 ml-2 shadow-xl">
          {/* ---------------right sections icons and resolution panel open */}
          <div className="flex border   justify-between border-gray-200  pt-3 px-4 bg-gray-0">
            <div className="flex bg-gray-0 items-center">
              <img
                className={
                  toggleobject.icontype === "icon1"
                    ? "box-content w-5 h-5 mr-3 bg-gray-250 p-2 cursor-pointer hover:bg-red-200"
                    : "box-content w-5 h-5 mr-3   p-2 cursor-pointer hover:bg-red-200"
                }
                src={t1}
                alt="text"
                onClick={() => {
                  settoggleobject({
                    ...toggleobject,
                    icontype: "icon1",
                    leftside: "Baseline",
                    rightside: "TestOutput",
                    Baselinecolor: "green",
                    TestOutputcolor: "yellow",
                  });
                }}
              />

              <img
                className={
                  toggleobject.icontype === "icon3"
                    ? "box-content w-5 h-5 mr-3 bg-gray-250 p-2 cursor-pointer hover:bg-red-200"
                    : "box-content w-5 h-5 mr-3   p-2 text-green-500 cursor-pointer hover:bg-red-200"
                }
                src={t3}
                alt="text"
                onClick={() => {
                  settoggleobject({
                    ...toggleobject,
                    icontype: "icon3",
                    leftside: "Baseline",
                    rightside: "TestOutput",
                    Baselinecolor: "green",
                    TestOutputcolor: "yellow",
                  });
                }}
              />

              <img
                className={
                  toggleobject.icontype === "icon2"
                    ? "box-content w-5 h-5 mr-3 bg-gray-250 p-2  cursor-pointer hover:bg-red-200"
                    : "box-content w-5 h-5 mr-3   p-2 cursor-pointer hover:bg-red-200"
                }
                src={toggleobject.icon2image}
                alt="text"
                onClick={() => {
                  settoggleobject({
                    ...toggleobject,
                    icon2toggletype: toggleobject.icon2toggletype === 1 ? 2 : 1,
                    icontype: "icon2",
                    leftside:
                      toggleobject.icon2toggletype === 1
                        ? "TestOutput"
                        : "Baseline",
                    leftsidetime:
                      toggleobject.icon2toggletype === 1
                        ? toggleobject.rightsidetime
                        : toggleobject.leftsidetime,
                    rightside:
                      toggleobject.icon2toggletype === 1
                        ? "Baseline"
                        : "TestOutput",
                    rightsidetime:
                      toggleobject.icon2toggletype === 1
                        ? toggleobject.leftsidetime
                        : toggleobject.rightsidetime,
                    icon2image:
                      toggleobject.icon2toggletype === 1 ? Toggle2 : Toggle1,
                    Baselinecolor:
                      toggleobject.icon2toggletype === 1 ? "yellow" : "green",
                    TestOutputcolor:
                      toggleobject.icon2toggletype === 1 ? "green" : "yellow",
                  });
                }}
              />
            </div>

            <div
              style={{ height: "fit-content" }}
              className="flex     bg-gray-0 "
            >
              <img
                className="pr-2 pb-2"
                src={selectbrowsericonhandler(activetestcomparison.browserName)}
                alt="text"
              />
              <span className="mr-6 font-lato font-light">
                {activetestcomparison.browserVersion}
              </span>
              <p
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
              </p>

              <img
                className={
                  toggleobject.icontype === "icon4"
                    ? "box-content w-5 h-5 mr-3 bg-gray-250 p-2 cursor-pointer"
                    : "box-content w-5 h-5 mr-3   p-2 cursor-pointer"
                }
                src={toggleobject.icontype === "icon4" ? t1 : Bug}
                alt="bugicon"
                // onClick={() => settype("icon1")}
              />

              <img
                className={
                  toggleobject.icontype === "icon4"
                    ? "box-content w-6 h-6 mr-1 bg-gray-250 p-2  cursor-pointer hover:bg-green-200"
                    : "box-content w-6 h-5  mr-1   p-2 cursor-pointer hover:bg-green-200"
                }
                src={approvedicon}
                alt="approveicon"
                // onClick={() => settype("icon1")}
              />
            </div>
          </div>

          {/* -------------------------------------------right section icons and resolution closed-------------------------- */}
          {/* baseline/testoutput panel */}
          <div className="flex items-center">
            {toggleobject.icontype !== "icon3" ? (
              <>
                <div className="flex-1 bg-gray-0 mr-1">
                  <div
                    className={`flex   pl-8 py-4 border-gray-300 border-b-2 ${
                      toggleobject.leftside === "TestOutput"
                        ? "bg-gray-150"
                        : "bg-gray-0"
                    }`}
                  >
                    <div
                      className={`text-sm font-bold font-lato text-center mr-3 text-${toggleobject.Baselinecolor}-500`}
                    >
                      {" "}
                      {toggleobject.leftside}
                    </div>
                    <div className="flex items-center mr-2">
                      <img className="w-4 h2" src={refresicon} alt="text" />
                      <p className="text-gray-500 text-xs   ml-1 font-lato font-light">
                        Updated {toggleobject.leftsidetime}
                      </p>
                    </div>
                    <div
                      className={`flex items-center border border-gray-300 ${
                        toggleobject.icon2toggletype === 1
                          ? "invisible"
                          : "visible"
                      }`}
                    >
                      <p className="text-black-500 text-sm   ml-1 font-lato font-normal pl-1 ">
                        Mismatch% :
                      </p>
                      <p className="text-black-500 text-sm   ml-1 font-lato font-normal pr-2">
                        {activecomparisonoutput.misMatchPercentage}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-gray-0 ">
                  {" "}
                  <div
                    className={`flex  pl-8 py-4 border-gray-300 border-b-2 ${
                      toggleobject.rightside === "TestOutput"
                        ? "bg-gray-150"
                        : "bg-gray-0"
                    }`}
                  >
                    <div
                      className={`text-sm font-bold font-lato text-center mr-3 text-${toggleobject.TestOutputcolor}-500`}
                    >
                      {" "}
                      {toggleobject.rightside}
                    </div>
                    <div className="flex items-center mr-2">
                      <img className="w-4 h2" src={refresicon} alt="text" />
                      <p className="text-gray-500 text-xs   ml-1 font-lato font-light">
                        Updated {toggleobject.rightsidetime}
                      </p>
                    </div>
                    <div
                      className={`flex items-center border border-gray-300 ${
                        toggleobject.icon2toggletype === 1
                          ? "visible"
                          : "invisible"
                      }`}
                    >
                      <p className="text-black-500 text-sm     ml-1 font-lato font-normal pl-1 ">
                        Mismatch% :
                      </p>
                      <p className="text-black-500 text-sm    ml-1 font-lato font-normal pr-2">
                        {activecomparisonoutput.misMatchPercentage}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 justify-center items-center bg-gray-0 mr-1">
                <div className="flex justify-center items-center bg-gray-0 pl-8 py-4 border-gray-300 border-b-2">
                  <div
                    className={`text-sm font-bold font-lato text-center mr-3 text-${toggleobject.TestOutputcolor}-500`}
                  >
                    {" "}
                    {toggleobject.rightside}
                  </div>
                  <div className="flex items-center mr-2">
                    <img className="w-4 h2" src={refresicon} alt="text" />
                    <p className="text-gray-500 text-xs   ml-1 font-lato font-light">
                      Updated {toggleobject.rightsidetime}
                    </p>
                  </div>
                  <div className={`flex items-center border border-gray-300 `}>
                    <p className="text-gray-800 text-sm   ml-1 font-lato font-light pl-1 ">
                      mismatch% :
                    </p>
                    <p className="text-gray-800 text-sm   ml-1 font-lato font-light pr-2">
                      {activecomparisonoutput.misMatchPercentage}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* resolution panel */}
          <div className="flex  mx-2 mt-12 justify-around items-center bg-white-700">
            {ChangeResolutionHandler()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDetailview2;
