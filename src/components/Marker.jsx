import '../assets/utils/marker.scss'
export function Marker(place) {
  const el = document.createElement('div');
  el.className = 'marker';

  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerHTML = `
    <div class="popup-content">
      <div class="popup-image">
        <img src="" alt="" />
      </div>
      <div class="popup-info">
        <p></p>
      </div>
    </div>
    <div class="popup-tip"></div>
  `;

  el.appendChild(popup);
  return el;
}

function addClass(element, name) {
    element.classList.add(name);
}

function removeClass(element, name) {
    element.classList.remove(name);
}


export default Marker;