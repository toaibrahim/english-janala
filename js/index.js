
const createElements = (arr) => {
  const htmlElements = arr.map(el => `<span>${el}</span>`);
  return htmlElements.join(' ')
  
  
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
  if(status == true){
    document.getElementById('spinner').classList.remove('hidden');
    document.getElementById('card-container').classList.add('hidden')
  }else{
    document.getElementById('spinner').classList.add('hidden');
    document.getElementById('card-container').classList.remove('hidden')
  }
}

const loadLessons = () => {
  const url = 'https://openapi.programming-hero.com/api/levels/all';
  fetch(url)
    .then(response => response.json())
    .then(json => displayLessons(json.data));
};


const removeActive = () => {
  const lessonButton = document.querySelectorAll('.lesson-button');
  lessonButton.forEach((btn) => btn.classList.remove('active'))
  
}


const loadLevelWord = (id) => {
  manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
          removeActive();//remove all active class
          const clickBtn = document.getElementById(`lesson-btn-${id}`)
          clickBtn.classList.add('active');
          
          displayLevelWord(data.data)
        });
    
    
}

const loadWordDetail = async(id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details);
  
}

const displayWordDetails = (word) => {
  console.log(word.data.word);
  const detailsBox = document.getElementById('details-container');
  detailsBox.innerHTML = `
    <h3 class="text-lg font-bold">${word.data.word} ( <i class="fa-solid fa-microphone-lines"></i> : <span>${word.data.pronunciation}</span> )</h3>
      <p class="pt-4 font-semibold">Meaning</p>
      <p class="pb-4">${word.data.meaning}</p>

      <p class="font-semibold mb-4">Example</p>
      <p class="mb-4">${word.data.sentence}</p>
      <h4 class="font-semibold mb-4">সমার্থক শব্দগুলো</h4>
      <div class="flex justify-start items-center gap-5">
        ${createElements(word.data.synonyms)}
      </div>
  `
  document.getElementById('my_modal_5').showModal();
  
}

const displayLevelWord = (words) => {
    const cardContainer = document.getElementById('card-container');

    cardContainer.innerHTML = '';
    if(words.length === 0){
      cardContainer.innerHTML = `
        <div id="no-lesson">
            <img class='w-[96px] h-[96px] mx-auto' src="assets/alert-error.png" alt="">
            <p class="text-[13px] text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="text-[#292524] text-4xl font-medium mt-5">নেক্সট Lesson এ যান</h2>
          
          </div>
      `
      
    }

    const noLessonSelected = document.getElementById('no-lesson');
    noLessonSelected.style.display = 'none';

    words.forEach(word => {
        const div = document.createElement('div');

        div.innerHTML = `
            <div class="card bg-white px-[100px] py-[56px] text-center my-4">
              <h2 class="text-[32px] font-bold">${word.word? word.word : 'শব্দ পাওয়া যায়নি'}</h2>
              <p class="text-sm">${word.pronunciation}</p>
              <h2 class="text-[32px] font-semibold font-bangla">"${word.meaning?word.meaning : 'অর্থ পাওয়া যায়নি'} / ${word.pronunciation? word.pronunciation : 'উচ্চারণ পাওয়া যায়নি '}"</h2>
              <div class="flex justify-between items-center mt-5">
                <div onclick="loadWordDetail(${word.id})" class="text-center flex justify-center items-center w-14 h-14 bg-[#1a90ff1a] rounded-lg"><i class="fa-solid fa-circle-info"></i></div>
                <div onclick = "pronounceWord('${word.word}')" class="text-center flex justify-center items-center w-14 h-14 bg-[#1a90ff1a] rounded-lg"><i class="fa-solid fa-volume-high"></i></div>
              </div>
            </div>
        `
        cardContainer.appendChild(div)
    });

    manageSpinner(false)
    
}


const displayLessons = (lessons) =>{
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = "";

    lessons.forEach(lesson => {
        const div = document.createElement('div');
        div.innerHTML = `
            <li>
                <a href="#">
                  <button id = 'lesson-btn-${lesson.level_no}' onclick = "loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-button"><i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}</button>
                </a>
              </li>
        `
        levelContainer.appendChild(div);
    });
    
}

loadLessons();

document.getElementById('search-btn').addEventListener('click',()=>{
  removeActive();
  const input = document.getElementById('search-input');
  const searchValue = input.value.trim().toLowerCase();
  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      console.log(allWords);
       
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue) 
      );
      displayLevelWord(filterWords);   
       
       
    })
  
  
})