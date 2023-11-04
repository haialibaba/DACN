
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
function renderInfo(){
const loggedInUserID = JSON.parse(loggedInUserString).id;
var data = document.querySelector('#infoUser');
const dbRef = ref(connectDB, 'users/');
onValue(dbRef, (snapshot) => {
  snapshot.forEach((childSnapshot) => {
    const childData = childSnapshot.val();
    if (childData.IDTK == loggedInUserID) {
      const detailUser = `
              <h2>${childData.NameKH}</h2>
              <div class="userInfo">
                  <div>ID:${childData.IDTK}</div>
                  <div>Tuổi: ${childData.AgeKH}</div>
                  <div>Ngày sinh: ${childData.AgeKH}</div>
                  <div>Số điện thoại: ${childData.PhoneKH}</div>
                  <div>Giới tính: ${childData.Sex}</div>
              </div>
              <div class="updateUser">
                  <button class="updateInfo" type="button" onclick="toggleDiv()">Sửa thông tin</button>
                  <button class="updatePass" type="button" onclick="togglePass()">Đổi mật khẩu</button>
              </div>`;
      // console.log(detailUser);
      if (data !== null) {
        data.innerHTML = detailUser;
      }
    }

  })

})

const db = ref(connectDB, 'medicalrecord/');
onValue(db, (snap) => {
  snap.forEach((childSnap) => {
    const childDt = childSnap.val();
    const detailUser = `
        <li>Loại bệnh: ${childDt.Info}</li>
        <h5>Triệu chứng: ${childDt.PatientCondition}</h5>
        `;
    if (data !== null) {
      document.getElementById("medicalrecords").innerHTML = detailUser;
    }
  })

})
}

window.onload = () => {
  renderInfo();
};

function loginUser() {
  var userName = document.getElementById("user-name").value;
  var userPassword = document.getElementById("user-password").value;
  const dbRef = ref(connectDB, 'account/');
  onValue(dbRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
      if (childData.NameTK == userName && childData.Password == userPassword) {
        const loggedInUser = {
          name: childData.NameTK,
          id: childData.IDTK
        };

        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        window.location.href = "index.html";
      }
    })

  })
  document.getElementById("submit-login").addEventListener("click", loginUser);
}
loginUser();

function registerUser() {
  var newName = document.getElementById("new-user-name").value;
  var newPassword = document.getElementById("new-user-password").value;
  var email = document.getElementById("new-user-email").value;
  var confirmPassword = document.getElementById("confirm-user-password").value;
  if (newName === "" || email === "" || newPassword === "" || confirmPassword === "") {
    alert("Vui lòng điền đầy đủ thông tin.");
    return;
  }
  else if (newPassword !== confirmPassword) {
    alert("Mật khẩu nhập lại không đúng.");
    return;
  }
  else if (newPassword.length < 6) {
    alert("Mật khẩu phải có ít nhất 6 ký tự.");
    return;
  }
  else {
    addAccountToDatabase(newName, newPassword, email)
  }
}
document.getElementById("register").addEventListener("click", registerUser);

var newID;
function addAccountToDatabase(username, password, email) {
  const dbRef = query(ref(connectDB, 'account/'), limitToLast(1));
  onValue(dbRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
      var currentID = parseInt(splitSTringIDAccount(childData.IDTK).number);
      var nextID = currentID + 1;
      console.log(currentID);
      newID = "TK" + nextID.toString().padStart(3, "0");

    })
  })
  set(ref(connectDB, 'account/' + newID), {
    NameTK: username,
    Email: email,
    Password: password,
    IDTK: newID
  });
}

function splitSTringIDAccount(IDTK) {
  var input = IDTK;
  var pattern = /([A-Za-z]+)(\d+)/;

  var matches = input.match(pattern);

  if (matches) {
    var letters = matches[1];
    var number = matches[2];
    return {
      letters: letters,
      number: number
    }
  } else {
    return null;
  }
}

