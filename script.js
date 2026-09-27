import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, updateDoc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDPFx5ejMBKRVm0RP-oUVSwLRt1ik3iOWE",
  authDomain: "smart-qr-library-system-16a90.firebaseapp.com",
  projectId: "smart-qr-library-system-16a90",
  storageBucket: "smart-qr-library-system-16a90.firebasestorage.app",
  messagingSenderId: "598115614162",
  appId: "1:598115614162:web:e417954b03cf2605571c0b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function getDocId(){
  let roll = document.getElementById("rollNumber").value.trim();
  let bId = document.getElementById("bookId").value.trim();
  return roll + "_" + bId;
}

document.getElementById("issueBtn").addEventListener("click", async () => {
    let name = document.getElementById("studentName").value.trim();
    let roll = document.getElementById("rollNumber").value.trim();
    let bId = document.getElementById("bookId").value.trim();
    let bName = document.getElementById("bookName").value.trim();
    if(!roll || !bId){ alert("Fill chey"); return; }
    let docId = getDocId();
    await setDoc(doc(db, "transactions", docId), {
        studentName: name, roll: roll, bookID: bId, bookName: bName,
        status: "Issued", issuedDate: new Date(), returnedDate: null
    });
    alert("✅ Issued: " + docId);

    // QR GENERATE PART - CORRECTED
    let allData = `SJCET LIBRARY
Name: ${name}
Roll: ${roll}
Book ID: ${bId}
Book Name: ${bName}
Date: ${new Date().toLocaleString()}`;

    document.getElementById("qrcode").innerHTML = "";
    document.getElementById("qrText").innerText = "";

    new QRCode(document.getElementById("qrcode"), {
        text: allData,
        width: 200,
        height: 200
    });

});

document.getElementById("returnBtn").addEventListener("click", async () => {
    let roll = document.getElementById("rollNumber").value;
    let bId = document.getElementById("bookId").value;
    if(!roll || !bId){ alert("Roll & Book ID"); return; }
    let docId = getDocId();
    let ref = doc(db, "transactions", docId);
    let snap = await getDoc(ref);
    if(!snap.exists()){ alert("Mundu Issue chey"); return; }
    await updateDoc(ref, { status: "Returned", returnedDate: new Date() });
    alert("✅ Returned: " + docId);
});

// SEARCH - 100% working - no index needed
document.getElementById("searchBtn").addEventListener("click", async () => {
    let searchRoll = document.getElementById("searchRoll").value.trim();
    if(!searchRoll){ alert("Register No type chey"); return; }
    
    let resultDiv = document.getElementById("resultArea");
    resultDiv.innerHTML = "Searching... ⏳";

    try{
        let allDocs = await getDocs(collection(db, "transactions"));
        let found = [];
        allDocs.forEach(d => {
            let data = d.data();
            if(data.roll && data.roll.trim() === searchRoll){
                found.push(data);
            }
        });

        if(found.length === 0){
            resultDiv.innerHTML = `<p style="color:red">❌ ${searchRoll} ki data ledu. Check: nuvvu Issued chesina Roll Number ade type chesava?</p>`;
            return;
        }

        let html = `<h4 style="color:green">✅ ${searchRoll} - ${found.length} Books Found:</h4><table border="1" style="width:100%"><tr style="background:#eee"><th>Book ID</th><th>Name</th><th>Status</th></tr>`;
        found.forEach(d => {
            let color = d.status === "Issued" ? "orange" : "green";
            html += `<tr><td>${d.bookID}</td><td>${d.bookName}</td><td style="color:${color};font-weight:bold">${d.status}</td></tr>`;
        });
        html += `</table>`;
        resultDiv.innerHTML = html;

    } catch(e){
        resultDiv.innerHTML = `<p style="color:red">Error: ${e.message}</p>`;
        console.log(e);
    }
});
