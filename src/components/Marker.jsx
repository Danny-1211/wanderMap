import '../assets/utils/marker.scss';
export function Marker(place, mapContainerEl, mapCanvasEl) {
  const el = document.createElement('div');
  el.className = 'marker';

  const popup = document.createElement('div');
  popup.className = 'pop-noShow';


  // el.appendChild(popup);
  mapContainerEl.appendChild(popup);


  el.addEventListener("mouseenter", function (e) {
    popup.innerHTML = `
    <div class="popup-content">
      <div class="popup-image">
        <img src=${place.pic} alt="" />
      </div>
      <div class="popup-info">
        <div class="info-title"> <p>${place.title}</p></div>     
        <div class="info-date"><p>${place.date}</p></div>
        <div class="info-desc"><p>${place.description}</p></div>
      </div>
    </div>
    <div class="popup-tip"></div>
  `;
    // 定位 popup 位置（可加動畫、偏移）
    const screenPos = mapCanvasEl.project([place.lng, place.lat]);
    popup.style.position = 'absolute';
    popup.style.left = `${screenPos.x}px`;
    popup.style.top = `${screenPos.y}px`;
    removeClass(popup, 'pop-noShow');
  });

  el.addEventListener("mouseleave ", function (e) {
    addClass(popup, 'pop-noShow');
    removeClass(popup, 'pop-show');
  });

    // 當滑鼠移到 popup 上時也不消失
  popup.addEventListener("mouseenter", function () {
    removeClass(popup, 'pop-noShow');
  });
  popup.addEventListener("mouseleave", function () {
    addClass(popup, 'pop-noShow');
    removeClass(popup, 'pop-show');
  });
  
  return {el, popup, place};
}



function addClass(element, name) {
  element.classList.add(name);
}

function removeClass(element, name) {
  element.classList.remove(name);
}


export default Marker;