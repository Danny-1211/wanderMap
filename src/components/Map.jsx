import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
import { useState, useRef, useEffect } from 'react'
import '../assets/utils/map.scss'
import Marker from './Marker'
import SelectBtn from './SelectBtn.jsx';
mapboxgl.accessToken = import.meta.env.VITE_MAP_TOKEN;

export function Map() {
    const [mapReady, setMapReady] = useState(false) // 地圖是否建立完成
    const [places, setPlace] = useState([]); // 存放 map.json 
    const mapContainerRef = useRef(null); // 地圖容器
    let mapRef = useRef(null); // 地圖 OBJ
    let userInteracting = false; // 使用者是否有在跟地圖互動
    let spinEnaled = true; // 地圖是否轉動
    const secondsPerRevolution = 120; // 在縮小時轉一圈兩分鐘
    const maxSpinZoom = 8;
    const slowSpinZoom = 3;
    let markers = [];
    // 專門渲染一次地圖
    useEffect(() => {
        if (mapRef.current) return; //   如果已經有地圖就不在重新建立一個
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/danny21316/cmdiectp1005701sj4tce7jd4',
            center: [120.2513, 23.1417], // 經緯度
            zoom: 1.5,
            attributionControl: false
        })

        // 縮放按鈕
        mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // 標記地圖建立完成
        setMapReady(true);

        // 	使用者點擊
        mapRef.current.on('mousedown', createGeneralHandler('mousedown'));

        // 	使用者放開點擊
        mapRef.current.on('mouseup', createGeneralHandler('mouseup'));

        //	拖曳結束
        mapRef.current.on('dragend', createGeneralHandler('dragend'));

        // 使用滑鼠操作來改變地圖俯視角
        mapRef.current.on('pitchend', createGeneralHandler('pitchend'));

        // 旋轉地球
        mapRef.current.on('rotateend', createGeneralHandler('rotateend'));

        // 	地圖移動完畢
        mapRef.current.on('moveend', createGeneralHandler('moveend'));

        return () => {
            mapRef.current.off('mousedown', GenrenalEvent);
            mapRef.current.off('mouseup', GenrenalEvent);
            mapRef.current.off('dragend', GenrenalEvent);
            mapRef.current.off('pitchend', GenrenalEvent);
            mapRef.current.off('rotateend', GenrenalEvent);
            mapRef.current.off('moveend', GenrenalEvent);
            mapRef?.current.remove(); // component 卸載時清理地圖
            mapRef.current = null;
            setMapReady(false);
        };
    }, []);

    // 取得地點資料
    useEffect(() => {
        fetch('/json/map.json')
            .then(res => res.json()) // 轉成 JSON
            .then((data) => {
                //成功結果處理
                setPlace(data);
            }).catch((error) => {
                //錯誤結果處理
                console.log(error)
            })
    }, []);

    // 建立 Marker
    useEffect(() => {
        if (!mapReady || !places.length) return;
        markers.length = 0; // 清空舊的
        places.forEach(item => {
            let markerObj = Marker(item, mapContainerRef.current, mapRef.current);
            new mapboxgl.Marker(markerObj.el)
                .setLngLat([item.lng, item.lat])
                .addTo(mapRef.current);
            markers.push(markerObj)
        });
        spinGlobe(); // 當地圖跟地點載好就開始自轉
    }, [places, mapReady])

    // 當地球自轉時， popup 會跟著他自己的 marker 位置
    useEffect(() => {
        if (!mapReady) return;
        const moveHandler = () => {
            markers.forEach(({ popup, place }) => {
                const screenPos = mapRef.current.project([place.lng, place.lat]);
                popup.style.left = `${screenPos.x}px`;
                popup.style.top = `${screenPos.y}px`;
            });
        };
        mapRef.current.on('move', moveHandler);
        return () => {
            mapRef.current.off('move', moveHandler);
        };
    }, [mapReady, places]); // places 變動時也要重註冊



    function spinGlobe() {
        const zoom = mapRef.current.getZoom();
        if (spinEnaled && !userInteracting && zoom < maxSpinZoom) { // 地圖縮小狀態時才開始旋轉
            let distancePerSecond = 360 / secondsPerRevolution; // 每秒要轉幾度經度
            if (zoom > slowSpinZoom) { // 地圖在不同放大層級（zoom）時，自動旋轉的速度漸進變慢，直到在 zoom 越高（越放大）時幾乎停止旋轉。
                const zoomDif = 0; // 目前先讓縮小到3以下就不會轉動
                // (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
                distancePerSecond *= zoomDif;
            }
            const center = mapRef.current.getCenter();
            center.lng -= distancePerSecond; // 讓地圖的經度（東西方向）每次往左移動一點點，也就是讓地圖「轉動」起來。
            mapRef.current.easeTo({ center, duration: 1000, easing: (n) => n });// 平滑動畫移動地圖( 完成後會觸發 moveend 事件 ) ， 移動後的新中心點( center ) ， 動畫時間 ， 動畫速度曲線 (n) => n 表示線性移動（均速）
        }
    }

    // 每個事件執行不一樣的事情
    function GenrenalEvent(eventName) {
        switch (eventName) {
            case 'mousedown':
                userInteracting = true;
                break;
            case 'moveend':
                spinGlobe();
                break;
            default:
                userInteracting = false;
                spinGlobe();
                break;
        }
    }

    // 註冊事件時要用的 handler
    function createGeneralHandler(eventName) {
        return function () {
            GenrenalEvent(eventName);
        };
    }

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div ref={mapContainerRef}></div>
            {places ? <SelectBtn places={places} /> : <div>載入中...</div>}
        </div>
    );
}

export default Map 