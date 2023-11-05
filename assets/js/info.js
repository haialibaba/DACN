
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

function loginUser() {
  var userName = document.getElementById("user-name").value;
  var userPassword = document.getElementById("user-password").value;
  const dbRef = ref(connectDB, 'account/');
  onValue(dbRef, (snapshot) => {
    let loggedIn = false; // Biến để kiểm tra xem người dùng có đăng nhập thành công không.
    
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
      if (childData.Account == userName && childData.Password == userPassword && childData.permission === 2) {
        const loggedInUser = {
          name: childData.NameKH,
          id: childData.IDTK
        };

        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        Swal.fire({
          icon: 'success',
          title: 'Đăng nhập thành công!',
          text: 'Bạn đã đăng nhập thành công.',
        });
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = "index.html";
        loggedIn = true; // Đánh dấu người dùng đã đăng nhập thành công.
        document.getElementById("appointment").style.display = "block";
      }
    });

    // Nếu không có tài khoản nào trùng khớp, hiển thị thông báo lỗi.
    if (!loggedIn) {
      Swal.fire({
        icon: 'error',
        title: 'Đăng nhập thất bại',
        text: 'Tài khoản hoặc mật khẩu không đúng hoặc bạn không có quyền truy cập.',
      });
    }
  });
}
document.getElementById("submit-login").addEventListener("click", loginUser);


function isValidEmail(email) {
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
}

function isValidPhoneNumber(phoneNumber) {
  // Sử dụng biểu thức chính quy để kiểm tra định dạng số điện thoại ở Việt Nam
  var phonePattern = /^(0[0-9]{9})$/;
  return phonePattern.test(phoneNumber);
}

function registerUser() {
  var newAccount = document.getElementById("new-user-account").value;
  var newPassword = document.getElementById("new-user-password").value;
  var newName = document.getElementById("new-user-name").value;
  var newPhone = document.getElementById("new-user-phone").value;
  var email = document.getElementById("new-user-email").value;
  var confirmPassword = document.getElementById("confirm-user-password").value;
  if (newAccount === "" || newName === "" || newPhone === ""  || email === "" || newPassword === "" || confirmPassword === "") {
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
  }else if(!isValidEmail(email)){
    alert("Email không đúng định dạng");
    return;
  }else if(!isValidPhoneNumber(newPhone)){
    alert("Phone không đúng định dạng");
    return;
  }
  else {
    addAccountToDatabase(newAccount, newPassword, email,newPhone,newName)
    Swal.fire({
      icon: 'success',
      title: 'Đăng ký thành công!',
      text: 'Bạn đã đăng ký thành công.',
    });
    window.location.href = "login.html";
  }
}
document.getElementById("register").addEventListener("click", registerUser);

var newID;
function addAccountToDatabase(account, password, email,phoneKH,nameKH) {
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
    Account: account,
    Email: email,
    Password: password,
    IDTK: newID,
    NameKH: nameKH,
    Age:"",
    Birth:"",
    PhoneKH: phoneKH,
    Sex:"",
    permission: 2
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
function displayDetailUser() {

}
window.onload = () => {
  displayDetailUser();
};