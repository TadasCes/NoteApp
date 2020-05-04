var date = new Date();
var notes = [];
var myStorage = window.localStorage;
if (myStorage["notes"]) notes = JSON.parse(myStorage["notes"]);

var noteToModify = localStorage.getItem('noteToModify');
if (noteToModify == null) noteToModify = -1;

var id = 0;
var optionsMenu = null;
var deleteNoteBtn = null;
var addNoteBtn = null;

var areOptionsVisible = false;

var path = window.location.pathname;
var page = path.substring(path.lastIndexOf('/') + 1);
if (page == "index.html") {
    optionsMenu = document.getElementById('optionsMenu');
    var editNoteBtn = document.getElementById("noteEdit");
    deleteNoteBtn = document.getElementById("noteDelete");
    var filterBtn = document.getElementById("filterBtn");
    
    filterBtn.addEventListener('click', () => {
        if (areOptionsVisible){
            toggleOptionsMenu();
            areOptionsVisible = false;
        }
    }); 

    refreshPage();
}
else if (page == "editNote.html") {
    deleteNoteBtn = document.getElementById("noteDelete");
    addNoteBtn = document.getElementById("addNoteBtn");
    addNoteBtn.addEventListener('click', function(event) {
        try {
            editNote(noteToModify);

        } catch(e) {
            console.log(e.message);
            event.preventDefault();
        }
    });
}
else if (page == "newNote.html") {
    addNoteBtn = document.getElementById("addNoteBtn");
    addNoteBtn.addEventListener('click', function (event) {
        if (!addNote()) {
            event.preventDefault();
        }
    });
}
if (page == "index.html" || page == "editNote.html") {
    deleteNoteBtn.addEventListener('click', function (event) {
        if (!confirmAction()) {
            event.preventDefault();
        } else {
            removeNote(noteToModify);
        }
        if (page == "index.html") optionsMenu.classList.add("hidden");
    });
}

function confirmAction() {
    if (confirm("Are you sure?")) {
        return true;
    }
    return false;
}

// Opens note menu based on note clicked

function openNoteMenu(i) {
    var optionIcon = document.getElementById("noteActionBtn" + i).getBoundingClientRect();
    optionsMenu.style.top = optionIcon.top + "px";
    optionsMenu.style.left = (optionIcon.left - 110) + "px";

    if (((noteToModify != i) || (noteToModify == -1)))  {  
        noteToModify = i;
        localStorage.setItem("noteToModify", i);
          
        if ((optionsMenu.classList.contains("hidden"))) { 
            toggleOptionsMenu();
            areOptionsVisible = !areOptionsVisible;
            
        }
    
    } else if (noteToModify == i) {
        toggleOptionsMenu();
        areOptionsVisible = !areOptionsVisible;

    }

    // padaryt, kad paspaudus kitur, o ne ant ikonu, pasleptu options menu
}

function toggleOptionsMenu() {
    optionsMenu.classList.toggle("hidden");
}

// Lode note in the edit page

function loadNote() {
    var id = noteToModify;
    var noteTitle = document.getElementById("noteTitle");
    var noteText = document.getElementById("noteText");
    var noteToLoad = notes[id];

    noteTitle.innerHTML = noteToLoad.title;
    noteText.innerHTML = noteToLoad.text;

}


// Actions with note

function getCurrentDate() {
    var month = date.getMonth() + 1;
    var noteDate = date.getDate()
        + '/' + month
        + '/' + date.getFullYear();
    return noteDate;
}

function addNote() {
    var noteTitle = document.getElementById("noteTitle").value;
    var noteText = document.getElementById("noteText").value;

    if (noteText != "") {
        try {

            if (noteTitle == null) noteTitle = "";
            var note = {
                title: noteTitle,
                text: noteText,
                date: getCurrentDate()
            };

            notes.push(note);
            console.log("New note added")
        }
        catch (err) {
            alert(err.message);
        }
        finally {
            refreshPage();
            return true;
        }
    } else {
        alert('Note is empty!');
        return false;
    }

}

function editNote(id) {
    var noteTitle = document.getElementById("noteTitle").value;
    var noteText = document.getElementById("noteText").value;
    var noteToEdit = notes[id];
    console.log(noteToEdit.text);

    notes[id].title = noteTitle;
    notes[id].text = noteText;
    noteToEdit.date = getCurrentDate();
    
    updateStorage();


}

function removeNote(id) {

    if (notes[id]) {
        notes.splice(id, 1);
    }
    refreshPage();

}

// Displaying notes on the screen

function updateStorage() {
    myStorage.setItem('notes', JSON.stringify(notes));
}

function listNotes() {
    var noteList = [];

    for (var id in notes) {
        noteList.push(notes[id]);
    }

    return noteList;
}

function refreshPage() {
    updateStorage();
    var notes = listNotes();
    var html = "";


    // Padaryt, kad jeigu textas turi daug eiluciu, tai rodytu tik pirma ir pridetu daugtaskiu

    for (var i = 0; i < notes.length; i++) {
        if (notes[i].title != '') notes[i].text = notes[i].title;
        html += 
        '<div class="note" id="note' + i +'">' 
        +    '<div class="noteInfo">'
        +        '<div class="noteExtra">'
        +        '</div>'
        +        '<p class="noteDate">'
        +            ''+ notes[i].date +''
        +        '</p>'
        +    '</div>'
        +    '<div class="noteContent">'
        +        '<h3 class="noteText">' + notes[i].text +'</h3>'
        +        '<i onclick="openNoteMenu('+ i +')" class="fas fa-ellipsis-v noteAction" id="noteActionBtn' + i +'"></i>`'
        +            '</div>'
        +    '<hr class="noteDivider">'
       +'</div>';

    }

    var list = document.getElementById('allNotes');
    list.innerHTML = html;
}
