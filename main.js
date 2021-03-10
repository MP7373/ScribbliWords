(() => {
  firebase.initializeApp({
    apiKey: "AIzaSyBMRrXzMzuXoUmGHOwtkwqHKZ0RphIOSC4",
    authDomain: "scribliiowords.firebaseapp.com",
    projectId: "scribliiowords",
  });
  const firestore = firebase.firestore();
  const collection = firestore.collection("WordsCollection");
  const wordDocument = collection.doc("WordDocument");

  const statusSection = document.getElementById("status");
  const wordInput = document.getElementById("main-input");
  const addWordButton = document.getElementById("main-btn");
  let submittingInProgress = false;

  addWordButton.addEventListener("click", submitWord);
  wordInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      submitWord(event);
    }
  });

  function submitWord(event) {
    if (!submittingInProgress) {
      submittingInProgress = true;
      const newWord = wordInput.value;

      if (newWord.length > 0) {
        wordDocument
          .get()
          .then((doc) => {
            const words = doc.get("Words");

            if (!words.includes(newWord)) {
              words.push(newWord);
              wordDocument
                .update({ Words: words })
                .then(() => displayWordAdded(newWord))
                .finally(() => {
                  wordInput.value = "";
                  submittingInProgress = false;
                });
            } else {
              displayWordFailedToBeAdded(newWord);
              wordInput.value = "";
              submittingInProgress = false;
            }
          })
          .catch((error) => {
            wordInput.value = "";
            submittingInProgress = false;
          });
      } else {
        displayWordCantBeBlank();
        wordInput.value = "";
        submittingInProgress = false;
      }
    }
  }

  let statusDisplayTimeout = null;
  function displayWordAdded(word) {
    if (statusDisplayTimeout !== null) {
      clearTimeout(statusDisplayTimeout);
    }
    statusSection.innerText = word + " added to list.";
    statusDisplayTimeout = setTimeout(() => {
      statusSection.innerText = "";
    }, 500);
  }

  function displayWordFailedToBeAdded(word) {
    if (statusDisplayTimeout !== null) {
      clearTimeout(statusDisplayTimeout);
    }
    statusSection.innerText =
      word + " failed to be added to list. May be a duplicate.";
    statusDisplayTimeout = setTimeout(() => {
      statusSection.innerText = "";
    }, 500);
  }

  function displayWordCantBeBlank() {
    if (statusDisplayTimeout !== null) {
      clearTimeout(statusDisplayTimeout);
    }
    statusSection.innerText = "Word cannot be blank.";
    statusDisplayTimeout = setTimeout(() => {
      statusSection.innerText = "";
    }, 500);
  }
})();
