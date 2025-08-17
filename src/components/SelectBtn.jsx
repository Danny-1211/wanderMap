import '../assets/utils/selectBtn.scss';
import { useState } from 'react';

export function SelectBtn({ places }) {
    let list = [];
    const [showMenu, setShowMenu] = useState(false);
    if (places) {
        list = getTrip(places);
    }
    return (
        <>
            <div className={`${showMenu ? 'no_show' : 'show'} tip`} onClick={() => setShowMenu(!showMenu)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#B9A28A" className="bg-sky-700">
                    <path d="M6.5 2.25a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0V4.5h6.75a.75.75 0 0 0 0-1.5H6.5v-.75ZM11 6.5a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0v-.75h2.25a.75.75 0 0 0 0-1.5H11V6.5ZM5.75 10a.75.75 0 0 1 .75.75v.75h6.75a.75.75 0 0 1 0 1.5H6.5v.75a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75ZM2.75 7.25H8.5v1.5H2.75a.75.75 0 0 1 0-1.5ZM4 3H2.75a.75.75 0 0 0 0 1.5H4V3ZM2.75 11.5H4V13H2.75a.75.75 0 0 1 0-1.5Z" />
                </svg>
            </div>
            <ul className={`${showMenu ? ' show' : 'no_show'} btn-group`}>
                {list.map((item, idx) => {
                    return (
                        <li className="btn-content" key={idx} onClick={() => setShowMenu(!showMenu)}>
                            <p>{item}</p>
                        </li>
                    )
                })}
            </ul>
        </>
    )

};


function getTrip(arr) {
    // 取得所有 trip 名稱
    const trips = arr.map(item => item.trip);
    // 用 Set 去重複(只能儲存任何資料的唯一值)，先把 Array 轉為 Set，此時重複的值會被移除，再將 Set 轉為 Array
    const uniqueTrips = [...new Set(trips)];
    return uniqueTrips

}

export default SelectBtn;