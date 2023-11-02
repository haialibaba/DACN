
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, set, get, child, onValue, limitToLast, query } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const connectDB = getDatabase(app);

const loggedInUserString = localStorage.getItem('loggedInUser');
const loggedInUserID = JSON.parse(loggedInUserString).id;

var iDKH;
function dataToStorage() {
  var data = document.getElementById('infoUser');
  const dbRef = ref(connectDB, 'users/');
  onValue(dbRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();

      if (childData.IDTK == loggedInUserID) {
        iDKH = childData.IDKH;
        console.log(iDKH)
        const getImg = `<img src="${childData.Img}" alt="">`;
        const detailUser = `
              <h2>${childData.NameKH}</h2>
              <div class="userInfo">
                  <div>ID:${childData.IDTK}</div>
                  <div>Tuổi: ${childData.AgeKH}</div>
                  <div>Ngày sinh: ${childData.Birth}</div>
                  <div>Số điện thoại: ${childData.PhoneKH}</div>
                  <div>Giới tính: ${childData.Sex}</div>
              </div>
              <div class="updateUser">
                  <button class="updateInfo" id="updateInfo"  type="button" onclick="toggleDiv(),${getDataUpdate()}">Sửa thông tin</button>
                  <button class="updatePass" type="button" onclick="togglePass()">Đổi mật khẩu</button>
              </div>`;
        
        if (data !== null) {
          data.innerHTML = detailUser;
          document.getElementById("infoImg").innerHTML = getImg;
        }
      }

    })

  })

}


function getDataUpdate() {
  var data = document.getElementById('infoUser');
  const dbRef = ref(connectDB, 'users/');
  onValue(dbRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();

      if (childData.IDTK == loggedInUserID) {
        iDKH = childData.IDKH;
        console.log(iDKH)
        const getData = `      <div class="img-container">
        <label for="photo">Photo:</label>
        <input type="file" id="idphoto" name="photo" accept="image/jpeg, image/webp, image/jpg, image/png" onchange="handleFileInputChange(this)" value ="${childData.Img}" >
        <img id="imginfo" src="${childData.Img}" alt="">
    </div>
    <div style="display: none;">
        <input type="text" id="id_kh" name="id_kh" value = "${childData.IDKH}" required>
    </div>
    <div>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" value = "${childData.NameKH}" required>
    </div>
    <div>
        <label for="date_of_birth">Date of Birth:</label>
        <input type="text" id="date_of_birth" name="date_of_birth" value = "${childData.Birth}"   required>
    </div>
    <div>
        <label for="phone_number">Phone Number:</label>
        <input type="tel" id="phone_number" name="phone_number" value = "${childData.PhoneKH}" required>
    </div>
    <div>
        <label for="phone_number">Tuổi:</label>
        <input type="number" id="Age_number" name="phone_number" value = "${childData.AgeKH}" required>
    </div>
    <div class="radio-container">
        <label for="gender_male">Giới tính</label>
        <input type="text" id="gender" name="gender" value = "${childData.Sex}" required>
    </div>`;
        if (data !== null) {
          document.getElementById("form-updata-user").innerHTML = getData;
        }
      }

    })

  })
}

function displayMedicalrecords() {
  const db = ref(connectDB, 'medicalrecord/');
  onValue(db, (snap) => {
    snap.forEach((childSnap) => {
      const childDt = childSnap.val();
      console.log(childDt);
      if (childDt.IDKH == iDKH) {
        console.log(childDt);
        const data = `
        <li>Loại bệnh: ${childDt.Info}</li>
        <h5>Triệu chứng: ${childDt.PatientCondition}</h5>
        `;
        console.log(data);
        document.getElementById("medicalrecords").innerHTML = data;
      }
    })

  })
}

window.onload = () => {
  dataToStorage();
  displayMedicalrecords();
};


const dataToget = document.getElementById("submit-Update");

function getDatainfoUser() {
  const idUser = document.getElementById('id_kh').value;
  const imgUser = document.getElementById('idphoto');
  const nameUser = document.getElementById('name').value;
  const birthUser = document.getElementById('date_of_birth').value;
  const phoneUser = document.getElementById('phone_number').value;
  const ageUser = document.getElementById('Age_number').value;
  const genderUser = document.getElementById('gender').value;
  
  var imgU = imgUser.value;
  var fileName = imgU.split("\\").pop();
  
  // Kiểm tra xem các giá trị đã được lấy đúng hay chưa
  console.log(idUser, nameUser, birthUser, phoneUser, genderUser);
  
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const imageData = reader.result; // Lấy đoạn mã Base64 của ảnh
    console.log(imageData);
    
    // Thực hiện cập nhật dữ liệu vào Firebase Realtime Database
    const userRef = ref(connectDB, 'users/' + idUser);
    set(userRef, {
      Img: imageData,
      IDTK: loggedInUserID,
      IDKH: idUser,
      Birth: birthUser,
      NameKH: nameUser,
      AgeKH: ageUser,
      PhoneKH: phoneUser,
      Sex: genderUser
    })
    .then(() => {
      console.log("Thông tin người dùng đã được cập nhật thành công");
    })
    .catch((error) => {
      console.error("Đã xảy ra lỗi khi cập nhật thông tin người dùng:", error);
    });
  });
  
  reader.readAsDataURL(imgUser.files[0]);
}

dataToget.addEventListener('click', getDatainfoUser);

dataToget.addEventListener('click', getDatainfoUser);

function setDataPassword() {
  // const loggedInUserString = localStorage.getItem('loggedInUser');
  // const loggedInUserID = JSON.parse(loggedInUserString).id;
  const newPassword = document.getElementById('new-password').value;
  const newPasswordConfirm = document.getElementById('confirm-password').value;
  const dbRef = ref(connectDB, `account/${loggedInUserID}/Password`);

  if (newPassword == newPasswordConfirm) {
    set(dbRef, {
      Password: newPassword
    })
  }
  else {
    alert("Mật khẩu nhập lại không đúng");
  }

}
document.getElementById('update-password').addEventListener('click', setDataPassword)








