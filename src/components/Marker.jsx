import '../assets/utils/marker.scss';
export function Marker(place, mapContainerEl) {
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
    const rect = el.getBoundingClientRect();
    popup.style.position = 'absolute';
    popup.style.left = `${rect.left + window.scrollX}px`;
    popup.style.top = `${rect.top + window.scrollY}px`; // 視覺上浮在 marker 上方
    popup.style.zIndex = 1000;
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
  
  return el;
}



function addClass(element, name) {
  element.classList.add(name);
}

function removeClass(element, name) {
  element.classList.remove(name);
}


export default Marker;