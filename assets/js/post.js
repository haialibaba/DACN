

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { get, getDatabase, set, ref, push, child, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxCtVmIC2bjzHDOPCJDPxVpo4_X1rxw5g",
  authDomain: "healthcare-6b52f.firebaseapp.com",
  databaseURL: "https://healthcare-6b52f-default-rtdb.firebaseio.com",
  projectId: "healthcare-6b52f",
  storageBucket: "healthcare-6b52f.appspot.com",
  messagingSenderId: "58612057787",
  appId: "1:58612057787:web:88e53a2eb89b36959b0b9e",
  measurementId: "G-KMXKKRR3DJ"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);



function showNew() {
  const dbRef = ref(database, 'new/');
  onValue(dbRef, (snaphost) => {
    snaphost.forEach((childSnaphost) => {
      const childData = childSnaphost.val();
      const newDivNew = document.createElement("div");
      const Divnew = document.getElementById('news');
      if (childData.IDTT == "TT001") {
        const detialnew = `
        <div class="divrow">
                <div class="divcol-sm-6">
                    <img class="link-icon" alt="" src="./assets/img/o.jpg" />
                </div>
                <div class="divcol-sm-61">
                    <div class="divpl-15">

                        <div class="heading-2">
                            <div class="cch-chn-phng" >
                                <p>${childData.NameTT}</p>
                            </div>
                        </div>

                        <div class="divmb-10">
                        <i class="fa-regular fa-calendar-days"></i>
                            <div class="div2" id="Rollbox">${childData.TimeUpdate}</div>
                        </div>
                        <div class="list-item-link">
                            <div class="sn-ph-khoa" id="Text">${childData.Tag}</div>
                        </div>
                        <div class="ptext-justify">
                            <div class="lm-m-l">
                            ${childData.Content}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        newDivNew.innerHTML = detialnew;
        Divnew.appendChild(newDivNew);
        newDivNew.addEventListener("click", () => {
          loadPage('infomationNew.html', childData.IDTT);
        })
      }
    })
  })
}
showNew()

function ListNewShow() {
  const listnew = document.getElementById('list');
  const dbRef = ref(database, 'new/');
  onValue(dbRef, (snapshot) => {
    listnew.innerHTML = '';
    snapshot.forEach((childSnaphost) => {
      const childData = childSnaphost.val();
      const newDiv = document.createElement("li");
      const newPost = `
      <li>
      <div class="post-item">         
               <img src="./assets/img/o.jpg" alt="">         
      </div>
      <div class="post-info">
          <p>${childData.NameTT} </p>
          <div class="divmb-11">
          <i class="fa-regular fa-calendar-days"></i>
              <div class="div3">${childData.TimeUpdate}</div>
          </div>
          <div class="list-item-link1">
              <div class="sn-ph-khoa">${childData.Tag}</div>
          </div>
  </li>
      `;
      newDiv.innerHTML = newPost;
      listnew.appendChild(newDiv);
      newDiv.addEventListener("click", () => {
        loadPage('infomationNew.html', childData.IDTT);
        ListCommentShow(childData.IDTT);
        addPost(childData.IDTT);
      })
    });
  });
}



///---loadPage-------
function loadPage(pageUrl, IDTT) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("dataPost").innerHTML = this.responseText;
      displayNew(IDTT);
      ListCommentShow(IDTT);
      const btnComment = document.getElementById("btrComment");
      btnComment.addEventListener("click", () => {
        addPost(IDTT);
      })


    }
  };
  xhttp.open('GET', pageUrl, true);
  xhttp.send();
}

function displayNew(IDTT) {
  const dbRef = ref(database, 'new/');
  onValue(dbRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
      if (childData.IDTT == IDTT) {
        const detail = `
        <div class="main">
        <div class="content">
            <h2>${childData.NameTT}</h2>
            <div class="divmb-11">
            <i class="fa-regular fa-calendar-days"></i>
                <div class="div3">${childData.TimeUpdate}</div>
            </div>
            <div class="content-new">
                <p>${childData.Content}</p>
                <p>Anh Tiến viêm họng từ bé, amidan sưng to, thường tái phát, kèm nuốt vướng, thỉnh thoảng nghẹt mũi
                    và ho đờm. Gần đây, viêm họng nặng hơn, ngủ ngáy to ‘như tiếng sấm’, anh đến Bệnh viện Đa khoa
                    Tâm Anh TP HCM khám. Kết quả nội soi mũi họng ghi nhận viêm VA tồn dư, amidan sưng to hai bên,
                    quá phát độ ba, hốc amidan có mủ vón cục như bã đậu trên bề mặt. Vùng đáy lưỡi và thành sau họng
                    có các mô lympho quá phát.</p>
                <p>Ngày 23/10, BS.CKII Nguyễn Như Duy, Trung tâm Tai Mũi Họng, cho biết VA phát triển từ 6 tháng
                    tuổi, tăng dần kích cỡ lúc 2-4 tuổi, bắt đầu teo dần khi trẻ hơn 7 tuổi và gần như biến mất hoàn
                    toàn khi bước vào tuổi dậy thì. Viêm VA tồn dư ở người trưởng thành chưa rõ nguyên nhân. Tuy
                    nhiên, tình trạng VA quá phát lúc nhỏ nhưng không nạo là yếu tố nguy cơ dẫn đến VA tồn dư ở tuổi
                    trưởng thành.</p>
                <div class="image">
                    <img src="./assets/img/o.jpg">
                </div>
                <p>Trường hợp không có triệu chứng, hẹp hoặc hở van tim nhẹ, chưa cần phẫu thuật, theo dõi để phòng
                    bệnh tiến triển. Khi người bệnh hẹp khít van hai lá, bác sĩ xem xét nong van bằng bóng, không
                    phải phẫu thuật. Tuy nhiên, trường hợp bà Vịnh không thể nong van vì đã cao tuổi, van vôi hóa,
                    đồng thời có kèm hở van nên phương pháp điều trị duy nhất là thay van, bác sĩ Dũng nói.</p>
            </div>
        </div>
    </div>`;
        document.getElementById("data-news").innerHTML = detail;


      }
    })

  })
}
ListNewShow()



///------------comment-------

const userId = {
  name: null,
  image: null,
  message: null,
  date: null
}




function addPost(IDTT) {
  console.log("fsdfdsgg")
  const userComment = document.querySelector("#comment-input");
  const comments = document.querySelector(".post-comment");
  userId.name = "ha";
  userId.image = "./o.jpg";
  userId.message = userComment.value;
  userId.date = new Date().toLocaleString();
  let published = `
  <div class="list1">
      <div class="user">
          <div class="user-image">
              <img src="${userId.image}">
          </div>
          <div class="user-meta">
              <div class="name" id="NameBox">${userId.name}</div>
              <div class="day" id="DateBox">${userId.date}</div>
          </div>
      </div>
      <div class="comment-post">${userId.message}</div>
  </div>
  `;
  add(IDTT);
  comments.innerHTML += published;
  userComment.value = "";

}





// // insert comment
function add(IDTT) {

  const content = document.getElementById('comment-input').value;

  const dbRef = ref(database, 'comment/');

  get(dbRef).then((snapshot) => {
    let data = snapshot.val() || {};


    let highestID = 0;
    for (const key in data) {
      if (data[key].id > highestID) {
        highestID = data[key].id;
      }
    }

    const newID = highestID + 1;


    const newData = {
      id: newID,
      Content: content,
      Time: new Date().toLocaleString(),
      IDTK: "TK002",
      IDTT: IDTT
    };


    set(child(dbRef, newID.toString()), newData);

    alert("Data saved with ID: " + newID);
  });

}
// delete


// load comment
function ListCommentShow(IDTT) {
  const listcomment = document.getElementById('data-comment');
  const dbRef = ref(database, 'comment/');
  onValue(dbRef, (snapshot) => {
    listcomment.innerHTML = '';
    snapshot.forEach((childSnaphost) => {
      const childData = childSnaphost.val();
      const newDivComment = document.createElement("div");
      if (childData.IDTT == IDTT) {
        const newPost = `
              <div class="list1">
              <div class="user">
                  <div class="user-image">
                      <img src="./assets/img/o.jpg">
                  </div>
                  <div class="user-meta">
                      <div class="name">Ha</div>
                      <div class="day">${childData.Time}</div>
                  </div>
              </div>
              <div class="comment-post">${childData.Content}       
          </div>
      `;
        newDivComment.innerHTML = newPost;
        listcomment.appendChild(newDivComment);
      }
    })
  })
}

ListCommentShow();


