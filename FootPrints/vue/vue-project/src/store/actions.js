import { postEmail, postNick, postLogin, postMemberInfo, } from "../api/index.js"
// import { postEmail, postNick, postLogin, postLogout, postMemberInfo, } from "../api/index.js"
// import { fetchSido, fetchSigoongu, fetchEupmyeondong } from "../api/index.js"
import { findID, changePWD } from "../api/index.js"
import { fetchUser, fetchTest, fetchDeliveryList, postDeliveryPost, fetchDeliveryDetail } from "../api/index.js";
import { router } from '../routes/index.js';


export default{ 
  FETCH_USER({commit}){
    fetchUser()
      .then(response =>{
        console.log("response.data\n",response.data);
        const member = {
          nick: response.data.nick,
          email: "test",
          pw: "test",
          area: response.data.area
        }
        commit('SET_MEMBER',member)
      })
      .catch(error => {
        const code = error.response.status;
        if(code == 403){
          alert("로그인 후 이용하세요");
          //history.back(); 
          router.replace("/home");
          // location.href = "http://localhost:8080/home"
        }
      })
  },
  FETCH_TEST(){
    fetchTest()
      .then(response =>{
        console.log("user 인증 성공?",response.data);
      })
      .catch(error => {
        const code = error.response.status;
        if(code == 403){
          alert("로그인 후 이용하세요");
          // history.back(); 
          router.replace("/home");
        }
      })
  },
  // 이메일 중복체크
  POST_EMAIL({commit}, email){
    postEmail(email)
        .then(response =>{ console.log(response);})
        .catch(error=>{ console.log(error);
                        return new Promise((resolve) => {
                          setTimeout(() => {
                            commit('SET_DUPLI_EMAIL', true)
                            resolve()
                          }, 1000)
                        })
                      }
              )
  },
  // 닉네임 중복체크
  POST_NICK({commit}, nick){
    postNick(nick)
        .then(response =>{ console.log(response);})
        .catch(error=>{ console.log(error);
                        commit('SET_DUPLI_NICK', true)})
  },
  // 회원가입
  POST_MEMBER(context, member){
    postMemberInfo(member)
        .then(response =>{
          console.log(response);
          // commit('SET_MEMBER', member);
          if(response.data == "SUCCESS"){
              router.replace({
              name: "signupCompleted",
              query: { nickName: member.nick, }
            });
          }
          else{
            alert("회원가입 실패");
          }
          })
        .catch( error=>{console.log(error);} )
  }, 
  // 로그인
  POST_LOGIN({commit}, member) {
    postLogin(member)
        .then(response => {
            console.log(response); 
            localStorage.setItem('jwt', response.data); // 로컬 스토리지에 저장
            commit('SET_MEMBER', member);
            router.replace("/home");
        })
        .catch(error => { 
          const code = error.response.status;
          if(code == 400) alert("존재하지 않는 닉네임입니다.");
          else if(code == 404) alert("비밀번호가 일치하지 않습니다.");
        })
  },
  // 로그아웃
  // POST_LOGOUT() {
  //   postLogout()
  //       .then(response => {
  //         console.log(response);
  //       })
  //       .catch(error => { 
  //         console.log(error);
  //       })
  // },
  // 시/도 정보 가져오기
  // FETCH_SIDO({commit}){
  //   fetchSido()
  //   .then(response =>{ 
  //     console.log(response);
  //     const sidoList = response.data.response.result.featureCollection.features;
  //     commit("SET_SIDO_LIST", sidoList);
  //     })
  //   .catch(response => {
  //     console.log(response)
  //     const sidoList = response.data.response.result.featureCollection.features;
  //     commit("SET_SIDO_LIST", sidoList);
  //     })
  // },
  // // 시/군/구 정보 가져오기
  // FETCH_SIGOONGU({commit}, code){
  //   fetchSigoongu(code)
  //   .then(response =>{ 
  //     const sigoonguList = response.data.response.result.featureCollection.features;
  //     commit("SET_SIGOONGU_LIST", sigoonguList);
  //     })
  //   .catch(error => {console.log(error)})
  // },
  // // 읍/면/리 정보 가져오기
  // FETCH_EUPMYEONDONG({commit}, code){
  //   fetchEupmyeondong(code)
  //   .then(response =>{ 
  //     const eupmyeondongList = response.data.response.result.featureCollection.features;
  //     commit("SET_EUPMYEONDONG_LIST", eupmyeondongList);
  //     })
  //   .catch(error => {console.log(error)})
  // },

  //아이디 찾기
  FIND_ID({ commit }, email) {
    findID(email)
      .then(response => {
        console.log(response);
        commit('FIND_ID', response.data);
      })
      .catch(error => {
        console.log(error);
      })
  },

  // 비밀번호 변경
  CHANGE_PWD(context, memberChangeDTO) {
    changePWD(memberChangeDTO)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      })
  },
  // 리스트뷰 페이지 데이터 로드
  FETCH_DELIVERY_LIST({commit}){
    fetchDeliveryList()
      .then(response =>{
        console.log("배달 리스트 뷰 페이지 정보 받아오기 성공(GET success)\n",response.data);
        commit('SET_DELIVERIES', response.data);
      })
      .catch(error =>{
        const code = error.response.status;
        if(code == 403){
          alert("로그인 후 이용하세요");
          //history.back(); 
          router.replace("/home");
          // location.href = "http://localhost:8080/home"
        }
        else{
          console.log("배달 리스트 뷰 페이지 정보 받아오기 실패\n",error);
        }
      })
  },
  // 게시물 작성
  POST_DELIVERY_POST(content, post){
    postDeliveryPost(post)
    .then(response =>{
      console.log(response);
    })
    .catch(error => {
      const code = error.response.status;
      if(code == 403){
        alert("로그인 후 이용하세요");
        router.replace("/home");
      }
      else{
        console.log("게시물 등록 실패\n",error);
      }
    })
  },
  // 상세 페이지 데이터 로드
  FETCH_DELIVERY_DETAIL({commit}, post_id){
    fetchDeliveryDetail(post_id)
      .then(response =>{
        console.log("상세페이지 정보 받아오기 성공(GET success)\n",response.data);
        commit('SET_DELIVERY_POST', response.data);
      })
      .catch(error => {
        const code = error.response.status;
        if(code == 403){
          alert("로그인 후 이용하세요");
          router.replace("/home");
        }
        else{
          console.log("상세페이지 정보 받아오기 실패\n",error);
        }
      })
  }
}
