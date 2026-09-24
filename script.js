function issueBook() {
    let name = document.getElementById("studentName").value;
    let roll = document.getElementById("rollNumber").value;
    let bookId = document.getElementById("bookId").value;
    let book = document.getElementById("bookName").value;

    if (name === "" || roll === "" || bookId === "" || book === "") {
        alert("Please fill all details");
        return;
    }

    alert(
        "Book Issued Successfully!\n\n" +
        "Student: " + name +
        "\nRoll Number: " + roll +
        "\nBook: " + book
    );
}

function returnBook() {
    let name = document.getElementById("studentName").value;
    let roll = document.getElementById("rollNumber").value;
    let bookId = document.getElementById("bookId").value;
    let book = document.getElementById("bookName").value;

    if (name === "" || roll === "" || bookId === "" || book === "") {
        alert("Please fill all details");
        return;
    }

    alert(
        "Book Returned Successfully!\n\n" +
        "Student: " + name +
        "\nRoll Number: " + roll +
        "\nBook: " + book
    );
}