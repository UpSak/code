const result = document.querySelector(".result-box");
const search = document.getElementById("apisearch");
// const apikey = "e66e16b1ecd0e5f943197cede949f2af516a02c4";
let comissue = [];

search.addEventListener('keyup', (e) => {
  const searchstring = e.target.value.toLowerCase();
  let filtered = [];
  if (searchstring) {
      filtered = comissue.filter((issue) => {
          return issue.name.toLowerCase().includes(searchstring);
      }).slice(0, 5); // Limit to 5 items
  }
  display(filtered);
});


const load = async() => {
  try {
    comissue = [];
    const res = await fetch("http://localhost:3000/data");
    comissue = await res.json();
    console.log(comissue);
    console.log(comissue);
    display([]);
  } catch(err){
    console.error(err);
  }
};

const display = (issues) => {
  if(!issues || issues.length === 0){
    result.innerHTML = `<p> No results found</p>`;
    return;
  }

  const htmlstring = issues
    .map((issues) => {
      return `
      <div class="issues" >
        <p id = text><img src = "${issues.image.tiny_url}">${issues.name}<p>
      </div>
      `;
    })
    .join();
    result.innerHTML = htmlstring



    const issueElements = document.querySelectorAll('.issues');
    const hselected = document.querySelector('#hselect');
    const selected = document.querySelector('#selected');
    const smg = document.querySelector('#smg');
    const imgurl = document.querySelector('#imgurl');


    issueElements.forEach((issueElement, index) => {
      issueElement.addEventListener('click', () => {
        search.value = issues[index].name;
        selected.textContent = issues[index].name;
        hselected.value = issues[index].name;
        imgurl.value = issues[index].image.small_url;
        smg.alt = issues[index].name
        smg.src = issues[index].image.small_url;
        console.log(issues[index].name);
      });
    });
    
  };



load();


