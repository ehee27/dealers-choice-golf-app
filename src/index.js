import axios from 'axios';

const golferList = document.getElementById('golfers');
const courseList = document.getElementById('courses');
const teeSheetList = document.getElementById('teeSheet');

let golfers, teeTimes;

const renderGolfers = (golfers) => {
  const golferId = window.location.hash.slice(1);
  const html = golfers.map(golfer => `
  <li class='${golfer.id === golferId ? 'selected' : ''}'>
    <a href="#${golfer.id}">
    ${golfer.name}</a>
  </li>
  `).join('');
  golferList.innerHTML = html;
};

const renderCourses = (courses) => {
  const html = courses.map(course => `
    <li>
      ${course.name}
      <br>
      <form>
        <label for="tee">Select Tee Time</label>
          <select name="teeTime" id="tee">
            <option value="8:00am">8:00am</option>
            <option value="8:30am">8:30am</option>
            <option value="9:00am">9:00am</option>
            <option value="9:30am">9:30am</option>
            <option value="10:00am">10:00am</option>
            <option value="10:30am">10:30am</option>
            <option value="11:00am">11:00am</option>
            <option value="11:30am">11:30am</option>
            <option value="12:00pm">12:00pm</option>
            <option value="12:30pm">12:30pm</option>
            <option value="1:00pm">1:00pm</option>
            <option value="1:30pm">1:30pm</option>
            <option value="2:00pm">2:00pm</option>
            <option value="2:30pm">2:30pm</option>
            <option value="3:00pm">3:00pm</option>
            <option value="3:30pm">3:30pm</option>
            <option value="4:00pm">4:00pm</option>
            <option value="4:30pm">4:30pm</option>
          </select>
          <button data-id='${course.id}'>Book</button>
      </form>
    </li>
  `).join('');
  courseList.innerHTML = html;

  courseList.addEventListener('click', async (e) => {
    const target = e.target;
    const golferId = window.location.hash.slice(1);
    if(target.tagName === 'BUTTON'){
      const time = target.parentElement.children[1].value;
      const _teeTime = {
        golferId: golferId,
        courseId: target.getAttribute('data-id'),
        tee: time
      }
      // const response = await axios.post(`/api/golfers/${golferId}/teeSheets`, _teeTime).data;
      const response  = await axios.post(`/api/golfers/${golferId}/teeSheets`, _teeTime);
      const tee = response.data;
      teeTimes.push(tee);
      renderTeeTimes(teeTimes);
    }
  })
};

const renderTeeTimes = (teeTimes) => {
  const html = teeTimes.map(teeTime => `
    <li>
      ${teeTime.course.name}
      ${teeTime.tee}
      <button id="delete" "data-id='${teeTime.id}'>Delete</button>
    </li>
  `).join('');
  teeSheetList.innerHTML = html;

  teeSheetList.addEventListener('click', async (e) => {
    const target = e.target;
    const golferId = window.location.hash.slice(1);
    if(target.tagName === 'BUTTON'){
      const teeTimeId = target.getAttribute('data-id');
      deleteTeetime(teeTimeId)
    }
  })
};

const deleteTeetime = async (teeTimeId) => {
  try {
    await axios.delete(`/api/golfers/${teeTimeId}/teeSheets`);
    console.log(`deleting teeTime ${teeTimeId}`)
    renderTeeTimes(teeTimes)
  } catch (error) {
  }
}


const init = async () => {
  try {
    golfers = (await axios.get('/api/golfers')).data;
    const  courses = (await axios.get('/api/courses')).data;
    renderGolfers(golfers);
    renderCourses(courses);
    const golferId = window.location.hash.slice(1);
    if(golferId){
      const url = `/api/golfers/${golferId}/teeSheets`;
      teeTimes = (await axios(url)).data;
      renderTeeTimes(teeTimes);
    }
  } 
  catch (error) {
    console.log(error)
  }
};

window.addEventListener('hashchange', async (e) => {
  const golferId = window.location.hash.slice(1);
  const url = `/api/golfers/${golferId}/teeSheets`;
  teeTimes = (await axios(url)).data;
  renderTeeTimes(teeTimes);
  renderGolfers(golfers);
  
})

init();