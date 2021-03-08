firebase.initializeApp({
  apiKey: "AIzaSyBMRrXzMzuXoUmGHOwtkwqHKZ0RphIOSC4",
  authDomain: "scribliiowords.firebaseapp.com",
  projectId: "scribliiowords",
});
const firestore = firebase.firestore();

const statusSection = document.getElementById("status");

const wordInput = document.getElementById("main-input");

const addWordButton = document.getElementById("main-btn");
addWordButton.addEventListener("click", (e) => {
  const newWord = wordInput.value;

  if (newWord.length > 0) {
    const collection = firestore.collection("WordsCollection");
    const wordDocument = collection.doc("WordDocument");

    wordDocument.get().then((doc) => {
      const words = doc.get("Words");

      if (!words.includes(newWord)) {
        words.push(newWord);
        wordDocument.update({ Words: words });
        updateStatus(newWord);
      } else {
        updateStatusFailed(newWord);
      }
    });
  } else {
    wordCantBeBlank();
  }
});

function updateStatus(word) {
  statusSection.innerText = word + " added to list.";
  setTimeout(() => {
    statusSection.innerText = "";
  }, 500);
}

function updateStatusFailed(word) {
  statusSection.innerText =
    word + " failed to be added to list. Maybe be a duplicate";
  setTimeout(() => {
    statusSection.innerText = "";
  }, 500);
}

function wordCantBeBlank() {
  statusSection.innerText = "Word cannot be blank";
  setTimeout(() => {
    statusSection.innerText = "";
  }, 500);
}
