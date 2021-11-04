const noteForm = document.getElementById('note-form');
const notesContainer = document.getElementById('note-container');
const fbBtn = document.getElementById('feedback-btn');
const addButton = document.getElementById('addBtn');
const submitEditButton = document.getElementById('submitEditBtn');
// const deleteButton = document.getElementById('deleteBtn')
// const notes = require('../../routes/notes')

// redirect to feedback
fbBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = '/feedback';
});


function handleNoteEdit(target) {
  console.log('Form edit invoked');
  console.log(target)
  const buttonId = target.getAttribute('key')
  const textArea = document.getElementById('noteText');
  const titleArea = document.getElementById('notetitle');
  const noteForm = document.getElementById('note-form');
  submitEditButton.setAttribute('key', buttonId)


  function replaceformTextWithCardToBeEdited() {
  const closestNoteText = document.querySelector('[key="'+buttonId+'body"]').firstChild.innerHTML;
  const closestNoteTitle = document.querySelector('[key="'+buttonId+'title"]').firstChild.wholeText;
  textArea.value = closestNoteText;
  titleArea.value = closestNoteTitle;}
  
  function replaceAddButtonWithSubmitButton() {
    console.log(noteForm)
    console.log(submitEditButton)
    addButton.style.display = "none";
    submitEditButton.style.display = "block";
  }

  // function replaceSubmitButtonWithAddButton() {
  //     addButton.style.display('block');
  //     submitEditButton.style.display('none');
  // }

  // function deleteFromDb(buttonId) {
  // fetch(`/api/notes/${buttonId}`, {
  //   method: 'DELETE',
  //   headers: {
  //     'Content-Type' : 'application/json',
  //   }
  // })
  // .then(() => {
  //   console.log('deleted' + buttonId + 'from DB')
  // })
// }

  replaceformTextWithCardToBeEdited();
  replaceAddButtonWithSubmitButton();
  
  // submitEditButton.addEventListener('submit', event => {
  //   event.stopPropagation();
  //   event.preventDefault();
  //   replaceSubmitButtonWithAddButton();
  //   // deleteFromDb(buttonId);
  //   console.log(submit-event-triggered)
  // })
  
};

const createCard = (note) => {
  // Create card
  const cardEl = document.createElement('div');
  cardEl.classList.add('card', 'mb-3', 'm-3');
  cardEl.setAttribute('key', note.note_id);

  // Create card header
  const cardHeaderEl = document.createElement('h4');
  cardHeaderEl.classList.add(
    'card-header',
    'bg-primary',
    'text-light',
    'p-2',
    'm-0'
  );
  cardHeaderEl.setAttribute('key', note.note_id+'title')
  cardHeaderEl.innerHTML = `${note.title} </br>`;

  // Create card delete button
  const cardDeleteButton = document.createElement('button');
  cardDeleteButton.classList.add(
    'delete-button');
  cardDeleteButton.setAttribute(
    'type', 'submit',
    'id', 'deleteBtn');
  cardDeleteButton.innerHTML = 'Delete Note';
  cardDeleteButton.addEventListener('click', event => {
    event.stopPropagation();
    console.log(event.target)
    const buttonId = event.target.getAttribute('key');
    const parentNoteId = event.target.parentElement.getAttribute('key');
    console.log(parentNoteId)
    console.log(buttonId)
    fetch(`/api/notes/${buttonId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type' : 'application/json',
      }
    })
    .then(() => {
      const card = document.querySelector('[key="'+parentNoteId+'"]')
    function removeCard() {card.remove()};
    removeCard();
    console.log(card + "HTML deleted");
    })

  });
  cardDeleteButton.setAttribute('key', note.note_id)

  // Create edit button
  const editNoteButton = document.createElement('button');
  editNoteButton.classList.add(
    'edit-button');
  editNoteButton.setAttribute(
    'type', 'button',
    'id', 'editBtn');
  editNoteButton.innerHTML = 'Edit Note';
  editNoteButton.setAttribute('key', note.note_id)
  editNoteButton.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    handleNoteEdit(event.target);
  })

  // Create card body
  const cardBodyEl = document.createElement('div');
  cardBodyEl.classList.add('card-body', 'bg-light', 'p-2');
  cardBodyEl.setAttribute('key', note.note_id+'body')
  cardBodyEl.innerHTML = `<p>${note.note}</p> <a> Created on: ${note.date}</a> <a> at ${note.time}</a>`;

  // Append the header and body to the card element
  cardEl.appendChild(cardHeaderEl);
  cardEl.appendChild(cardBodyEl);
  cardEl.appendChild(cardDeleteButton);
  cardEl.appendChild(editNoteButton);

  // Append the card element to the notes container in the DOM
  notesContainer.appendChild(cardEl);
};
// Get a list of existing notes from the server
const getnotes = () =>
  fetch('/api/notes', {
    method: 'GET', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    // body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      console.error('Error:', error);
    });

// Post a new note to the page
const postnote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data);
      createCard(note);
    })
    .catch((error) => {
      console.error('Error:', error);
    });

// When the page loads, get all the notes

getnotes().then((data) => data.forEach((note) => createCard(note)));

// Function to validate the notes that were submitted
const validatenote = (newnote) => {
  const { title, topic, note } = newnote;

  // Object to hold our error messages until we are ready to return
  const errorState = {
    title: '',
    note: '',
    topic: '',
  };

  // Bool value if the title is valid
  const utest = title.length >= 4;
  if (!utest) {
    errorState.title = 'Invalid title!';
  }

  // Bool value to see if the note being added is at least 15 characters long
  const noteContentCheck = note.length > 15;
  if (!noteContentCheck) {
    errorState.note = 'note must be at least 15 characters';
  }

  // Bool value to see if the topic is either UX or UI
  const topicCheck = topic.includes('UX' || 'UI');
  if (!topicCheck) {
    errorState.topic = 'Topic not relevant to UX or UI';
  }

  const result = {
    isValid: !!(utest && noteContentCheck && topicCheck),
    errors: errorState,
  };

  // Return result object with a isValid boolean and an errors object for any errors that may exist
  return result;
};

// Helper function to deal with errors that exist in the result

const showErrors = (errorObj) => {
  const errors = Object.values(errorObj);
  errors.forEach((error) => {
    if (error.length > 0) {
      alert(error);
    }
  });
};

// Helper function to send a POST request to the diagnostics route
const submitDiagnostics = (submissionObj) => {
  fetch('/api/diagnostics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submissionObj),
  })
    .then((response) => response.json())
    .then(() => showErrors(submissionObj.errors))
    .catch((error) => {
      console.error('Error:', error);
    });
};

// Function to handle when a user submits the feedback form
function handleFormSubmit(e) {
  e.preventDefault();

  console.log('Form submit invoked');

  // Get the value of the note and save it to a variable
  const noteContent = document.getElementById('noteText').value;

  // get the value of the title and save it to a variable
  const notetitle = document.getElementById('notetitle').value.trim();

  // Create an object with the note and title
  const newnote = {
    title: notetitle,
    topic: 'UX',
    note: noteContent,
  };

  // Run the note object through our validator function
  const submission = validatenote(newnote);

  // If the submission is valid, post the note. Otherwise, handle the errors.
  return submission.isValid ? postnote(newnote) : submitDiagnostics(submission);
};

// Listen for when the form is submitted
// noteForm.addEventListener('submit', handleFormSubmit);

document.body.addEventListener( 'submit', function ( event ) {
  window.location.reload(true);
  console.log(event.target.id)
  if( event.target.id === 'deleteBtn' ) {
    event.stopPropagation();
    event.preventDefault();
    console.log(event.target)
    const buttonId = event.target.getAttribute('key');
    const parentNoteId = event.target.parentElement.getAttribute('key');
    console.log(parentNoteId)
    console.log(buttonId)
    fetch(`/api/notes/${buttonId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type' : 'application/json',
      }
    })
    .then(() => {
      const card = document.querySelector('[key="'+parentNoteId+'"]')
    function removeCard() {card.remove()};
    removeCard();
    console.log(card + "HTML deleted");
    })
  }
  else if (event.target.id = 'addBtn') {
    console.log('add button clicked')
    event.preventDefault();
    event.stopPropagation();
    handleFormSubmit(event);
  }
} );


document.body.addEventListener( 'click', function ( event ) {
  console.log(event.target.id)
if (event.target.id != 'submitEditBtn') {
  console.log('no button clicked');
  return;
}
if(event.target.id === 'submitEditBtn') {
  //   window.location.reload(true);
    console.log('submit edit button clicked')
    event.stopPropagation();
    event.preventDefault();
    const buttonId = event.target.getAttribute('key')
    console.log(buttonId)
    fetch(`/api/notes/${buttonId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type' : 'application/json',
      }
    })
    .then(() => {
      addButton.click();
    })
    .then(() => {
      addButton.style.display ='block';
      submitEditButton.style.display ='none';
      window.location.reload(true);
    })
  };
} );