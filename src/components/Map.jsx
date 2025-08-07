import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
import { useState, useRef, useEffect } from 'react'
import '../assets/utils/map.scss'
import Marker from './Marker'

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
        mapRef.current.on('mousedown', () => {
            userInteracting = true;
        });

        // 	使用者放開點擊
        mapRef.current.on('mouseup', () => {
            userInteracting = false;
            spinGlobe();
        });

        //	拖曳結束
        mapRef.current.on('dragend', () => {
            userInteracting = false;
            spinGlobe();
        });

        // 使用滑鼠操作來改變地圖俯視角
        mapRef.current.on('pitchend', () => {
            userInteracting = false;
            spinGlobe();
        });

        // 旋轉地球
        mapRef.current.on('rotateend', () => {
            userInteracting = false;
            spinGlobe();
        });

        // 	地圖移動完畢
        mapRef.current.on('moveend', () => {
            spinGlobe();
        });
        
        return () => {
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
        places.forEach(item => {
            new mapboxgl.Marker(Marker(item,mapContainerRef.current ))
                .setLngLat([item.lng, item.lat])
                .addTo(mapRef.current);
        });
        spinGlobe(); // 當地圖跟地點載好就開始自轉
    }, [places, mapReady])

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

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div ref={mapContainerRef}></div>
        </div>
    );
}

export default Map 