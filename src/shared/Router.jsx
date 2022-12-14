import { Route, Routes, useNavigate } from "react-router-dom"
import SignUpNickname from "../pages/signup/SignUpNickname"
import SignUp from "../pages/signup/SignUp"
import SignUpEmail from "../pages/signup/SignUpEmail"
import ProfilePage from "../pages/profile/ProfilePage"
import EditProfilePage from "../pages/profile/EditProfilePage"
import DetailProfilePage from "../pages/profile/DetailProfilePage"
import MainPage from "../pages/MainPage"
import IntroPage from "../pages/IntroPage"
import MemberPage from "../pages/MemberPage"
import AddPromisePage from "../pages/promise/AddPromisePage"
import DetailPromisePage from "../pages/promise/DetailPromisePage"
import SignUpChange from "../pages/signup/SignUpChange"
import KakaoPage from "../pages/signup/KakaoPage"
import NaverPage from "../pages/signup/NaverPage"
import PromiseLeaderPage from "../pages/promise/PromiseLeaderPage"
import AddCreditPage from "../pages/profile/AddCreditPage"
import ChatPage from "../pages/ChatPage"
import DonationPage from "../pages/donation/DonationPage"
import AddDonationPage from "../pages/donation/AddDonationPage"
import DetailDonationPage from "../pages/donation/DetailDonationPage"
import MonthlyPage from "../pages/MonthlyPage"
import { useEffect, useState } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { __getLogin } from "../redux/modules/login"
import MyHistoryPage from "../pages/profile/MyHistoryPage"
import Swal from "sweetalert2"
import  {  NativeEventSource ,  EventSourcePolyfill  }  from  'event-source-polyfill' ;

const Router = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        __isToken();
    }, [])

    const [listening, setListening] = useState(false);
    const [data, setData] = useState([]);
    const [value, setValue] = useState(null);

    const [meventSource, msetEventSource] = useState(undefined);

    let eventSource = undefined;

    const remove = async () => {
        const data = await axios.get(process.env.REACT_APP_SERVER_HOST + `/api/sse/delete`, {
            headers: {
                Authorization: localStorage.getItem('Authorization'),
                RefreshToken: localStorage.getItem('RefreshToken'),
            }
        }).then((res) => {
            console.log(res)
        })
    }


    useEffect(() => {
        let array = window.location.href.split("/");
        let index = array.findIndex((item) => item === "localhost:3000");
        if (array[index + 1] !== "login" && array[index + 1] !== "signup" && array[index + 1] !== "intro") {
            if (localStorage.getItem("Authorization") === null) {
                navigate("/intro")
            }
            if (localStorage.getItem("RefreshToken") === null) {
                navigate("/intro")
            }
            if (localStorage.getItem("name") === null) {
                navigate("/intro")
            }
            __isToken().then(() => {
                dispatch(__getLogin())
                    .then((res) => {
                        if(!res.payload.data){
                            navigate("/intro");
                        }
                    });
            });
                        // ?????? ????????????
        console.log("?????? ???????????????");
        console.log("listening", listening);
        // // remove()
        // if (!listening) {
        //     eventSource = new EventSourcePolyfill(process.env.REACT_APP_SERVER_HOST + `/api/member`,{
        //         headers: {
        //             RefreshToken: localStorage.getItem('RefreshToken'),
        //       }}); //??????

        //     msetEventSource(eventSource);

        //     console.log("eventSource", eventSource);

        //     eventSource.onopen = event => {
        //         console.log("connection opened");
        //     };

        //     eventSource.onmessage = event => {
        //         console.log("result", event.data);
        //         setData(old => [...old, event.data]);
        //         setValue(event.data);
        //         // ?????? ?????? ????????? ?????? x
        //         if(event.data === "??????"){
        //         }
        //         else{
        //         if (Notification.permission !== "granted") {
        //             Notification.requestPermission().then((permission) => {
        //                 if (permission === "granted") {
        //                     /* ????????? ???????????? nofi??? ??????????????? ?????? */
        //                     new Notification(event.data, { body: "????????? ??????????????????." });
        //                 }
        //             });
        //         } else {
        //             /* ????????? ????????? ?????? noti ??????????????? ?????? */
        //             new Notification(event.data, { body: "????????? ??????????????????." });
        //         }
        //         Swal.fire(event.data);
        //         }
        //     };

        //     eventSource.onerror = event => {
        //         console.log(event.target.readyState);
        //         if (event.target.readyState === EventSource.CLOSED) {
        //             console.log("eventsource closed (" + event.target.readyState + ")");
        //         }
        //         eventSource.close();
        //     };

        //     setListening(true);
        // }

        // return () => {
        //     eventSource.close();
        //     console.log("eventsource closed");
        // };
        __isSSE();
        }
    }, [])

    const __isToken = async () => {
        await axios.get(process.env.REACT_APP_SERVER_HOST + `/api/member/reissue`, {
            headers: {
                Authorization: localStorage.getItem('Authorization'),
                RefreshToken: localStorage.getItem('RefreshToken'),
            }
        }
        ).then((res) => {
            if (res.data.success) {
                localStorage.setItem("Authorization", res.headers.authorization);
                localStorage.setItem("RefreshToken", res.headers.refreshtoken);
            }
        })
    }

    const __isSSE= async () => {
        await axios.get(process.env.REACT_APP_SERVER_HOST + `/api/sse/getSubInfo`, {
            headers: {
                Authorization: localStorage.getItem('Authorization'),
                RefreshToken: localStorage.getItem('RefreshToken'),
            }
        }).then((res)=>{
            console.log(res)
        // if(res.data.data){}

        if (!listening) {
            eventSource = new EventSourcePolyfill(process.env.REACT_APP_SERVER_HOST + `/api/member/subscribe`,{
                headers: {
                    Authorization: localStorage.getItem('Authorization'),
                    RefreshToken: localStorage.getItem('RefreshToken'),
              },
              heartbeatTimeout: 1000*60*20,
            }); //??????

            msetEventSource(eventSource);

            console.log("eventSource", eventSource);

            eventSource.onopen = event => {
                console.log("connection opened");
            };

            eventSource.onmessage = event => {
                console.log("result", event.data);
                setData(old => [...old, event.data]);
                setValue(event.data);
                // // ?????? ?????? ????????? ?????? x
                // if(event.data === "??????"){
                // }
                // else{
                if (Notification.permission !== "granted") {
                    Notification.requestPermission().then((permission) => {
                        if (permission === "granted") {
                            /* ????????? ???????????? nofi??? ??????????????? ?????? */
                            new Notification(event.data, { body: "????????? ??????????????????." });
                        }
                    });
                } else {
                    /* ????????? ????????? ?????? noti ??????????????? ?????? */
                    new Notification(event.data, { body: "????????? ??????????????????." });
                }
                Swal.fire(event.data);
                // }
            };

            eventSource.onerror = event => {
                console.log(event.target.readyState);
                if (event.target.readyState === EventSourcePolyfill.CLOSED) {
                    console.log("eventsource closed (" + event.target.readyState + ")");
                }
                eventSource.close();
            };

            setListening(true);
        }

        return () => {
            eventSource.close();
            console.log("eventsource closed");
        };
        })

    }

    return (
        <Routes>
            {/* ??????????????? */}
            <Route path="/" exact element={<MainPage />} />
            {/* ???????????? ??????????????? */}
            <Route path="/monthly" exact element={<MonthlyPage />} />
            {/* ??????????????? */}
            <Route path="/intro" exact element={<IntroPage />} />
            {/* ???????????? */}
            <Route path="/signup" exact element={<SignUp />} />
            {/* ???????????? ????????? ????????? ????????? */}
            <Route path="/signup/email" exact element={<SignUpEmail />} />
            {/* ????????? ????????? ?????? ?????? ????????? ?????? ????????? */}
            <Route path="/signup/nickname" exact element={<SignUpNickname />} />
            {/* ????????? ?????? ???????????? ????????? ?????? ???????????????, ????????? ??????????????? ?????? ?????? */}
            <Route path="/signup/change/:type" exact element={<SignUpChange />} />
            {/* ???????????? */}
            <Route path="/member" exact element={<MemberPage />} />
            {/* ?????? ?????? ???????????? */}
            <Route path="/member/invite:id" exact element={<MemberPage />} />
            {/* ?????? ????????? ?????? ?????? ?????? */}
            <Route path="/member/add:add" exact element={<MemberPage />} />
            {/* ??????????????? */}
            <Route path="/profile" exact element={<ProfilePage />} />
            {/* ????????? ??????????????? */}
            <Route path="/detailprofile" exact element={<DetailProfilePage />} />
            {/* ????????? ?????? */}
            <Route path="/editprofile/:type" exact element={<EditProfilePage />} />
            {/* ???????????? */}
            <Route path="/profile/history/:type" exact element={<MyHistoryPage />} />
            {/* ????????? ?????? */}
            <Route path="/addcredit" exact element={<AddCreditPage />} />
            {/* ???????????? */}
            <Route path="/addpromise" exact element={<AddPromisePage />} />
            {/* ?????? ???????????? */}
            <Route path="/addpromise/edit:id" exact element={<AddPromisePage />} />
            {/* ?????? ???????????? */}
            <Route path="/detailpromise/:id" exact element={<DetailPromisePage />} />
            {/* ?????? ???????????? ?????? */}
            <Route path="/promiseleader/id=:id/type=:type" exact element={<PromiseLeaderPage />} />
            {/* ???????????? */}
            <Route path="/donation" exact element={<DonationPage />} />
            {/* ???????????? ?????? */}
            <Route path="/adddonation" exact element={<AddDonationPage />} />
            {/* ???????????? ?????? */}
            <Route path="/adddonation/edit:id" exact element={<AddDonationPage />} />
            {/* ???????????? ??????????????? */}
            <Route path="/detaildonation/:id" exact element={<DetailDonationPage />} />
            {/* ??????????????? */}
            <Route path="/login/kakao" exact element={<KakaoPage />} />
            <Route path="/login/naver" exact element={<NaverPage />} />
            {/* ?????? */}
            <Route path="/chat/:id" exact element={<ChatPage />} />
            {/* ?????? ????????? */}
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    )
}

export default Router;