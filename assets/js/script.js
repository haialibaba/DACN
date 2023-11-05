
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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

/*------------Hien thi cac nganh-----------------*/
function showDepartment() {
  const khoalist = document.getElementById('khoa-list');
  const khoaname = document.getElementById('dept-name');
  const khoadecription = document.getElementById('dept-decription');
  const dbRef = ref(database, 'department/');
  onValue(dbRef, (snapshot) => {
    khoalist.innerHTML = '';
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
      const khoaButton = document.createElement("li");
      khoaButton.innerHTML = childData.NameN;
      khoaButton.classList.add("text-center");
      khoaButton.addEventListener("click", () => {
        const allItems = document.querySelectorAll('#khoa-list li');
        allItems.forEach(item => {
          item.classList.remove('show');
        });
        khoaButton.classList.add("show");
        showDoctor(childData.IDN, childData.NameN);
        khoaname.innerHTML = childData.NameN;
        khoadecription.innerHTML = childData.Decription;
      });

      khoalist.appendChild(khoaButton);
    })
  });
}

/*------------Hien thi bac si tung nganh-----------------*/
function showDoctor(IDN, NameN) {
  const doctorlist = document.getElementById('doctor-list');
  const dbRef = ref(database, 'doctors/');
  onValue(dbRef, (snapshot) => {
    doctorlist.innerHTML = '';
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
      const doctorButton = document.createElement("button");
      if (childData.IDN == IDN) {
        const newdoctor = `<div class="col-lg-6">
        <div class="member d-flex align-items-start">
          <div class="pic"><img src="assets/img/doctors/doctors-1.jpg" class="img-fluid" alt=""></div>
          <div class="member-info">
            <h4>${childData.NameBS}</h4>
            <span>Chuyên khoa ${NameN}</span>
            <p>${childData.Decription}</p>
            <div class="social">
              <a href=""><i class="ri-twitter-fill"></i></a>
              <a href=""><i class="ri-facebook-fill"></i></a>
              <a href=""><i class="ri-instagram-fill"></i></a>
              <a href=""> <i class="ri-linkedin-box-fill"></i> </a>
            </div>
          </div>
        </div>
      </div>`;
        doctorButton.innerHTML = newdoctor;
        doctorButton.classList.add("doctor-button");
        doctorButton.addEventListener("click", () => {
          console.log(childData.IDBS);
          goToDoctorDetailPage(childData.IDBS, NameN)
          // loadPage2('infodoctor.html', childData.IDBS, NameN);
        })
        doctorlist.appendChild(doctorButton);
      }
    })
  });
}
/*------------Hiển thị chi tiết bác sĩ-----------------*/
function displayDetailDoctor(IDBS, NameN) {

  const dbRef = ref(database, 'doctors/');
  onValue(dbRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
      if (childData.IDBS == IDBS) {
        const detailDoctor = `
        <img src="assets/img/doctors/doctors-1.jpg" alt="Bác sĩ">
        <div class="infomation">
          <h2>${childData.NameBS}</h2>
          <p>Tuổi: ${childData.AgeBS}</p>
          <p>Chuyên khoa: ${NameN}</p>
        </div>
      </div>`;
        document.getElementById("doctor-title").innerHTML = detailDoctor;

      }
    })

  })
}

/*----------- Tìm kiếm bác sĩ ------------------*/
function searchDoctorByName(name) {
  const doctorlist = document.getElementById('doctor-list');
  const dbRef = ref(database, 'doctors/');
  const dbRef1 = ref(database, 'department/');
  onValue(dbRef, (snapshot) => {
    doctorlist.innerHTML = '';
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
      const doctorButton = document.createElement("button");
      onValue(dbRef1, (snapshot1) => {
        snapshot1.forEach((childSnapshot1) => {
          const childData1 = childSnapshot1.val();
          if (childData.IDN == childData1.IDN) {
            const NameN = childData1.NameN;
            if (childData.NameBS.toLowerCase().indexOf(name) > -1) {
              const newdoctor = `<div class="col-lg-6">
                <div class="member d-flex align-items-start">
                  <div class="pic"><img src="assets/img/doctors/doctors-1.jpg" class="img-fluid" alt=""></div>
                  <div class="member-info">
                    <h4>${childData.NameBS}</h4>
                    <span>Chuyên khoa ${NameN}</span>
                    <p>${childData.Decription}</p>
                    <div class="social">
                      <a href=""><i class="ri-twitter-fill"></i></a>
                      <a href=""><i class="ri-facebook-fill"></i></a>
                      <a href=""><i class="ri-instagram-fill"></i></a>
                      <a href=""> <i class="ri-linkedin-box-fill"></i> </a>
                    </div>
                  </div>
                </div>
              </div>`;
              doctorButton.innerHTML = newdoctor;
              doctorButton.classList.add("doctor-button");
              doctorButton.addEventListener("click", () => {
                console.log(childData.IDBS);
                goToDoctorDetailPage(childData.IDBS, NameN)
                // loadPage2('infodoctor.html', childData.IDBS, NameN);
              })
              doctorlist.appendChild(doctorButton);
            }
          }
        })
      })
    })
  });
}

/*----------- Lấy toàn bộ dữ liệu bác sĩ------------------*/
function getAllDoctor() {
  const doctorlist = document.getElementById('doctor-list');
  const dbRef = ref(database, 'doctors/');
  const dbRef1 = ref(database, 'department/');
  onValue(dbRef, (snapshot) => {
    doctorlist.innerHTML = '';
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
      const doctorButton = document.createElement("button");
      onValue(dbRef1, (snapshot1) => {
        snapshot1.forEach((childSnapshot1) => {
          const childData1 = childSnapshot1.val();
          if (childData.IDN == childData1.IDN) {
            const NameN = childData1.NameN;
            const newdoctor = `<div class="col-lg-6">
        <div class="member d-flex align-items-start">
          <div class="pic"><img src="assets/img/doctors/doctors-1.jpg" class="img-fluid" alt=""></div>
          <div class="member-info">
            <h4>${childData.NameBS}</h4>
            <span>Chuyên khoa ${NameN}</span>
            <p>${childData.Decription}</p>
            <div class="social">
              <a href=""><i class="ri-twitter-fill"></i></a>
              <a href=""><i class="ri-facebook-fill"></i></a>
              <a href=""><i class="ri-instagram-fill"></i></a>
              <a href=""> <i class="ri-linkedin-box-fill"></i> </a>
            </div>
          </div>
        </div>
      </div>`;
            doctorButton.innerHTML = newdoctor;
            doctorButton.classList.add("doctor-button");
            doctorButton.addEventListener("click", () => {
              console.log(childData.IDBS);
              goToDoctorDetailPage(childData.IDBS, NameN)
              // loadPage2('infodoctor.html', childData.IDBS, NameN);
            })
            doctorlist.appendChild(doctorButton);
          }
        })
      })

    })
  });

}


/*------------LoadpageFromIndex-----------------*/
document.getElementById("button-show-list").addEventListener('click', () => {
  goToDoctorPage()
  // loadPage2('doctor.html', null, null)
});

/*------------Loadpage-----------------*/
// function loadPage2(url, IDBS, NameN) {
//   fetch(url)
//     .then(response => response.text())
//     .then(data => {
//       document.getElementById('main').innerHTML = data;
//       if (IDBS == null) {
//         showDepartment()
//         getAllDoctor();
//         document.getElementById('search-box').addEventListener("input", function (event) {
//           const searchTerm = event.target.value.toLowerCase();
//           searchDoctorByName(searchTerm);
//         })
//       }
//       else {
//         const btnInfo = document.getElementById("btn-info");
//         const btnReview = document.getElementById("btn-review");
//         const tab1 = document.getElementById("tab-1");
//         const tab2 = document.getElementById("tab-2");
//         const btnShow= document.getElementById("btn-show");
//         twoButtonClick(btnInfo, btnReview, tab1, tab2);
//         displayDetailDoctor(IDBS, NameN);
//         tab1.style.display = 'block';
//         // contentClick(btnShow);
//         btnShow.addEventListener("click", () => {
//         console.log("click")
//         })
//       }

//       history.pushState(null, '', url);

//     })
//     .catch(error => console.error(error));
// }

// window.addEventListener('popstate', () => {
//   loadPage2(window.location.href);
// });


// Hàm để tải nội dung từ URL và hiển thị nó trong phần nội dung chính
function loadPage2(url, IDBS, NameN) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      document.getElementById('main').innerHTML = data;
      if (IDBS == null) {
        showDepartment();
        getAllDoctor();
        document.getElementById('search-box').addEventListener("input", function (event) {
          const searchTerm = event.target.value.toLowerCase();
          searchDoctorByName(searchTerm);
        });
      } else {
        // const btnInfo = document.getElementById("btn-info");
        // const btnReview = document.getElementById("btn-review");
        // const tab1 = document.getElementById("tab-1");
        // const tab2 = document.getElementById("tab-2");
        // const urlParams = new URLSearchParams(window.location.search);
        // const id = urlParams.get('id');
        // const NameN = urlParams.get('name');
        // twoButtonClick(btnInfo, btnReview, tab1, tab2);
        // displayDetailDoctor(id, NameN);
        // tab1.style.display = 'block';
        // contentClick(btnShow);

      }
    })
    .catch(error => console.error(error));
}

// // Sự kiện popstate để theo dõi sự thay đổi lịch sử trình duyệt
window.addEventListener('popstate', event => {
  loadPage2(window.location.href);
});

// // Điều hướng giữa các trang bằng cách thay đổi URL và sử dụng history.pushState
function navigateToPage(url, IDBS, NameN) {
  history.pushState(null, '', url);
  loadPage2(url, IDBS, NameN);
}

// // Gọi hàm này để điều hướng đến trang "bác sĩ"
function goToDoctorPage() {
  navigateToPage('doctor.html');
}

// // Gọi hàm này để điều hướng đến trang "bác sĩ chi tiết"
function goToDoctorDetailPage(IDBS, NameN) {
  const url = `infodoctor.html?id=${IDBS}&name=${NameN}`;
  window.location.href = url;
  // navigateToPage(`infodoctor.html?id=${IDBS}&name=${NameN}`, IDBS, NameN);
}



function twoButtonClick(btnInfo, btnReview, tab1, tab2) {
  btnInfo.addEventListener("click", () => {
    if (!btnInfo.classList.contains('dock')) {
      btnInfo.classList.add('dock');
      btnReview.classList.remove('dock');
      tab1.style.display = 'block';
      tab2.style.display = 'none';
      // contentClick(btnShow)
    }
  })

  btnReview.addEventListener("click", () => {
    if (!btnReview.classList.contains('dock')) {
      btnReview.classList.add('dock');
      btnInfo.classList.remove('dock');
      tab2.style.display = 'block';
      tab1.style.display = 'none';
      // contentClick(btnShow)
    }
  })
}
// function contentClick(btnShow) {
//   btnShow.addEventListener("click", () => {
//     alert("click")
//   })
// }